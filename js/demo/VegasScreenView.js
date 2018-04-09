// Copyright 2014-2018, University of Colorado Boulder

/**
 * Main ScreenView container for Buttons portion of the UI component demo.
 *
 * @author Sam Reid
 * @author Andrea Lin
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var HBox = require( 'SCENERY/nodes/HBox' );
  var HSlider = require( 'SUN/HSlider' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LevelCompletedNode = require( 'VEGAS/LevelCompletedNode' );
  var LevelSelectionItemNode = require( 'VEGAS/LevelSelectionItemNode' );
  var ScoreDisplayDiscreteStars = require( 'VEGAS/ScoreDisplayDiscreteStars' );
  var ScoreDisplayNumberAndStar = require( 'VEGAS/ScoreDisplayNumberAndStar' );
  var ScoreDisplayTextAndNumber = require( 'VEGAS/ScoreDisplayTextAndNumber' );
  var Property = require( 'AXON/Property' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var StatusBar = require( 'VEGAS/StatusBar' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var vegas = require( 'VEGAS/vegas' );

  // constants
  var NUM_STARS = 5;
  var PERFECT_SCORE = 1000;

  /**
   * @constructor
   */
  function VegasScreenView() {
    var self = this;
    ScreenView.call( this );

    var scoreProperty = new Property( 0 );

    var statusBar = new StatusBar(
      this.layoutBounds,
      this.visibleBoundsProperty,
      new Text( 'User provided message' ),
      new ScoreDisplayNumberAndStar( scoreProperty ), {
        backButtonListener: function() { scoreProperty.reset(); }
      } );
    this.addChild( statusBar );

    // Various options for displaying score, with a slider to change the score
    var vBox = new VBox( {
      resize: false,
      spacing: 20,
      align: 'left',
      left: this.layoutBounds.minX + 20,
      top: statusBar.bottom + 25,
      children: [
        new ScoreDisplayDiscreteStars( scoreProperty, { numStars: NUM_STARS, perfectScore: PERFECT_SCORE } ),
        new ScoreDisplayNumberAndStar( scoreProperty ),
        new ScoreDisplayTextAndNumber( scoreProperty ),
        new HSlider( scoreProperty, { min: 0, max: PERFECT_SCORE } )
      ]
    } );
    this.addChild( vBox );

    // Show a sample LevelCompletedNode that cycles through score values when you press "continue"
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
        right: self.layoutBounds.right - 10,
        top: self.layoutBounds.top + 80
      } );
      self.addChild( levelCompletedNode );
    };

    addLevelCompletedNode();

    var buttonWidth = 120;

    var levelSelectionNodeDiscreteStars = new LevelSelectionItemNode.ScoreDisplayCreator( new Text( 'icon' ), scoreProperty, {
      buttonWidth: buttonWidth,
      scoreDisplayConstructor: ScoreDisplayDiscreteStars,
      scoreDisplayOptions: {
        numStars: NUM_STARS,
        perfectScore: PERFECT_SCORE
      },
      listener: function() { console.log( 'level start' ); }
    } );

    var levelSelectionNodeNumberAndStar = new LevelSelectionItemNode.ScoreDisplayCreator( new Text( 'icon' ), scoreProperty, {
      buttonWidth: buttonWidth,
      scoreDisplayConstructor: ScoreDisplayNumberAndStar,
      listener: function() {console.log( 'level start' ); }
    } );

    var levelSelectionNodeTextAndNumber = new LevelSelectionItemNode.ScoreDisplayCreator( new Text( 'icon' ), scoreProperty, {
      buttonWidth: buttonWidth,
      scoreDisplayConstructor: ScoreDisplayTextAndNumber,
      listener: function() {console.log( 'level start' ); }
    } );

    this.addChild( new HBox( {
      spacing: 20,
      left: vBox.left,
      top: vBox.bottom + 20,
      children: [ levelSelectionNodeDiscreteStars, levelSelectionNodeNumberAndStar, levelSelectionNodeTextAndNumber ]
    } ) );
  }

  vegas.register( 'VegasScreenView', VegasScreenView );

  return inherit( ScreenView, VegasScreenView );
} );