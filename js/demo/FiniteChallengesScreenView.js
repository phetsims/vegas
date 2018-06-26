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
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var vegas = require( 'VEGAS/vegas' );

  // constants
  var PERFECT_SCORE = 10;
  var NUMBER_OF_CHALLENGES = 10;
  var DEFAULT_FONT = new PhetFont( 20 );

  /**
   * @constructor
   */
  function FiniteChallengesScreenView() {

    var self = this;
    ScreenView.call( this );

    var levelProperty = new Property( 0 );
    var challengeIndexProperty = new Property( 0 );
    var numberOfChallengesProperty = new Property( NUMBER_OF_CHALLENGES );
    var scoreProperty = new Property( 0 );
    var elapsedTimeProperty = new Property( 0 );
    var timerEnabledProperty = new BooleanProperty( true );

    // status bar across the top
    var statusBar = new FiniteStatusBar( this.layoutBounds, this.visibleBoundsProperty, scoreProperty, {
      font: new PhetFont( 20 ),
      levelProperty: levelProperty,
      challengeIndexProperty: challengeIndexProperty,
      numberOfChallengesProperty: numberOfChallengesProperty,
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
        new Text( 'Level: ', { font: DEFAULT_FONT } ),
        new HSlider( levelProperty, new Range( 0, 4 ), {
          constrainValue: function( value ) {
            return Util.roundSymmetric( value );
          }
        } )
      ]
    } );

    var challengeIndexSlider = new HBox( {
      children: [
        new Text( 'Challenge: ', { font: DEFAULT_FONT } ),
        new HSlider( challengeIndexProperty, new Range( 0, NUMBER_OF_CHALLENGES - 1 ), {
          constrainValue: function( value ) {
            return Util.roundSymmetric( value );
          }
        } )
      ]
    } );

    var numberOfChallengesSlider = new HBox( {
      children: [
        new Text( 'Number of challenges: ', { font: DEFAULT_FONT } ),
        new HSlider( numberOfChallengesProperty, new Range( 1, NUMBER_OF_CHALLENGES ), {
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
        new Text( 'Score: ', { font: DEFAULT_FONT } ),
        new HSlider( scoreProperty, new Range( 0, PERFECT_SCORE ) )
      ]
    } );

    var elapsedTimeSlider = new HBox( {
      children: [
        new Text( 'Elapsed time: ', { font: DEFAULT_FONT } ),
        new HSlider( elapsedTimeProperty, new Range( 0, 1000 ), {
          constrainValue: function( value ) {
            return Util.roundSymmetric( value );
          }
        } )
      ]
    } );

    var timerEnabledCheckbox = new Checkbox(
      new Text( 'Timer enabled', { font: DEFAULT_FONT } ),
      timerEnabledProperty );

    var controls = new VBox( {
      align: 'left',
      spacing: 15,
      left: this.layoutBounds.left + 20,
      top: statusBar.bottom + 30,
      children: [ levelSlider, challengeIndexSlider, numberOfChallengesSlider, scoreSlider, elapsedTimeSlider, timerEnabledCheckbox ]
    } );
    this.addChild( controls );

    // button to open LevelCompleteNode
    var levelCompletedButton = new RectangularPushButton( {
      content: new Text( 'show LevelCompletedNode', { font: new PhetFont( 20 ) } ),
      centerX: this.layoutBounds.centerX,
      bottom: this.layoutBounds.bottom - 20,
      listener: function() {
        var levelCompletedNode = new LevelCompletedNode(
          levelProperty.get() + 1, // level
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