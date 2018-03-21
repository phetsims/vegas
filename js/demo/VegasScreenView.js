// Copyright 2014-2018, University of Colorado Boulder

/**
 * Main ScreenView container for Buttons portion of the UI component demo.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  var HSlider = require( 'SUN/HSlider' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LevelCompletedNode = require( 'VEGAS/LevelCompletedNode' );
  var OutsideBackgroundNode = require( 'SCENERY_PHET/OutsideBackgroundNode' );
  var ScoreDisplayDiscreteStars = require( 'VEGAS/ScoreDisplayDiscreteStars' );
  var ScoreDisplayNumberAndStar = require( 'VEGAS/ScoreDisplayNumberAndStar' );
  var ScoreDisplayTextAndNumber = require( 'VEGAS/ScoreDisplayTextAndNumber' );
  var Property = require( 'AXON/Property' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var StatusBar = require( 'VEGAS/StatusBar' );
  var Text = require( 'SCENERY/nodes/Text' );
  var vegas = require( 'VEGAS/vegas' );

  /**
   * @constructor
   */
  function VegasScreenView() {
    var self = this;
    ScreenView.call( this, { layoutBounds: new Bounds2( 0, 0, 768, 504 ) } );

    // background
    this.addChild( new OutsideBackgroundNode( this.layoutBounds.centerX, this.layoutBounds.centerY + 20, this.layoutBounds.width * 3, this.layoutBounds.height, this.layoutBounds.height ) );

    var scoreProperty = new Property( 1 );

    this.addChild( new ScoreDisplayDiscreteStars( scoreProperty, { left: 20, top: 80, scale: 2, numStars: 4, perfectScore: 4 } ) );
    this.addChild( new ScoreDisplayNumberAndStar( scoreProperty, { left: 20, top: 140, scale: 2, spacing: 14 } ) );
    this.addChild( new ScoreDisplayTextAndNumber( scoreProperty, { left: 20, top: 200, scale: 2 } ) );
    this.addChild( new HSlider( scoreProperty, { min: 0, max: 4 } ).mutate( { left: 20, top: 260 } ) );

    this.addChild( new StatusBar(
      self.visibleBoundsProperty,
      new Text( 'User provided message' ),
      scoreProperty, {
        scoreDisplayType: 'discreteStars',
        alwaysInsideLayoutBounds: false,
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
        top:   self.layoutBounds.top + 80
      } );
      self.addChild( levelCompletedNode );
    };

    addLevelCompletedNode();
  }

  vegas.register( 'VegasScreenView', VegasScreenView );

  return inherit( ScreenView, VegasScreenView, {
    step: function( timeElapsed ) {
      // Does nothing for now.
    }
  } );
} );