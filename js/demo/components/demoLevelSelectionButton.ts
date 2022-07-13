// Copyright 2022, University of Colorado Boulder

/**
 * Demo for LevelSelectionButton
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import Range from '../../../../dot/js/Range.js';
import ScoreDisplayStars from '../../ScoreDisplayStars.js';
import ScoreDisplayLabeledStars from '../../ScoreDisplayLabeledStars.js';
import ScoreDisplayNumberAndStar from '../../ScoreDisplayNumberAndStar.js';
import ScoreDisplayLabeledNumber from '../../ScoreDisplayLabeledNumber.js';
import { HBox, RichText, Text, VBox } from '../../../../scenery/js/imports.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import HSlider from '../../../../sun/js/HSlider.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import LevelSelectionButton from '../../LevelSelectionButton.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';

const NUM_STARS = 5;

export default function demoLevelSelectionButton( layoutBounds: Bounds2 ) {

  const scoreRange = new Range( 0, 1000 );
  const scoreProperty = new NumberProperty( 0, {
    range: scoreRange
  } );

  const bestTimeRange = new Range( 0, 10000 );
  const bestTimeProperty = new NumberProperty( 0, {
    range: bestTimeRange
  } );

  const bestTimeVisibleProperty = new BooleanProperty( true );

  const buttonIcon = new RichText( 'Level<br>1', {
    align: 'center',
    font: new PhetFont( 14 )
  } );

  const buttonWithStars = new LevelSelectionButton( buttonIcon, scoreProperty, {
    createScoreDisplay: scoreProperty => new ScoreDisplayStars( scoreProperty, {
      numberOfStars: NUM_STARS,
      perfectScore: scoreRange.max
    } ),
    listener: () => console.log( 'level start' )
  } );

  const buttonWithTextAndStars = new LevelSelectionButton( buttonIcon, scoreProperty, {
    createScoreDisplay: scoreProperty => new ScoreDisplayLabeledStars( scoreProperty, {
      numberOfStars: NUM_STARS,
      perfectScore: scoreRange.max
    } ),
    listener: () => console.log( 'level start' ),
    soundPlayerIndex: 1
  } );

  const buttonWithNumberAndStar = new LevelSelectionButton( buttonIcon, scoreProperty, {
    createScoreDisplay: scoreProperty => new ScoreDisplayNumberAndStar( scoreProperty ),
    listener: () => console.log( 'level start' ),
    soundPlayerIndex: 2
  } );

  const buttonWithTextAndNumber = new LevelSelectionButton( buttonIcon, scoreProperty, {
    createScoreDisplay: scoreProperty => new ScoreDisplayLabeledNumber( scoreProperty ),
    listener: () => console.log( 'level start' ),
    bestTimeProperty: bestTimeProperty,
    bestTimeVisibleProperty: bestTimeVisibleProperty,
    soundPlayerIndex: 3
  } );

  const levelSelectionButtons = new HBox( {
    spacing: 20,
    align: 'top',
    children: [ buttonWithStars, buttonWithTextAndStars, buttonWithNumberAndStar, buttonWithTextAndNumber ]
  } );

  const scoreSlider = new HBox( {
    children: [
      new Text( 'Score: ', { font: new PhetFont( 20 ) } ),
      new HSlider( scoreProperty, scoreRange )
    ]
  } );

  const bestTimeSlider = new HBox( {
    children: [
      new Text( 'Best Time: ', { font: new PhetFont( 20 ) } ),
      new HSlider( bestTimeProperty, bestTimeRange )
    ]
  } );

  const bestTimeVisibleCheckbox = new Checkbox( bestTimeVisibleProperty,
    new Text( 'Best time visible', { font: new PhetFont( 20 ) } ), {

      // Best time is only displayed when it's > 0, so this control is irrelevant when bestTime === 0.
      enabledProperty: new DerivedProperty( [ bestTimeProperty ], bestTime => ( bestTime > 0 ) )
    } );

  const controls = new VBox( {
    spacing: 20,
    align: 'right',
    children: [
      scoreSlider,
      bestTimeSlider,
      bestTimeVisibleCheckbox
    ]
  } );

  return new VBox( {
    spacing: 50,
    children: [ levelSelectionButtons, controls ],
    center: layoutBounds.center
  } );
}