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
  var HBox = require( 'SCENERY/nodes/HBox' );
  var HSlider = require( 'SUN/HSlider' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LevelCompletedNode = require( 'VEGAS/LevelCompletedNode' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var Range = require( 'DOT/Range' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var ScoreboardBar = require( 'VEGAS/ScoreboardBar' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );
  var vegas = require( 'VEGAS/vegas' );

  // constants
  var PERFECT_SCORE = 10;

  /**
   * @constructor
   */
  function FiniteChallengesScreenView() {

    var self = this;
    ScreenView.call( this );

    var scoreProperty = new Property( 0 );

    // bar across the top
    var scoreboardBar = new ScoreboardBar(
      this.layoutBounds.width,
      new Property( 0 ), // challenge index
      new Property( 6 ), // challenges per level
      new Property( 0 ), // level
      scoreProperty, // score
      new Property( 0 ), // elapse time
      new BooleanProperty( true ), // timer enabled
      function() { console.log( 'Start Over' ); }, // callback for 'Start Over' button
      {
        font: new PhetFont( 20 ),
        leftMargin: 40, // visually aligned with left edge of challenge boxes
        rightMargin: 50, // visually aligned with right edge of challenge graph
        centerX: this.layoutBounds.centerX,
        top: this.layoutBounds.top
      } );
    this.addChild( scoreboardBar );

    // slider for testing score changes
    var scoreSlider = new HBox( {
      left: this.layoutBounds.left + 20,
      top: scoreboardBar.bottom + 30,
      children: [
        new Text( 'Score: ', { font: new PhetFont( 20 ) } ),
        new HSlider( scoreProperty, new Range( 0, PERFECT_SCORE ), {

          //TODO #66 remove this when scoreDisplay option is added to ScoreboardBar
          constrainValue: function( value ) {
            return Util.roundSymmetric( value );
          }
        } )
      ]
    } );
    this.addChild( scoreSlider );

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