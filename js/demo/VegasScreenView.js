// Copyright 2014-2018, University of Colorado Boulder

/**
 * Main ScreenView container for Buttons portion of the UI component demo.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
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
  var vegas = require( 'VEGAS/vegas' );

  // constants
  var NUM_STARS = 4;
  var PERFECT_SCORE = 4;

  /**
   * @constructor
   */
  function VegasScreenView() {
    var self = this;
    ScreenView.call( this );

    var scoreProperty = new Property( 1 );

    this.addChild( new ScoreDisplayDiscreteStars( scoreProperty, {
      left: 20,
      top: 80,
      scale: 2,
      numStars: NUM_STARS,
      perfectScore: PERFECT_SCORE
    } ) );
    this.addChild( new ScoreDisplayNumberAndStar( scoreProperty, { left: 20, top: 140, scale: 2, spacing: 14 } ) );
    this.addChild( new ScoreDisplayTextAndNumber( scoreProperty, { left: 20, top: 200, scale: 2 } ) );
    this.addChild( new HSlider( scoreProperty, { min: 0, max: PERFECT_SCORE } ).mutate( { left: 20, top: 260 } ) );

    this.addChild( new StatusBar(
      this.layoutBounds,
      this.visibleBoundsProperty,
      new Text( 'User provided message' ),
      new ScoreDisplayNumberAndStar( scoreProperty ), {
        backButtonListener: function() { scoreProperty.reset(); }
      } ) );

    //Show a sample LevelCompletedNode that cycles through score values when you press "continue"
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

    var levelSelectionNodeDiscreteStars = LevelSelectionItemNode.createWithScoreDisplayDiscreteStars( new Text( 'icon' ), scoreProperty, {
      scoreDisplayOptions: {
        numStars: NUM_STARS,
        perfectScore: PERFECT_SCORE
      },
      listener: function() {
        console.log( 'level start' );
      },
      centerX: 100,
      centerY: 400,
      buttonWidth: 120
    } );
    this.addChild( levelSelectionNodeDiscreteStars );

    var levelSelectionNodeNumberAndStar = LevelSelectionItemNode.createWithScoreDisplayNumberAndStar( new Text( 'icon' ), scoreProperty, {
      listener: function() {
        console.log( 'level start' );
      },
      centerX: 240,
      centerY: 400,
      buttonWidth: 120
    } );
    this.addChild( levelSelectionNodeNumberAndStar );

    var levelSelectionNodeTextAndNumber = LevelSelectionItemNode.createWithScoreDisplayTextAndNumber( new Text( 'icon' ), scoreProperty, {
      listener: function() {
        console.log( 'level start' );
      },
      centerX: 380,
      centerY: 400,
      buttonWidth: 120
    } );
    this.addChild( levelSelectionNodeTextAndNumber );
  }

  vegas.register( 'VegasScreenView', VegasScreenView );

  return inherit( ScreenView, VegasScreenView, {
    step: function( timeElapsed ) {
      // Does nothing for now.
    }
  } );
} );