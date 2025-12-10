// Copyright 2014-2025, University of Colorado Boulder

/**
 * LevelSelectionButton is a push button for selecting a game level. It is typically created by LevelSelectionButtonGroup.
 * The original specification was done in https://github.com/phetsims/vegas/issues/59, but there have been numerous
 * changes since then.
 *
 * Note that LevelSelectionButton originally supported an optional 'best time' display. That display was intentionally
 * removed from LevelSelectionButton, and from the level-selection user-interface in general, as the result of
 * a design meeting on 10/15/2023. See https://github.com/phetsims/vegas/issues/120#issuecomment-1858310218.
 *
 * @author John Blanco
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Andrea Lin
 */

import BooleanProperty from '../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../axon/js/DerivedProperty.js';
import Property from '../../axon/js/Property.js';
import ReadOnlyProperty from '../../axon/js/ReadOnlyProperty.js';
import { TReadOnlyProperty } from '../../axon/js/TReadOnlyProperty.js';
import Dimension2 from '../../dot/js/Dimension2.js';
import optionize from '../../phet-core/js/optionize.js';
import StrictOmit from '../../phet-core/js/types/StrictOmit.js';
import PhetFont from '../../scenery-phet/js/PhetFont.js';
import { findStringProperty } from '../../scenery/js/accessibility/pdom/findStringProperty.js';
import VBox from '../../scenery/js/layout/nodes/VBox.js';
import Node from '../../scenery/js/nodes/Node.js';
import Rectangle from '../../scenery/js/nodes/Rectangle.js';
import Text from '../../scenery/js/nodes/Text.js';
import Font from '../../scenery/js/util/Font.js';
import TColor from '../../scenery/js/util/TColor.js';
import RectangularPushButton, { RectangularPushButtonOptions } from '../../sun/js/buttons/RectangularPushButton.js';
import SoundClip from '../../tambo/js/sound-generators/SoundClip.js';
import soundConstants from '../../tambo/js/soundConstants.js';
import soundManager from '../../tambo/js/soundManager.js';
import Tandem from '../../tandem/js/Tandem.js';
import levelSelectionButton_mp3 from '../sounds/levelSelectionButton_mp3.js';
import GameTimer from './GameTimer.js';
import ScoreDisplayStars from './ScoreDisplayStars.js';
import { TScoreDisplayNode } from './TScoreDisplayNode.js';
import vegas from './vegas.js';
import VegasFluent from './VegasFluent.js';

// constants
const DEFAULT_BEST_TIME_FONT = new PhetFont( 24 );

type SelfOptions = {

  // Used to size the content
  buttonWidth?: number;
  buttonHeight?: number;

  // score display
  createScoreDisplay?: ( scoreProperty: ReadOnlyProperty<number> ) => TScoreDisplayNode;
  scoreDisplayProportion?: number; // percentage of the button height occupied by scoreDisplay, (0,0.5]
  scoreDisplayMinXMargin?: number; // horizontal margin between scoreDisplay and its background
  scoreDisplayMinYMargin?: number;  // vertical margin between scoreDisplay and its background
  iconToScoreDisplayYSpace?: number; // vertical space between icon and score display


  // The best time for the current score, displayed on the button. If null, no time is displayed.
  // Use LevelSelectionButton.updateScoreWithBestTime() to update the score and best time together.
  bestTimeForScoreProperty?: TReadOnlyProperty<number | null> | null;
  bestTimeFill?: TColor;
  bestTimeFont?: Font;

  // If provided, controls the visibility of the best time display. Otherwise, visibility is determined by whether the
  // bestTimeForScoreProperty has a non-null value.
  bestTimeVisibleProperty?: TReadOnlyProperty<boolean>;

  // Configures the soundPlayer for a specific game level. Note that this assumes zero-based indexing for game level,
  // which is often not the case. This option is ignored if RectangularPushButtonOptions.soundPlayer is provided.
  soundPlayerIndex?: number;

  // A brief accessible name for the level. It is added to the accessibleName after the level number.
  // For example, if the value is "Beginner", the accessibleName will be:
  // "Level 1: Beginner, 2 stars".
  accessibleBriefLevelName?: TReadOnlyProperty<string> | null;

  // The number for the level. This is used in the accessibleName for the button. 1-based.
  accessibleLevelNumber?: number;
};

// Cannot provide a custom accessibleName, see options in SelfOptions which are used in a pattern for this button's accessibleName.
export type LevelSelectionButtonOptions = SelfOptions & StrictOmit<RectangularPushButtonOptions, 'content' | 'accessibleName'>;

export default class LevelSelectionButton extends RectangularPushButton {

  private readonly disposeLevelSelectionButton: () => void;

  /**
   * @param icon - appears on the button above the score display, scaled to fit
   * @param scoreProperty
   * @param providedOptions
   */
  public constructor( icon: Node, scoreProperty: ReadOnlyProperty<number>, providedOptions?: LevelSelectionButtonOptions ) {

    const options = optionize<LevelSelectionButtonOptions, SelfOptions, RectangularPushButtonOptions>()( {

      // SelfOptions
      buttonWidth: 150,
      buttonHeight: 150,
      createScoreDisplay: () => new ScoreDisplayStars( scoreProperty ),
      scoreDisplayProportion: 0.2,
      scoreDisplayMinXMargin: 10,
      scoreDisplayMinYMargin: 5,
      iconToScoreDisplayYSpace: 10,
      accessibleBriefLevelName: null,
      accessibleLevelNumber: 1,
      bestTimeForScoreProperty: null, // default is no best time display
      bestTimeFill: 'black',
      bestTimeFont: DEFAULT_BEST_TIME_FONT,
      bestTimeVisibleProperty: new BooleanProperty( true ),

      // RectangularPushButton options
      cornerRadius: 10,
      baseColor: 'rgb( 242, 255, 204 )',
      xMargin: 10,
      yMargin: 10,
      soundPlayerIndex: 0,

      // phet-io
      tandem: Tandem.REQUIRED
    }, providedOptions );

    assert && assert( options.soundPlayerIndex >= 0, `invalid soundPlayerIndex: ${options.soundPlayerIndex}` );

    const maxContentWidth = options.buttonWidth - 2 * options.xMargin;

    const scoreDisplay = options.createScoreDisplay( scoreProperty );

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

    const contentVBox = new VBox( {
      children: [
        new Node( {
          children: [ adjustedIcon, scoreDisplayBackground, scoreDisplay ]
        } )
      ],

      // if we add best time, we want to include it in bounds even when not visible
      excludeInvisibleChildrenFromBounds: false
    } );
    options.content = contentVBox;

    // TODO: Update accessible name with best time, https://github.com/phetsims/vegas/issues/130
    // The accessibleName pattern depends on whether there is a brief descriptor.
    let accessibleNameStringProperty;
    if ( options.accessibleBriefLevelName ) {
      accessibleNameStringProperty = VegasFluent.a11y.levelSelectionButton.accessibleNameWithLevelName.createProperty( {
        levelNumber: options.accessibleLevelNumber,
        levelName: options.accessibleBriefLevelName,
        scoreDescription: scoreDisplay.accessibleScoreStringProperty
      } );
    }
    else {
      accessibleNameStringProperty = VegasFluent.a11y.levelSelectionButton.accessibleName.createProperty( {
        levelNumber: options.accessibleLevelNumber,
        scoreDescription: scoreDisplay.accessibleScoreStringProperty
      } );
    }
    options.accessibleName = accessibleNameStringProperty;

    // If no sound player was provided, create the default.
    if ( options.soundPlayer === undefined ) {
      const soundClip = new SoundClip( levelSelectionButton_mp3, {
        initialOutputLevel: 0.5,
        rateChangesAffectPlayingSounds: false
      } );
      soundManager.addSoundGenerator( soundClip, { categoryName: 'user-interface' } );
      options.soundPlayer = {
        play() {
          soundClip.setPlaybackRate( Math.pow( soundConstants.TWELFTH_ROOT_OF_TWO, options.soundPlayerIndex ), 0 );
          soundClip.play();
        },
        stop() {
          soundClip.stop();
        }
      };
    }

    super( options );

    // Variables that are set if options.bestTimeForScoreProperty is specified.
    let bestTimeListener: ( ( bestTime: number | null ) => void ) | null = null;
    let bestTimeNodeVisibleProperty: TReadOnlyProperty<boolean> | null = null;

    // Best time decoration (optional), centered below the button, does not move when button is pressed
    if ( options.bestTimeForScoreProperty ) {

      bestTimeNodeVisibleProperty = new DerivedProperty( [ options.bestTimeForScoreProperty, options.bestTimeVisibleProperty ], ( bestTime, visible ) => {
        // Best time should only be visible if the best time value is non-null and greater than 0
        return visible && bestTime !== null && bestTime > 0;
      } );

      const bestTimeNode = new Text( '', {
        visibleProperty: bestTimeNodeVisibleProperty,
        font: options.bestTimeFont,
        fill: options.bestTimeFill,
        maxWidth: this.width // constrain to width of the push button
      } );
      contentVBox.addChild( bestTimeNode );

      bestTimeListener = ( bestTime: number | null ) => {
        if ( bestTime !== null ) {
          bestTimeNode.string = ( bestTime ? GameTimer.formatTime( bestTime ) : '' );
        }
      };
      options.bestTimeForScoreProperty.link( bestTimeListener );
    }

    // If no accessibleName is provided, look for one in the content Node
    if ( !options.accessibleName ) {
      this.accessibleName = findStringProperty( icon );
    }

    this.disposeLevelSelectionButton = () => {
      scoreDisplay.dispose();

      if ( options.bestTimeForScoreProperty && bestTimeListener && options.bestTimeForScoreProperty.hasListener( bestTimeListener ) ) {
        options.bestTimeForScoreProperty.unlink( bestTimeListener );
      }

      if ( bestTimeNodeVisibleProperty ) {
        bestTimeNodeVisibleProperty.dispose();
      }
    };
  }

  /**
   * Updates the score and time together, ensuring that they remain appropriately synchronized. Will return true if
   * either the score or time was updated.
   * @param score
   * @param time
   * @param scoreProperty
   * @param bestTimeForScoreProperty
   */
  public static tryUpdateScoreAndBestTime( score: number, time: number, scoreProperty: Property<number>,
                                           bestTimeForScoreProperty: Property<number> | Property<number | null> ): boolean {
    // Track whether we have a new best score or time.
    let newBest = false;

    // If we have a new high score, update both score and best time.
    if ( score > scoreProperty.value ) {
      scoreProperty.value = score;
      bestTimeForScoreProperty.value = time;
      newBest = true;
    }

    // Only update the time if it has not been recorded yet, or if the new time is better than the old time when
    // the score is tied.
    else if ( bestTimeForScoreProperty.value === null ||
              ( score === scoreProperty.value && time < bestTimeForScoreProperty.value ) ) {
      bestTimeForScoreProperty.value = time;
      newBest = true;
    }

    return newBest;
  }

  /**
   * Creates a new icon with specific dimensions. The provided icon is scaled to fit, and a background with the
   * specified size is added to ensure that the size of the returned Node is correct.
   */
  public static createSizedImageNode( icon: Node, size: Dimension2 ): Node {

    const backgroundNode = Rectangle.dimension( size );

    // The icon's size may change dynamically, for example if it includes localized text.
    // See https://github.com/phetsims/vegas/issues/129.
    icon.localBoundsProperty.link( () => {
      icon.scale( Math.min( size.width / icon.bounds.width, size.height / icon.bounds.height ) );
      icon.center = backgroundNode.center;
    } );

    return new Node( {
      children: [ backgroundNode, icon ]
    } );
  }

  public override dispose(): void {
    this.disposeLevelSelectionButton();
    super.dispose();
  }
}

vegas.register( 'LevelSelectionButton', LevelSelectionButton );