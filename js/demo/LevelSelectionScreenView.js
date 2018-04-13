// Copyright 2018, University of Colorado Boulder

/**
 * Demonstrates UI components related to the typical level-selection UI in games.
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
  var LevelSelectionButton = require( 'VEGAS/LevelSelectionButton' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var ScoreDisplayLabeledNumber = require( 'VEGAS/ScoreDisplayLabeledNumber' );
  var ScoreDisplayLabeledStars = require( 'VEGAS/ScoreDisplayLabeledStars' );
  var ScoreDisplayStars = require( 'VEGAS/ScoreDisplayStars' );
  var ScoreDisplayNumberAndStar = require( 'VEGAS/ScoreDisplayNumberAndStar' );
  var ScreenView = require( 'JOIST/ScreenView' );
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
  function LevelSelectionScreenView() {

    ScreenView.call( this );

    var scoreProperty = new Property( 0 );
    var bestTimeProperty = new Property( 0 );
    var bestTimeVisibleProperty = new BooleanProperty( true );

    // Various options for displaying score.
    var scoreDisplays = new VBox( {
      resize: false,
      spacing: 20,
      align: 'left',
      centerX: this.layoutBounds.centerX,
      top: this.layoutBounds.top + 20,
      children: [
        new ScoreDisplayStars( scoreProperty, { numStars: NUM_STARS, perfectScore: PERFECT_SCORE } ),
        new ScoreDisplayLabeledStars( scoreProperty, { numStars: NUM_STARS, perfectScore: PERFECT_SCORE } ),
        new ScoreDisplayNumberAndStar( scoreProperty ),
        new ScoreDisplayLabeledNumber( scoreProperty )
      ]
    } );
    this.addChild( scoreDisplays );

    // Level selection buttons
    var buttonIcon = new Rectangle( 0, 0, 100, 100, { fill: 'red', stroke: 'black' } );

    var buttonWithStars = new LevelSelectionButton.ScoreDisplayCreator( buttonIcon, scoreProperty, {
      BUTTON_WIDTH: BUTTON_WIDTH,
      scoreDisplayConstructor: ScoreDisplayStars,
      scoreDisplayOptions: {
        numStars: NUM_STARS,
        perfectScore: PERFECT_SCORE
      },
      listener: function() { console.log( 'level start' ); }
    } );

    var buttonWithTextAndStars = new LevelSelectionButton.ScoreDisplayCreator( buttonIcon, scoreProperty, {
      BUTTON_WIDTH: BUTTON_WIDTH,
      scoreDisplayConstructor: ScoreDisplayLabeledStars,
      scoreDisplayOptions: {
        numStars: NUM_STARS,
        perfectScore: PERFECT_SCORE
      },
      listener: function() { console.log( 'level start' ); }
    } );

    var buttonWithNumberAndStar = new LevelSelectionButton.ScoreDisplayCreator( buttonIcon, scoreProperty, {
      BUTTON_WIDTH: BUTTON_WIDTH,
      scoreDisplayConstructor: ScoreDisplayNumberAndStar,
      listener: function() { console.log( 'level start' ); }
    } );

    var buttonWithTextAndNumber = new LevelSelectionButton.ScoreDisplayCreator( buttonIcon, scoreProperty, {
      BUTTON_WIDTH: BUTTON_WIDTH,
      scoreDisplayConstructor: ScoreDisplayLabeledNumber,
      listener: function() { console.log( 'level start' ); },
      bestTimeProperty: bestTimeProperty,
      bestTimeVisibleProperty: bestTimeVisibleProperty
    } );

    var levelSelectionButtons = new HBox( {
      spacing: 20,
      align: 'top',
      centerX: this.layoutBounds.centerX,
      top: scoreDisplays.bottom + 60,
      children: [ buttonWithStars, buttonWithTextAndStars, buttonWithNumberAndStar, buttonWithTextAndNumber ]
    } );
    this.addChild( levelSelectionButtons );

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
      centerX: this.layoutBounds.centerX,
      top: levelSelectionButtons.bottom + 60,
      children: [ scoreSlider, bestTimeSlider, bestTimeVisibleCheckbox ]
    } );
    this.addChild( controls );
  }

  vegas.register( 'LevelSelectionScreenView', LevelSelectionScreenView );

  return inherit( ScreenView, LevelSelectionScreenView );
} );