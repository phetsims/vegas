// Copyright 2022-2024, University of Colorado Boulder

/**
 * Demo for LevelSelectionButton
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import Range from '../../../../dot/js/Range.js';
import ScoreDisplayStars from '../../ScoreDisplayStars.js';
import ScoreDisplayLabeledStars from '../../ScoreDisplayLabeledStars.js';
import ScoreDisplayNumberAndStar from '../../ScoreDisplayNumberAndStar.js';
import ScoreDisplayLabeledNumber from '../../ScoreDisplayLabeledNumber.js';
import { HBox, Node, RichText, Text, VBox } from '../../../../scenery/js/imports.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import HSlider from '../../../../sun/js/HSlider.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import LevelSelectionButton from '../../LevelSelectionButton.js';

const NUM_STARS = 5;

export default function demoLevelSelectionButton( layoutBounds: Bounds2 ): Node {

  const scoreRange = new Range( 0, 1000 );
  const scoreProperty = new NumberProperty( 0, {
    range: scoreRange
  } );

  // Simple icon used on all buttons
  const buttonIcon = new RichText( 'Level<br>1', {
    align: 'center',
    font: new PhetFont( 14 )
  } );

  // Examples of LevelSelectionButton with various 'score display' options
  const buttonWithStars = new LevelSelectionButton( buttonIcon, scoreProperty, {
    createScoreDisplay: scoreProperty => new ScoreDisplayStars( scoreProperty, {
      numberOfStars: NUM_STARS,
      perfectScore: scoreRange.max
    } ),
    listener: () => console.log( 'level start' )
  } );

  const buttonWithLabeledStars = new LevelSelectionButton( buttonIcon, scoreProperty, {
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

  const buttonWithLabeledNumber = new LevelSelectionButton( buttonIcon, scoreProperty, {
    createScoreDisplay: scoreProperty => new ScoreDisplayLabeledNumber( scoreProperty ),
    listener: () => console.log( 'level start' ),
    soundPlayerIndex: 3
  } );

  const levelSelectionButtons = new HBox( {
    spacing: 20,
    align: 'top',
    children: [ buttonWithStars, buttonWithLabeledStars, buttonWithNumberAndStar, buttonWithLabeledNumber ]
  } );

  const scoreSlider = new HBox( {
    spacing: 10,
    children: [
      new Text( 'Score: ', { font: new PhetFont( 20 ) } ),
      new HSlider( scoreProperty, scoreProperty.range )
    ]
  } );

  return new VBox( {
    spacing: 50,
    children: [ levelSelectionButtons, scoreSlider ],
    center: layoutBounds.center
  } );
}