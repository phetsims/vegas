// Copyright 2014-2018, University of Colorado Boulder

/**
 * Demonstrates vegas UI components.
 *
 * @author Sam Reid
 * @author Andrea Lin
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var Checkbox = require( 'SUN/Checkbox' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var HSlider = require( 'SUN/HSlider' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LevelCompletedNode = require( 'VEGAS/LevelCompletedNode' );
  var LevelSelectionButton = require( 'VEGAS/LevelSelectionButton' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var ScoreDisplayDiscreteStars = require( 'VEGAS/ScoreDisplayDiscreteStars' );
  var ScoreDisplayNumberAndStar = require( 'VEGAS/ScoreDisplayNumberAndStar' );
  var ScoreDisplayTextAndNumber = require( 'VEGAS/ScoreDisplayTextAndNumber' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var StatusBar = require( 'VEGAS/StatusBar' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var vegas = require( 'VEGAS/vegas' );

  // constants
  var NUM_STARS = 5;
  var PERFECT_SCORE = 1000;
  var MAX_TIME = 10000;
  var BUTTON_WIDTH = 120;

  /**
   * @constructor
   */
  function VegasScreenView() {
    var self = this;
    ScreenView.call( this );

    var scoreProperty = new Property( 0 );
    var bestTimeProperty = new Property( 1 );
    var bestTimeVisibleProperty = new BooleanProperty( true );

    var statusBar = new StatusBar(
      this.layoutBounds,
      this.visibleBoundsProperty,
      new Text( 'User provided message' ),
      new ScoreDisplayNumberAndStar( scoreProperty ), {
        backButtonListener: function() { scoreProperty.reset(); }
      } );
    this.addChild( statusBar );

    // Controls for Properties
    var scoreSlider = new HBox( {
      children: [
        new Text( 'Score: ', { font: new PhetFont( 20 ) } ),
        new HSlider( scoreProperty, { min: 0, max: PERFECT_SCORE } )
      ]
    } );

    var bestTimeSlider = new HBox( {
      children: [
        new Text( 'Best Time: ', { font: new PhetFont( 20 ) } ),
        new HSlider( bestTimeProperty, { min: 0, max: MAX_TIME } )
      ]
    } );

    var bestTimeVisibleCheckbox = new Checkbox(
      new Text( 'Best time visible', { font: new PhetFont( 20 ) } ),
      bestTimeVisibleProperty );

    var controls = new HBox( {
      resize: false,
      spacing: 30,
      left: this.layoutBounds.minX + 20,
      top: statusBar.bottom + 20,
      children: [ scoreSlider, bestTimeSlider, bestTimeVisibleCheckbox ]
    } );
    this.addChild( controls );

    // Various options for displaying score.
    var scoreDisplays = new VBox( {
      resize: false,
      spacing: 20,
      align: 'left',
      left: this.layoutBounds.minX + 20,
      top: controls.bottom + 40,
      children: [
        new ScoreDisplayDiscreteStars( scoreProperty, { numStars: NUM_STARS, perfectScore: PERFECT_SCORE } ),
        new ScoreDisplayNumberAndStar( scoreProperty ),
        new ScoreDisplayTextAndNumber( scoreProperty )
      ]
    } );
    this.addChild( scoreDisplays );

    // Level selection buttons
    var buttonWithDiscreteStars = new LevelSelectionButton.ScoreDisplayCreator( new Text( 'icon' ), scoreProperty, {
      BUTTON_WIDTH: BUTTON_WIDTH,
      scoreDisplayConstructor: ScoreDisplayDiscreteStars,
      scoreDisplayOptions: {
        numStars: NUM_STARS,
        perfectScore: PERFECT_SCORE
      },
      listener: function() { console.log( 'level start' ); }
    } );

    var buttonWithNumberAndStar = new LevelSelectionButton.ScoreDisplayCreator( new Text( 'icon' ), scoreProperty, {
      BUTTON_WIDTH: BUTTON_WIDTH,
      scoreDisplayConstructor: ScoreDisplayNumberAndStar,
      listener: function() { console.log( 'level start' ); }
    } );

    var buttonWithTextAndNumber = new LevelSelectionButton.ScoreDisplayCreator( new Text( 'icon' ), scoreProperty, {
      BUTTON_WIDTH: BUTTON_WIDTH,
      scoreDisplayConstructor: ScoreDisplayTextAndNumber,
      listener: function() { console.log( 'level start' ); },
      bestTimeProperty: bestTimeProperty,
      bestTimeVisibleProperty: bestTimeVisibleProperty
    } );

    this.addChild( new HBox( {
      spacing: 20,
      align: 'top',
      left: this.layoutBounds.minX + 20,
      top: scoreDisplays.bottom + 40,
      children: [ buttonWithDiscreteStars, buttonWithNumberAndStar, buttonWithTextAndNumber ]
    } ) );

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
        right: self.layoutBounds.right - 10,
        top: self.layoutBounds.top + 80
      } );
      self.addChild( levelCompletedNode );
    };
    addLevelCompletedNode();
  }

  vegas.register( 'VegasScreenView', VegasScreenView );

  return inherit( ScreenView, VegasScreenView );
} );