// Copyright 2018, University of Colorado Boulder

/**
 * A horizontal scoreboard 'bar'.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Color = require( 'SCENERY/util/Color' );
  var GameTimer = require( 'VEGAS/GameTimer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var ScoreDisplayLabeledNumber = require( 'VEGAS/ScoreDisplayLabeledNumber' );
  var SimpleClockIcon = require( 'SCENERY_PHET/SimpleClockIcon' );
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
  var DEFAULT_FONT = new PhetFont( 20 );

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
      challengesPerLevelProperty: null, // {Property.<number>|null}
      levelProperty: null, // {Property.<number>|null}
      elapsedTimeProperty: null, // {Property.<number>|null} 
      timerEnabledProperty: null, // {Property.<boolean>|null} 

      // things that can be hidden
      levelVisible: true,
      challengeNumberVisible: true,

      // all text
      font: DEFAULT_FONT,
      textFill: 'white',

      // nested options for 'Start Over' button, filled in below
      startOverButtonOptions: null,
      startOverButtonText: startOverString,

      // Timer
      clockIconRadius: 15,

      // spacing and margin for things in the bar
      xSpacing: 50,
      xMargin: 20,
      yMargin: 10,

      // phet-io
      tandem: Tandem.required
    }, options );

    // nested options for 'Start Over' button
    options.startOverButtonOptions = _.extend( {
      font: options.font,
      textFill: 'black',
      baseColor: new Color( 229, 243, 255 ), //TODO what is a good default?
      xMargin: 10,
      yMargin: 5,
      listener: function() {},
      tandem: options.tandem.createTandem( 'startOverButton' )
      //TODO maxWidth
    }, options.startOverButtonOptions );

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
    if ( options.challengeIndexProperty && options.challengesPerLevelProperty ) {
      var challengeNumberText = new Text( '', _.extend( {
        tandem: options.tandem.createTandem( 'challengeNumberText' )
      }, textOptions ) );
      leftHBoxChildren.push( challengeNumberText );

      var updateChallengeString = function() {
        //TODO #66 change to StringUtils.fillIn ?
        challengeNumberText.text = StringUtils.format( pattern0Challenge1MaxString,
          options.challengeIndexProperty.get() + 1, options.challengesPerLevelProperty.get() );
      };
      options.challengeIndexProperty.link( updateChallengeString );
      options.challengesPerLevelProperty.link( updateChallengeString );
    }

    // Score
    var scoreDisplay = new ScoreDisplayLabeledNumber( scoreProperty, {
      scoreDecimalPlaces: 0,
      fill: options.textFill,
      font: options.font
    } );
    leftHBoxChildren.push( scoreDisplay );

    // Timer
    if ( options.elapsedTimeProperty && options.timerEnabledProperty ) {

      var clockIcon = new SimpleClockIcon( options.clockIconRadius );
      var timeValue = new Text( '', textOptions );
      var timerNode = new HBox( {
        spacing: 8,
        children: [ clockIcon, timeValue ]
      } );
      leftHBoxChildren.push( timerNode );

      var elapsedTimeListener = function( elapsedTime ) {
        timeValue.text = GameTimer.formatTime( elapsedTime );
      };
      options.elapsedTimeProperty.link( elapsedTimeListener );

      var timerEnabledListener = function( timerEnabled ) {
        timerNode.visible = ( options.timerEnabledProperty && timerEnabled );
      };
      options.timerEnabledProperty && options.timerEnabledProperty.link( timerEnabledListener );
    }

    // All of the stuff that's grouped together at the left end of the status bar
    var leftHBox = new HBox( {
      resize: false,
      spacing: options.xSpacing,
      children: leftHBoxChildren
      //TODO maxWidth
    } );

    // Start Over button
    var startOverButton = new TextPushButton( options.startOverButtonText, options.startOverButtonOptions );

    assert && assert( !options.children, 'FiniteStatusBar sets children' );
    options.children = [ leftHBox, startOverButton ];

    var barHeight = Math.max( leftHBox.height, startOverButton.height ) + ( 2 * options.yMargin );

    StatusBar.call( this, barHeight, layoutBounds, visibleBoundsProperty, options );

    // When the bar changes...
    var updateLayout = function() {
      leftHBox.left = self.barNode.left + options.xMargin;
      leftHBox.centerY = self.barNode.centerY;
      startOverButton.right = self.barNode.right - options.xMargin;
      startOverButton.centerY = self.barNode.centerY;
    };
    this.barNode.on( 'bounds', updateLayout );
    updateLayout();

    // @private
    this.disposeFiniteStatusBar = function() {
      if ( options.levelProperty && options.levelProperty.hasListener( levelListener ) ) {
        options.levelProperty.unlink( levelListener );
      }
      if ( options.challengeIndexProperty && options.challengeIndexProperty.hasListener( updateChallengeString ) ) {
        options.challengeIndexProperty.unlink( updateChallengeString );
      }
      if ( options.challengesPerLevelProperty && options.challengesPerLevelProperty.hasListener( updateChallengeString ) ) {
        options.challengesPerLevelProperty.link( updateChallengeString );
      }
      if ( options.elapsedTimeProperty && options.elapsedTimeProperty.hasListener( elapsedTimeListener ) ) {
        options.elapsedTimeProperty.unlink( elapsedTimeListener );
      }
      if ( options.timerEnabledProperty && options.timerEnabledProperty.hasListener( timerEnabledListener ) ) {
        options.timerEnabledProperty.unlink( timerEnabledListener );
      }
      scoreDisplay.dispose(); //TODO #66 don't do this when it's passed in to constructor
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