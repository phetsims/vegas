// Copyright 2018, University of Colorado Boulder

/**
 * Status bar for games that have a finite number of challenges per level.
 * This was adapted from and replaces ScoreboardBar.
 * See https://github.com/phetsims/vegas/issues/66.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ElapsedTimeNode = require( 'VEGAS/ElapsedTimeNode' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );
  var ScoreDisplayLabeledNumber = require( 'VEGAS/ScoreDisplayLabeledNumber' );
  var ScoreDisplayLabeledStars = require( 'VEGAS/ScoreDisplayLabeledStars' );
  var StatusBar = require( 'VEGAS/StatusBar' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Tandem = require( 'TANDEM/Tandem' );
  var Text = require( 'SCENERY/nodes/Text' );
  var TextPushButton = require( 'SUN/buttons/TextPushButton' );
  var vegas = require( 'VEGAS/vegas' );

  // strings
  var labelLevelString = require( 'string!VEGAS/label.level' );
  var pattern0Challenge1MaxString = require( 'string!VEGAS/pattern.0challenge.1max' );
  var startOverString = require( 'string!VEGAS/startOver' );

  // constants
  var VALID_SCORE_DISPLAY_CONSTRUCTORS = [
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

    options = _.extend( {

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
      tandem: Tandem.required
    }, options );

    // nested options for score display
    options.scoreDisplayOptions = _.extend( {
      font: options.font,
      textFill: options.textFill
    }, options.scoreDisplayOptions );

    // nested options for 'Start Over' button
    options.startOverButtonOptions = _.extend( {
      font: options.font,
      textFill: options.textFill,
      baseColor: PhetColorScheme.BUTTON_YELLOW,
      xMargin: 10,
      yMargin: 8,
      listener: function() {},
      tandem: options.tandem.createTandem( 'startOverButton' ),
      maxWidth: 0.2 * ( layoutBounds.width - ( 2 * options.xMargin ) ) // use 20% of available width
    }, options.startOverButtonOptions );

    assert && assert( _.includes( VALID_SCORE_DISPLAY_CONSTRUCTORS, options.scoreDisplayConstructor,
      'invalid scoreDisplayConstructor: ' + options.scoreDisplayConstructor ) );
    assert && assert( ( options.challengeIndexProperty && options.numberOfChallengesProperty ) ||
                      ( !options.challengeIndexProperty && !options.numberOfChallengesProperty ),
      'challengeIndexProperty and numberOfChallengesProperty are both or neither' );

    // nested options for 'Level N' text
    options.levelTextOptions = _.extend( {
      fill: options.textFill,
      font: options.font
    }, options.levelTextOptions );

    // nested options for 'Challenge N of M' text
    options.challengeTextOptions = _.extend( {
      fill: options.textFill,
      font: options.font
    }, options.challengeTextOptions );

    // Nodes on the left end of the bar
    var leftChildren = [];

    // Level N
    if ( options.levelProperty && options.levelVisible ) {
      var levelText = new Text( '', _.extend( {
        tandem: options.tandem.createTandem( 'levelText' )
      }, options.levelTextOptions ) );
      leftChildren.push( levelText );

      var levelListener = function( level ) {
        levelText.text = StringUtils.format( labelLevelString, level );
      };
      options.levelProperty.link( levelListener );
    }

    // Challenge N of M
    if ( options.challengeIndexProperty && options.numberOfChallengesProperty ) {
      var challengeNumberText = new Text( '', _.extend( {
        tandem: options.tandem.createTandem( 'challengeNumberText' )
      }, options.challengeTextOptions ) );
      leftChildren.push( challengeNumberText );

      var updateChallengeString = function() {
        challengeNumberText.text = StringUtils.format( pattern0Challenge1MaxString,
          options.challengeIndexProperty.get() + 1, options.numberOfChallengesProperty.get() );
      };
      options.challengeIndexProperty.link( updateChallengeString );
      options.numberOfChallengesProperty.link( updateChallengeString );
    }

    // Score
    var scoreDisplay = new options.scoreDisplayConstructor( scoreProperty, options.scoreDisplayOptions );
    leftChildren.push( scoreDisplay );

    // Timer
    if ( options.elapsedTimeProperty && options.timerEnabledProperty ) {

      var elapsedTimeNode = new ElapsedTimeNode( options.elapsedTimeProperty, {
        clockRadius: options.clockRadius,
        font: options.font,
        textFill: options.textFill
      } );
      leftChildren.push( elapsedTimeNode );

      var timerEnabledListener = function( timerEnabled ) {
        elapsedTimeNode.visible = ( options.timerEnabledProperty && timerEnabled );
      };
      options.timerEnabledProperty && options.timerEnabledProperty.link( timerEnabledListener );
    }

    // @private Start Over button
    this.startOverButton = new TextPushButton( options.startOverButtonText, options.startOverButtonOptions );

    // @private Nodes on the left end of the bar
    this.leftNodes = new HBox( {
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
    this.disposeFiniteStatusBar = function() {

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

  return inherit( StatusBar, FiniteStatusBar, {

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
} );