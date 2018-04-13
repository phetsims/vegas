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
  var ScoreboardBar = require( 'VEGAS/ScoreboardBar' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var Text = require( 'SCENERY/nodes/Text' );
  var vegas = require( 'VEGAS/vegas' );

  // constants
  var PERFECT_SCORE = 1000;

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

    // score slider
    var scoreSlider = new HBox( {
      left: this.layoutBounds.left + 20,
      top: scoreboardBar.bottom + 30,
      children: [
        new Text( 'Score: ', { font: new PhetFont( 20 ) } ),
        new HSlider( scoreProperty, { min: 0, max: PERFECT_SCORE } )
      ]
    } );
    this.addChild( scoreSlider );

    // LevelCompletedNode that cycles through score values when you press 'Continue' button
    var score = 0;
    var addLevelCompletedNode = function() {
      var maxScore = 12;
      var levelCompletedNode = new LevelCompletedNode( 7, score, maxScore, 4, true, 77, 74, true, function() {
        console.log( 'continue' );
        score++;
        if ( score > maxScore ) {
          score = 0;
        }
        levelCompletedNode.detach();
        addLevelCompletedNode();
      }, {
        center: self.layoutBounds.center
      } );
      self.addChild( levelCompletedNode );
    };
    addLevelCompletedNode();
  }

  vegas.register( 'FiniteChallengesScreenView', FiniteChallengesScreenView );

  return inherit( ScreenView, FiniteChallengesScreenView );
} );