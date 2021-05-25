// Copyright 2013-2021, University of Colorado Boulder

/**
 * FiniteStatusBar is the status bar for games that have a finite number of challenges per level.
 * This was adapted from and replaces ScoreboardBar. See https://github.com/phetsims/vegas/issues/66.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../phet-core/js/merge.js';
import StringUtils from '../../phetcommon/js/util/StringUtils.js';
import PhetColorScheme from '../../scenery-phet/js/PhetColorScheme.js';
import HBox from '../../scenery/js/nodes/HBox.js';
import Rectangle from '../../scenery/js/nodes/Rectangle.js';
import Text from '../../scenery/js/nodes/Text.js';
import TextPushButton from '../../sun/js/buttons/TextPushButton.js';
import Tandem from '../../tandem/js/Tandem.js';
import ElapsedTimeNode from './ElapsedTimeNode.js';
import ScoreDisplayLabeledNumber from './ScoreDisplayLabeledNumber.js';
import ScoreDisplayLabeledStars from './ScoreDisplayLabeledStars.js';
import StatusBar from './StatusBar.js';
import vegas from './vegas.js';
import vegasStrings from './vegasStrings.js';

// Valid values for scoreDisplayConstructor. These are the types that are relevant for this status bar.
// All constructors must have the same signature!
const VALID_SCORE_DISPLAY_CONSTRUCTORS = [
  ScoreDisplayLabeledNumber, ScoreDisplayLabeledStars
];

class FiniteStatusBar extends StatusBar {

  /**
   * @param {Bounds2} layoutBounds
   * @param {Property.<Bounds2>} visibleBoundsProperty
   * @param {Property.<number>} scoreProperty
   * @param {Object} [options]
   */
  constructor( layoutBounds, visibleBoundsProperty, scoreProperty, options ) {

    options = merge( {

      // optional Properties
      challengeIndexProperty: null, // {Property.<number>|null}
      numberOfChallengesProperty: null, // {Property.<number>|null}
      levelProperty: null, // {Property.<number>|null}
      elapsedTimeProperty: null, // {Property.<number>|null}
      timerEnabledProperty: null, // {Property.<boolean>|null}

      // things that can be hidden
      levelVisible: true,
      challengeNumberVisible: true,

      // all text
      font: StatusBar.DEFAULT_FONT,
      textFill: 'black',

      // score display
      scoreDisplayConstructor: ScoreDisplayLabeledNumber,
      scoreDisplayOptions: null, // passed to scoreDisplayConstructor

      // nested options for 'Start Over' button, filled in below
      startOverButtonOptions: null,
      startOverButtonText: vegasStrings.startOver,

      // Timer
      clockIconRadius: 15,

      // spacing and margin for things in the bar
      xSpacing: 50,
      xMargin: 20,
      yMargin: 10,

      levelTextOptions: null, // passed to the "Level N" text
      challengeTextOptions: null, // passed to the "Challenge N of M" text

      barFill: null,
      barStroke: null,

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    // nested options for score display
    options.scoreDisplayOptions = merge( {
      font: options.font,
      textFill: options.textFill
    }, options.scoreDisplayOptions );

    // nested options for 'Start Over' button
    options.startOverButtonOptions = merge( {
      font: options.font,
      textFill: options.textFill,
      baseColor: PhetColorScheme.BUTTON_YELLOW,
      xMargin: 10,
      yMargin: 8,
      listener: () => {},
      tandem: options.tandem.createTandem( 'startOverButton' ),
      maxWidth: 0.2 * ( layoutBounds.width - ( 2 * options.xMargin ) ) // use 20% of available width
    }, options.startOverButtonOptions );

    assert && assert( _.includes( VALID_SCORE_DISPLAY_CONSTRUCTORS, options.scoreDisplayConstructor,
      `invalid scoreDisplayConstructor: ${options.scoreDisplayConstructor}` ) );
    assert && assert( ( options.challengeIndexProperty && options.numberOfChallengesProperty ) ||
                      ( !options.challengeIndexProperty && !options.numberOfChallengesProperty ),
      'challengeIndexProperty and numberOfChallengesProperty are both or neither' );

    // nested options for 'Level N' text
    options.levelTextOptions = merge( {
      fill: options.textFill,
      font: options.font
    }, options.levelTextOptions );

    // nested options for 'Challenge N of M' text
    options.challengeTextOptions = merge( {
      fill: options.textFill,
      font: options.font
    }, options.challengeTextOptions );

    // the rectangular bar, size will be set by visibleBoundsListener
    const barNode = new Rectangle( {
      fill: options.barFill,
      stroke: options.barStroke
    } );

    // Nodes on the left end of the bar
    const leftChildren = [];

    // Level N
    let levelListener;
    if ( options.levelProperty && options.levelVisible ) {

      const levelText = new Text( '', merge( {
        tandem: options.tandem.createTandem( 'levelText' )
      }, options.levelTextOptions ) );
      leftChildren.push( levelText );

      levelListener = level => {
        levelText.text = StringUtils.format( vegasStrings.label.level, level );
      };
      options.levelProperty.link( levelListener );
    }

    // Challenge N of M
    let updateChallengeString;
    if ( options.challengeIndexProperty && options.numberOfChallengesProperty ) {

      const challengeNumberText = new Text( '', merge( {
        tandem: options.tandem.createTandem( 'challengeNumberText' )
      }, options.challengeTextOptions ) );
      leftChildren.push( challengeNumberText );

      updateChallengeString = () => {
        challengeNumberText.text = StringUtils.format( vegasStrings.pattern[ '0challenge' ][ '1max' ],
          options.challengeIndexProperty.get() + 1, options.numberOfChallengesProperty.get() );
      };
      options.challengeIndexProperty.link( updateChallengeString );
      options.numberOfChallengesProperty.link( updateChallengeString );
    }

    // Score
    const scoreDisplay = new options.scoreDisplayConstructor( scoreProperty, options.scoreDisplayOptions );
    leftChildren.push( scoreDisplay );

    // Timer
    let elapsedTimeNode;
    let timerEnabledListener;
    if ( options.elapsedTimeProperty && options.timerEnabledProperty ) {

      elapsedTimeNode = new ElapsedTimeNode( options.elapsedTimeProperty, {
        clockRadius: options.clockRadius,
        font: options.font,
        textFill: options.textFill
      } );
      leftChildren.push( elapsedTimeNode );

      timerEnabledListener = timerEnabled => {
        elapsedTimeNode.visible = ( options.timerEnabledProperty && timerEnabled );
      };
      options.timerEnabledProperty && options.timerEnabledProperty.link( timerEnabledListener );
    }

    // Start Over button
    const startOverButton = new TextPushButton( options.startOverButtonText, options.startOverButtonOptions );

    // Nodes on the left end of the bar
    const leftNodes = new HBox( {

      // Because elapsedTimeNode needs to be considered regardless of whether it's visible,
      // see https://github.com/phetsims/vegas/issues/80
      excludeInvisibleChildrenFromBounds: false,
      resize: false,
      spacing: options.xSpacing,
      children: leftChildren,
      maxWidth: ( layoutBounds.width - ( 2 * options.xMargin ) - startOverButton.width - options.xSpacing )
    } );

    assert && assert( !options.children, 'FiniteStatusBar sets children' );
    options.children = [ barNode, leftNodes, startOverButton ];

    assert && assert( options.barHeight === undefined, 'FiniteStatusBar sets barHeight' );
    options.barHeight = Math.max( leftNodes.height, scoreDisplay.height ) + ( 2 * options.yMargin );

    super( layoutBounds, visibleBoundsProperty, options );

    // Position components on the bar.
    this.positioningBoundsProperty.link( positioningBounds => {
      leftNodes.left = positioningBounds.left;
      leftNodes.centerY = positioningBounds.centerY;
      startOverButton.right = positioningBounds.right;
      startOverButton.centerY = positioningBounds.centerY;
    } );

    // @private
    this.disposeFiniteStatusBar = () => {

      scoreDisplay.dispose();
      elapsedTimeNode && elapsedTimeNode.dispose();

      if ( options.levelProperty && options.levelProperty.hasListener( levelListener ) ) {
        options.levelProperty.unlink( levelListener );
      }

      if ( options.challengeIndexProperty && options.challengeIndexProperty.hasListener( updateChallengeString ) ) {
        options.challengeIndexProperty.unlink( updateChallengeString );
      }

      if ( options.numberOfChallengesProperty && options.numberOfChallengesProperty.hasListener( updateChallengeString ) ) {
        options.numberOfChallengesProperty.link( updateChallengeString );
      }

      if ( options.timerEnabledProperty && options.timerEnabledProperty.hasListener( timerEnabledListener ) ) {
        options.timerEnabledProperty.unlink( timerEnabledListener );
      }
    };
  }

  /**
   * @public
   * @override
   */
  dispose() {
    this.disposeFiniteStatusBar();
    super.dispose();
  }
}

vegas.register( 'FiniteStatusBar', FiniteStatusBar );
export default FiniteStatusBar;