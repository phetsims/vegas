// Copyright 2014-2021, University of Colorado Boulder

/**
 * Button for selecting a game level.
 * Includes an icon, score display, and (optional) 'best time' display.
 * See specification in https://github.com/phetsims/vegas/issues/59.
 * Originally named LevelSelectionItemNode, renamed to LevelSelectionButton on 4/10/2018.
 *
 * @author John Blanco
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Andrea Lin
 */

import Dimension2 from '../../dot/js/Dimension2.js';
import merge from '../../phet-core/js/merge.js';
import PhetFont from '../../scenery-phet/js/PhetFont.js';
import { Node } from '../../scenery/js/imports.js';
import { Rectangle } from '../../scenery/js/imports.js';
import { Text } from '../../scenery/js/imports.js';
import RectangularPushButton from '../../sun/js/buttons/RectangularPushButton.js';
import SoundClip from '../../tambo/js/sound-generators/SoundClip.js';
import soundConstants from '../../tambo/js/soundConstants.js';
import soundManager from '../../tambo/js/soundManager.js';
import Tandem from '../../tandem/js/Tandem.js';
import buttonSound from '../sounds/level-selection-button_mp3.js';
import GameTimer from './GameTimer.js';
import ScoreDisplayLabeledNumber from './ScoreDisplayLabeledNumber.js';
import ScoreDisplayLabeledStars from './ScoreDisplayLabeledStars.js';
import ScoreDisplayNumberAndStar from './ScoreDisplayNumberAndStar.js';
import ScoreDisplayStars from './ScoreDisplayStars.js';
import vegas from './vegas.js';

// constants
const SCALING_TOLERANCE = 1E-4; // Empirically chosen as something the human eye is unlikely to notice.
const VALID_SCORE_DISPLAY_CONSTRUCTORS = [

  // All constructors must have the same signature!
  ScoreDisplayLabeledNumber, ScoreDisplayLabeledStars, ScoreDisplayStars, ScoreDisplayNumberAndStar
];

class LevelSelectionButton extends RectangularPushButton {

  /**
   * @param {Node} icon - appears on the button above the score display, scaled to fit
   * @param {Property.<number>} scoreProperty
   * @param {Object} [options]
   */
  constructor( icon, scoreProperty, options ) {

    assert && assert( icon instanceof Node );

    options = merge( {

      // RectangularPushButton options
      cornerRadius: 10,
      baseColor: 'rgb( 242, 255, 204 )',
      xMargin: 10,
      yMargin: 10,

      // Used to size the content
      buttonWidth: 150,
      buttonHeight: 150,

      // score display
      scoreDisplayConstructor: ScoreDisplayStars,
      scoreDisplayOptions: null, // passed to scoreDisplayConstructor
      scoreDisplayProportion: 0.2, // percentage of the button height occupied by scoreDisplay, (0,0.5]
      scoreDisplayMinXMargin: 10, // horizontal margin between scoreDisplay and its background
      scoreDisplayMinYMargin: 5,  // vertical margin between scoreDisplay and its background
      iconToScoreDisplayYSpace: 10, // vertical space between icon and score display

      // best time (optional)
      bestTimeProperty: null, // null if no best time || {Property.<number>} best time in seconds
      bestTimeVisibleProperty: null, // null || Property.<boolean>} controls visibility of best time
      bestTimeFill: 'black',
      bestTimeFont: new PhetFont( 24 ),
      bestTimeYSpacing: 10,  // vertical space between drop shadow and best time

      // sound generation

      // {number} - A value that is used to configure the default sound player.  This is used to alter the sound when
      // the button is in a group, which it usually is.  Note that this assumes zero-based indexing, which is often not
      // the norm for the game levels.  This is ignored if a custom sound player is defined.
      soundPlayerIndex: 0,

      // {SoundPlayer} - Sound player for this button.  If null, a default will be created.  Use SoundPlayer.NO_SOUND to
      // turn off sound generation.
      soundPlayer: null,

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    assert && assert( _.includes( VALID_SCORE_DISPLAY_CONSTRUCTORS, options.scoreDisplayConstructor,
      `invalid scoreDisplayConstructor: ${options.scoreDisplayConstructor}` ) );
    assert && assert(
    options.scoreDisplayProportion > 0 && options.scoreDisplayProportion <= 0.5,
      'scoreDisplayProportion value out of range'
    );
    assert && assert(
      options.soundPlayer === null || options.soundPlayerIndex === 0,
      'a sound player and an index should not both be specified'
    );

    const maxContentWidth = options.buttonWidth - 2 * options.xMargin;

    const scoreDisplay = new options.scoreDisplayConstructor( scoreProperty, options.scoreDisplayOptions );

    // Background behind scoreDisplay
    const scoreDisplayBackgroundHeight = options.buttonHeight * options.scoreDisplayProportion;
    const scoreDisplayBackground = new Rectangle( 0, 0, maxContentWidth, scoreDisplayBackgroundHeight, {
      cornerRadius: options.cornerRadius,
      fill: 'white',
      stroke: 'black',
      pickable: false
    } );

    // constrain scoreDisplay to fit in scoreDisplayBackground
    scoreDisplay.maxWidth = scoreDisplayBackground.width - ( 2 * options.scoreDisplayMinXMargin );
    scoreDisplay.maxHeight = scoreDisplayBackground.height - ( 2 * options.scoreDisplayMinYMargin );

    // Icon, scaled and padded to fit and to make the button size correct.
    const iconHeight = options.buttonHeight - scoreDisplayBackground.height - 2 * options.yMargin - options.iconToScoreDisplayYSpace;
    const iconSize = new Dimension2( maxContentWidth, iconHeight );
    const adjustedIcon = LevelSelectionButton.createSizedImageNode( icon, iconSize );
    adjustedIcon.centerX = scoreDisplayBackground.centerX;
    adjustedIcon.bottom = scoreDisplayBackground.top - options.iconToScoreDisplayYSpace;

    // Keep scoreDisplay centered in its background when its bounds change
    const scoreDisplayUpdateLayout = () => {
      scoreDisplay.center = scoreDisplayBackground.center;
    };
    scoreDisplay.boundsProperty.lazyLink( scoreDisplayUpdateLayout );
    scoreDisplayUpdateLayout();

    assert && assert( !options.content, 'LevelSelectionButton sets content' );
    options.content = new Node( {
      children: [ adjustedIcon, scoreDisplayBackground, scoreDisplay ]
    } );

    // Sound generation - if no sound player was provided, create the default.
    if ( !options.soundPlayer ) {
      assert && assert( options.soundPlayerIndex >= 0, 'invalid value for soundPlayerIndex' );
      const soundClip = new SoundClip( buttonSound, {
        initialOutputLevel: 0.5,
        rateChangesAffectPlayingSounds: false
      } );
      soundManager.addSoundGenerator( soundClip, { categoryName: 'user-interface' } );
      options.soundPlayer = {
        play() {
          soundClip.setPlaybackRate( Math.pow( soundConstants.TWELFTH_ROOT_OF_TWO, options.soundPlayerIndex ), 0 );
          soundClip.play();
        }
      };
    }

    super( options );

    // Variables that are set if options.bestTimeProperty is specified.
    let bestTimeListener = null;
    let bestTimeVisibleListener = null;

    // Best time decoration (optional), centered below the button, does not move when button is pressed
    if ( options.bestTimeProperty ) {

      const bestTimeNode = new Text( '', {
        font: options.bestTimeFont,
        fill: options.bestTimeFill,
        maxWidth: this.width // constrain to width of the push button
      } );
      const centerX = this.centerX;
      bestTimeNode.top = this.bottom + options.bestTimeYSpacing;
      this.addChild( bestTimeNode );

      bestTimeListener = bestTime => {
        bestTimeNode.text = ( bestTime ? GameTimer.formatTime( bestTime ) : '' );
        bestTimeNode.centerX = centerX;
      };
      options.bestTimeProperty.link( bestTimeListener );

      if ( options.bestTimeVisibleProperty ) {
        bestTimeVisibleListener = visible => {
          bestTimeNode.visible = visible;
        };
        options.bestTimeVisibleProperty.link( bestTimeVisibleListener );
      }
    }

    // @private
    this.disposeLevelSelectionButton = () => {

      scoreDisplay.dispose();

      if ( bestTimeListener && options.bestTimeProperty.hasListener( bestTimeListener ) ) {
        options.bestTimeProperty.unlink( bestTimeListener );
      }

      if ( bestTimeVisibleListener && options.bestTimeVisibleProperty.hasListener( bestTimeVisibleListener ) ) {
        options.bestTimeVisibleProperty.unlink( bestTimeVisibleListener );
      }
    };
  }

  /**
   * Creates a new icon with the same dimensions as the specified icon. The new icon will be scaled to fit,
   * and a background with the specified size may be added to ensure that the bounds of the returned node are correct.
   * @public
   *
   * @param {Node} icon
   * @param {Dimension2} size
   * @returns {Node}
   */
  static createSizedImageNode( icon, size ) {
    icon.scale( Math.min( size.width / icon.bounds.width, size.height / icon.bounds.height ) );
    if ( Math.abs( icon.bounds.width - size.width ) < SCALING_TOLERANCE &&
         Math.abs( icon.bounds.height - size.height ) < SCALING_TOLERANCE ) {

      // The aspect ratio of the icon matched that of the specified size, so no padding is necessary.
      return icon;
    }

    // else padding is needed in either the horizontal or vertical direction.
    const background = Rectangle.dimension( size );
    icon.center = background.center;
    background.addChild( icon );
    return background;
  }

  /**
   * @public
   * @override
   */
  dispose() {
    this.disposeLevelSelectionButton();
    super.dispose();
  }
}

vegas.register( 'LevelSelectionButton', LevelSelectionButton );
export default LevelSelectionButton;