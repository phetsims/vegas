// Copyright 2014-2018, University of Colorado Boulder

/**
 * Demonstrates vegas UI components.
 *
 * @author Sam Reid
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var Checkbox = require( 'SUN/Checkbox' );
  var FiniteStatusBar = require( 'VEGAS/FiniteStatusBar' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var HSlider = require( 'SUN/HSlider' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LevelCompletedNode = require( 'VEGAS/LevelCompletedNode' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var Range = require( 'DOT/Range' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var ScoreDisplayLabeledNumber = require( 'VEGAS/ScoreDisplayLabeledNumber' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var vegas = require( 'VEGAS/vegas' );

  // constants
  var PERFECT_SCORE = 10;

  /**
   * @constructor
   */
  function FiniteChallengesScreenView() {

    var self = this;
    ScreenView.call( this );

    var levelProperty = new Property( 0 );
    var challengeIndexProperty = new Property( 0 );
    var challengesPerLevelProperty = new Property( 6 );
    var scoreProperty = new Property( 0 );
    var elapsedTimeProperty = new Property( 0 );
    var timerEnabledProperty = new BooleanProperty( true );

    // score display for status bar
    var scoreDisplay = new ScoreDisplayLabeledNumber( scoreProperty, {
      font: FiniteStatusBar.DEFAULT_FONT,
      fill: FiniteStatusBar.DEFAULT_TEXT_FILL
    } );

    // bar across the top
    var statusBar = new FiniteStatusBar( this.layoutBounds, this.visibleBoundsProperty, scoreDisplay, {
      font: new PhetFont( 20 ),
      levelProperty: levelProperty,
      challengeIndexProperty: challengeIndexProperty,
      challengesPerLevelProperty: challengesPerLevelProperty,
      elapsedTimeProperty: elapsedTimeProperty,
      timerEnabledProperty: timerEnabledProperty,
      startOverButtonOptions: {
        listener: function() { console.log( 'Start Over' ); }
      }
    } );
    this.addChild( statusBar );

    // Controls for changing Properties
    var levelSlider = new HBox( {
      children: [
        new Text( 'Level: ', { font: new PhetFont( 20 ) } ),
        new HSlider( levelProperty, new Range( 0, 4 ), {
          constrainValue: function( value ) {
            return Util.roundSymmetric( value );
          }
        } )
      ]
    } );

    var challengeIndexSlider = new HBox( {
      children: [
        new Text( 'Challenge: ', { font: new PhetFont( 20 ) } ),
        new HSlider( challengeIndexProperty, new Range( 0, 5 ), {
          constrainValue: function( value ) {
            return Util.roundSymmetric( value );
          }
        } )
      ]
    } );

    var scoreSlider = new HBox( {
      left: this.layoutBounds.left + 20,
      top: statusBar.bottom + 30,
      children: [
        new Text( 'Score: ', { font: new PhetFont( 20 ) } ),
        new HSlider( scoreProperty, new Range( 0, PERFECT_SCORE ) )
      ]
    } );

    var elapsedTimeSlider = new HBox( {
      children: [
        new Text( 'Time: ', { font: new PhetFont( 20 ) } ),
        new HSlider( elapsedTimeProperty, new Range( 0, 1000 ), {
          constrainValue: function( value ) {
            return Util.roundSymmetric( value );
          }
        } )
      ]
    } );

    var timerEnabledCheckbox = new Checkbox(
      new Text( 'Timer enabled', { font: new PhetFont( 20 ) } ),
      timerEnabledProperty );

    var controls = new VBox( {
      align: 'left',
      spacing: 15,
      left: this.layoutBounds.left + 20,
      top: statusBar.bottom + 30,
      children: [ levelSlider, challengeIndexSlider, scoreSlider, elapsedTimeSlider, timerEnabledCheckbox ]
    } );
    this.addChild( controls );

    // button to open LevelCompleteNode
    var levelCompletedButton = new RectangularPushButton( {
      content: new Text( 'show LevelCompletedNode', { font: new PhetFont( 20 ) } ),
      centerX: this.layoutBounds.centerX,
      bottom: this.layoutBounds.bottom - 20,
      listener: function() {
        var levelCompletedNode = new LevelCompletedNode(
          7, // level
          scoreProperty.value, // score
          PERFECT_SCORE, // maxScore
          4, // numberOfStars 
          true, // timerEnabled
          77, // elapsedTime
          74, // bestTimeAtThisLevel
          true, // isNewBestTime
          function() { levelCompletedNode.detach(); }, // Continue button callback
          {
            center: self.layoutBounds.center
          } );
        self.addChild( levelCompletedNode );
      }
    } );
    this.addChild( levelCompletedButton );
  }

  vegas.register( 'FiniteChallengesScreenView', FiniteChallengesScreenView );

  return inherit( ScreenView, FiniteChallengesScreenView );
} );