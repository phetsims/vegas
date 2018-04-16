// Copyright 2018, University of Colorado Boulder

/**
 * A horizontal scoreboard 'bar'.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ElapsedTimeNode = require( 'VEGAS/ElapsedTimeNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var HBox = require( 'SCENERY/nodes/HBox' );
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

    var self = this;

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

      // true: keeps things on the status bar aligned with left and right edges of window bounds
      // false: align things on status bar with left and right edges of static layoutBounds
      dynamicAlignment: true,

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
      maxWidth: 0.2 * layoutBounds.width
    }, options.startOverButtonOptions );

    assert && assert( _.includes( VALID_SCORE_DISPLAY_CONSTRUCTORS, options.scoreDisplayConstructor,
      'invalid scoreDisplayConstructor: ' + options.scoreDisplayConstructor ) );
    assert && assert( ( options.challengeIndexProperty && options.numberOfChallengesProperty ) ||
                      ( !options.challengeIndexProperty && !options.numberOfChallengesProperty ),
      'challengeIndexProperty and numberOfChallengesProperty are both or neither' );

    var leftHBoxChildren = [];

    var textOptions = { fill: options.textFill, font: options.font };

    // Level N
    if ( options.levelProperty ) {
      var levelText = new Text( '', _.extend( {
        tandem: options.tandem.createTandem( 'levelText' )
      }, textOptions ) );
      leftHBoxChildren.push( levelText );

      var levelListener = function( level ) {
        levelText.text = StringUtils.format( labelLevelString, level + 1 );
      };
      options.levelProperty.link( levelListener );
    }

    // Challenge N of M
    if ( options.challengeIndexProperty && options.numberOfChallengesProperty ) {
      var challengeNumberText = new Text( '', _.extend( {
        tandem: options.tandem.createTandem( 'challengeNumberText' )
      }, textOptions ) );
      leftHBoxChildren.push( challengeNumberText );

      var updateChallengeString = function() {
        challengeNumberText.text = StringUtils.format( pattern0Challenge1MaxString,
          options.challengeIndexProperty.get() + 1, options.numberOfChallengesProperty.get() );
      };
      options.challengeIndexProperty.link( updateChallengeString );
      options.numberOfChallengesProperty.link( updateChallengeString );
    }

    // Score
    var scoreDisplay = new options.scoreDisplayConstructor( scoreProperty, options.scoreDisplayOptions );
    leftHBoxChildren.push( scoreDisplay );

    // Timer
    if ( options.elapsedTimeProperty && options.timerEnabledProperty ) {

      var elapsedTimeNode = new ElapsedTimeNode( options.elapsedTimeProperty, {
        clockRadius: options.clockRadius,
        font: options.font,
        textFill: options.textFill
      } );
      leftHBoxChildren.push( elapsedTimeNode );

      var timerEnabledListener = function( timerEnabled ) {
        elapsedTimeNode.visible = (options.timerEnabledProperty && timerEnabled);
      };
      options.timerEnabledProperty && options.timerEnabledProperty.link( timerEnabledListener );
    }

    // All of the stuff that's grouped together at the left end of the status bar
    var leftHBox = new HBox( {
      resize: false,
      spacing: options.xSpacing,
      children: leftHBoxChildren,
      maxWidth: 0.7 * layoutBounds.width
    } );

    // Start Over button
    var startOverButton = new TextPushButton( options.startOverButtonText, options.startOverButtonOptions );

    assert && assert( !options.children, 'FiniteStatusBar sets children' );
    options.children = [ leftHBox, startOverButton ];

    var barHeight = Math.max( leftHBox.height, startOverButton.height ) + (2 * options.yMargin);

    StatusBar.call( this, barHeight, layoutBounds, visibleBoundsProperty, options );

    // When the bar changes...
    var updateLayout = function() {

      var leftEdge = ( options.dynamicAlignment ) ? self.barNode.left : layoutBounds.minX;
      var rightEdge = ( options.dynamicAlignment ) ? self.barNode.right : layoutBounds.maxX;

      // stuff on left end of bar
      leftHBox.left = leftEdge + options.xMargin;
      leftHBox.centerY = self.barNode.centerY;

      // start over button on right end of bar
      startOverButton.right = rightEdge - options.xMargin;
      startOverButton.centerY = self.barNode.centerY;
    };
    this.barNode.on( 'bounds', updateLayout );
    updateLayout();

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
    }
  } );
} );