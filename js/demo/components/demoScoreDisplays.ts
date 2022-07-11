// Copyright 2022, University of Colorado Boulder

/**
 * Demo for various score displays.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import Range from '../../../../dot/js/Range.js';
import ScoreDisplayStars from '../../ScoreDisplayStars.js';
import ScoreDisplayLabeledStars from '../../ScoreDisplayLabeledStars.js';
import ScoreDisplayNumberAndStar from '../../ScoreDisplayNumberAndStar.js';
import ScoreDisplayLabeledNumber from '../../ScoreDisplayLabeledNumber.js';
import { HBox, Text, VBox } from '../../../../scenery/js/imports.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import HSlider from '../../../../sun/js/HSlider.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';

const NUM_STARS = 5;

export default function demoScoreDisplay( layoutBounds: Bounds2 ) {

  const scoreRange = new Range( 0, 1000 );
  const scoreProperty = new NumberProperty( 0, {
    range: scoreRange
  } );

  // Various options for displaying score.
  const scoreDisplays = new VBox( {
    resize: false,
    spacing: 50,
    align: 'left',
    centerX: layoutBounds.centerX,
    top: layoutBounds.top + 20,
    children: [
      new ScoreDisplayStars( scoreProperty, { numberOfStars: NUM_STARS, perfectScore: scoreRange.max } ),
      new ScoreDisplayLabeledStars( scoreProperty, { numberOfStars: NUM_STARS, perfectScore: scoreRange.max } ),
      new ScoreDisplayNumberAndStar( scoreProperty ),
      new ScoreDisplayLabeledNumber( scoreProperty )
    ]
  } );

  const scoreSlider = new HBox( {
    children: [
      new Text( 'Score: ', { font: new PhetFont( 20 ) } ),
      new HSlider( scoreProperty, scoreRange )
    ]
  } );

  return new VBox( {
    spacing: 50,
    children: [ scoreDisplays, scoreSlider ],
    center: layoutBounds.center
  } );
}