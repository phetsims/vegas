// Copyright 2014-2018, University of Colorado Boulder

/**
 * Demonstrates UI components related to the typical level-selection UI in games.
 *
 * @author Sam Reid
 * @author Andrea Lin
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const Checkbox = require( 'SUN/Checkbox' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const HSlider = require( 'SUN/HSlider' );
  const inherit = require( 'PHET_CORE/inherit' );
  const LevelSelectionButton = require( 'VEGAS/LevelSelectionButton' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Property = require( 'AXON/Property' );
  const Range = require( 'DOT/Range' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const ScoreDisplayLabeledNumber = require( 'VEGAS/ScoreDisplayLabeledNumber' );
  const ScoreDisplayLabeledStars = require( 'VEGAS/ScoreDisplayLabeledStars' );
  const ScoreDisplayNumberAndStar = require( 'VEGAS/ScoreDisplayNumberAndStar' );
  const ScoreDisplayStars = require( 'VEGAS/ScoreDisplayStars' );
  const ScreenView = require( 'JOIST/ScreenView' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );
  const vegas = require( 'VEGAS/vegas' );

  // constants
  var NUM_STARS = 5;
  var SCORE_RANGE = new Range( 0, 1000 );
  var BEST_TIME_RANGE = new Range( 0, 10000 );

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
        new ScoreDisplayStars( scoreProperty, { numberOfStars: NUM_STARS, perfectScore: SCORE_RANGE.max } ),
        new ScoreDisplayLabeledStars( scoreProperty, { numberOfStars: NUM_STARS, perfectScore: SCORE_RANGE.max } ),
        new ScoreDisplayNumberAndStar( scoreProperty ),
        new ScoreDisplayLabeledNumber( scoreProperty )
      ]
    } );
    this.addChild( scoreDisplays );

    // Level selection buttons
    var buttonIcon = new Rectangle( 0, 0, 100, 100, { fill: 'red', stroke: 'black' } );

    var buttonWithStars = new LevelSelectionButton( buttonIcon, scoreProperty, {
      scoreDisplayConstructor: ScoreDisplayStars,
      scoreDisplayOptions: {
        numberOfStars: NUM_STARS,
        perfectScore: SCORE_RANGE.max
      },
      listener: function() { console.log( 'level start' ); }
    } );

    var buttonWithTextAndStars = new LevelSelectionButton( buttonIcon, scoreProperty, {
      scoreDisplayConstructor: ScoreDisplayLabeledStars,
      scoreDisplayOptions: {
        numberOfStars: NUM_STARS,
        perfectScore: SCORE_RANGE.max
      },
      listener: function() { console.log( 'level start' ); }
    } );

    var buttonWithNumberAndStar = new LevelSelectionButton( buttonIcon, scoreProperty, {
      scoreDisplayConstructor: ScoreDisplayNumberAndStar,
      listener: function() { console.log( 'level start' ); }
    } );

    var buttonWithTextAndNumber = new LevelSelectionButton( buttonIcon, scoreProperty, {
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
        new HSlider( scoreProperty, SCORE_RANGE )
      ]
    } );

    var bestTimeSlider = new HBox( {
      children: [
        new Text( 'Best Time: ', { font: new PhetFont( 20 ) } ),
        new HSlider( bestTimeProperty, BEST_TIME_RANGE )
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