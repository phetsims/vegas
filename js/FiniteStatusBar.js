// Copyright 2013-2020, University of Colorado Boulder

//TODO https://github.com/phetsims/tasks/issues/1044 converting to ES6 is problematic because super constructor calls updateLayoutProtected
/**
 * Status bar for games that have a finite number of challenges per level.
 * This was adapted from and replaces ScoreboardBar.
 * See https://github.com/phetsims/vegas/issues/66.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import inherit from '../../phet-core/js/inherit.js';
import merge from '../../phet-core/js/merge.js';
import StringUtils from '../../phetcommon/js/util/StringUtils.js';
import PhetColorScheme from '../../scenery-phet/js/PhetColorScheme.js';
import HBox from '../../scenery/js/nodes/HBox.js';
import Text from '../../scenery/js/nodes/Text.js';
import TextPushButton from '../../sun/js/buttons/TextPushButton.js';
import Tandem from '../../tandem/js/Tandem.js';
import ElapsedTimeNode from './ElapsedTimeNode.js';
import ScoreDisplayLabeledNumber from './ScoreDisplayLabeledNumber.js';
import ScoreDisplayLabeledStars from './ScoreDisplayLabeledStars.js';
import StatusBar from './StatusBar.js';
import vegasStrings from './vegasStrings.js';
import vegas from './vegas.js';

const labelLevelString = vegasStrings.label.level;
const pattern0Challenge1MaxString = vegasStrings.pattern[ '0challenge' ][ '1max' ];
const startOverString = vegasStrings.startOver;

// constants
const VALID_SCORE_DISPLAY_CONSTRUCTORS = [
  // Types that are relevant for this status bar. All constructors must have the same signature!
  ScoreDisplayLabeledNumber, ScoreDisplayLabeledStars
];

/**
 * @param {Bounds2} layoutBounds
 * @param {Property.<Bounds2>} visibleBoundsProperty
 * @param {Property.<number>} scoreProperty
 * @param {Object} [options]
 * @constructor
 */
function FiniteStatusBar( layoutBounds, visibleBoundsProperty, scoreProperty, options ) {

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
    startOverButtonText: startOverString,

    // Timer
    clockIconRadius: 15,

    // spacing and margin for things in the bar
    xSpacing: 50,
    xMargin: 20,
    yMargin: 10,

    levelTextOptions: null, // passed to the "Level N" text
    challengeTextOptions: null, // passed to the "Challenge N of M" text

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
    'invalid scoreDisplayConstructor: ' + options.scoreDisplayConstructor ) );
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

  // Nodes on the left end of the bar
  const leftChildren = [];

  // Level N
  if ( options.levelProperty && options.levelVisible ) {
    const levelText = new Text( '', merge( {
      tandem: options.tandem.createTandem( 'levelText' )
    }, options.levelTextOptions ) );
    leftChildren.push( levelText );

    var levelListener = level => {
      levelText.text = StringUtils.format( labelLevelString, level );
    };
    options.levelProperty.link( levelListener );
  }

  // Challenge N of M
  if ( options.challengeIndexProperty && options.numberOfChallengesProperty ) {
    const challengeNumberText = new Text( '', merge( {
      tandem: options.tandem.createTandem( 'challengeNumberText' )
    }, options.challengeTextOptions ) );
    leftChildren.push( challengeNumberText );

    var updateChallengeString = () => {
      challengeNumberText.text = StringUtils.format( pattern0Challenge1MaxString,
        options.challengeIndexProperty.get() + 1, options.numberOfChallengesProperty.get() );
    };
    options.challengeIndexProperty.link( updateChallengeString );
    options.numberOfChallengesProperty.link( updateChallengeString );
  }

  // Score
  const scoreDisplay = new options.scoreDisplayConstructor( scoreProperty, options.scoreDisplayOptions );
  leftChildren.push( scoreDisplay );

  // Timer
  if ( options.elapsedTimeProperty && options.timerEnabledProperty ) {

    var elapsedTimeNode = new ElapsedTimeNode( options.elapsedTimeProperty, {
      clockRadius: options.clockRadius,
      font: options.font,
      textFill: options.textFill
    } );
    leftChildren.push( elapsedTimeNode );

    var timerEnabledListener = timerEnabled => {
      elapsedTimeNode.visible = ( options.timerEnabledProperty && timerEnabled );
    };
    options.timerEnabledProperty && options.timerEnabledProperty.link( timerEnabledListener );
  }

  // @private Start Over button
  this.startOverButton = new TextPushButton( options.startOverButtonText, options.startOverButtonOptions );

  // @private Nodes on the left end of the bar
  this.leftNodes = new HBox( {

    // Because elapsedTimeNode needs to be considered regardless of whether it's visible,
    // see https://github.com/phetsims/vegas/issues/80
    excludeInvisibleChildrenFromBounds: false,
    resize: false,
    spacing: options.xSpacing,
    children: leftChildren,
    maxWidth: ( layoutBounds.width - ( 2 * options.xMargin ) - this.startOverButton.width - options.xSpacing )
  } );

  assert && assert( !options.children, 'FiniteStatusBar sets children' );
  options.children = [ this.leftNodes, this.startOverButton ];

  assert && assert( !options.barHeight, 'FiniteStatusBar sets barHeight' );
  options.barHeight = Math.max( this.leftNodes.height, this.startOverButton.height ) + ( 2 * options.yMargin );

  StatusBar.call( this, layoutBounds, visibleBoundsProperty, options );

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

vegas.register( 'FiniteStatusBar', FiniteStatusBar );

inherit( StatusBar, FiniteStatusBar, {

  /**
   * @public
   * @override
   */
  dispose: function() {
    this.disposeFiniteStatusBar();
    StatusBar.prototype.dispose.call( this );
  },

  /**
   * Handles layout when the bar changes.
   * @param {number} leftEdge - the bar's left edge, compensated for xMargin
   * @param {number} rightEdge - the bar's right edge, compensated for xMargin
   * @param {number} centerY - the bar's vertical center
   * @protected
   * @override
   */
  updateLayoutProtected: function( leftEdge, rightEdge, centerY ) {

    // stuff on left end of bar
    this.leftNodes.left = leftEdge;
    this.leftNodes.centerY = centerY;

    // start over button on right end of bar
    this.startOverButton.right = rightEdge;
    this.startOverButton.centerY = centerY;
  }
} );

export default FiniteStatusBar;