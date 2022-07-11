// Copyright 2022, University of Colorado Boulder

/**
 * Demo for LevelSelectionButtonGroup
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import Range from '../../../../dot/js/Range.js';
import { HBox, Text, VBox } from '../../../../scenery/js/imports.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import HSlider from '../../../../sun/js/HSlider.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import LevelSelectionButtonGroup, { LevelSelectionButtonGroupItem } from '../../LevelSelectionButtonGroup.js';
import ScoreDisplayStars from '../../ScoreDisplayStars.js';
import Tandem from '../../../../tandem/js/Tandem.js';

export default function demoLevelSelectionButtonGroup( layoutBounds: Bounds2 ) {

  const scoreRange = new Range( 0, 1000 );
  const scoreProperty = new NumberProperty( 0, {
    range: scoreRange
  } );

  const bestTimeRange = new Range( 0, 10000 );
  const bestTimeProperty = new NumberProperty( 0, {
    range: bestTimeRange
  } );

  const bestTimeVisibleProperty = new BooleanProperty( true );

  const numberOfLevels = 4;

  const items: LevelSelectionButtonGroupItem[] = [];
  for ( let level = 1; level <= numberOfLevels; level++ ) {
    items.push( {
      icon: new Text( level, { font: new PhetFont( 20 ) } ),
      scoreProperty: scoreProperty,
      options: {
        createScoreDisplay: () => new ScoreDisplayStars( scoreProperty, {
          perfectScore: scoreRange.max
        } ),
        bestTimeProperty: bestTimeProperty,
        bestTimeVisibleProperty: bestTimeVisibleProperty
      }
    } );
  }

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
    new Text( 'Best time visible', { font: new PhetFont( 20 ) } ) );

  const controls = new VBox( {
    spacing: 15,
    children: [ scoreSlider, bestTimeSlider, bestTimeVisibleCheckbox ]
  } );

  const buttonGroup = new LevelSelectionButtonGroup( items, {
    levelSelectionButtonOptions: {
      baseColor: 'pink'
    },
    flowBoxOptions: {
      spacing: 20
    },
    tandem: Tandem.OPT_OUT
  } );

  return new VBox( {
    children: [ buttonGroup, controls ],
    spacing: 80,
    center: layoutBounds.center
  } );
}