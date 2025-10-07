// Copyright 2022-2025, University of Colorado Boulder

/**
 * Demo for various score displays.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Range from '../../../../dot/js/Range.js';
import AccessibleListNode from '../../../../scenery-phet/js/accessibility/AccessibleListNode.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import HSlider from '../../../../sun/js/HSlider.js';
import ScoreDisplayLabeledNumber from '../../ScoreDisplayLabeledNumber.js';
import ScoreDisplayLabeledStars from '../../ScoreDisplayLabeledStars.js';
import ScoreDisplayNumberAndStar from '../../ScoreDisplayNumberAndStar.js';
import ScoreDisplayStars from '../../ScoreDisplayStars.js';
import VegasStrings from '../../VegasStrings.js';

const NUM_STARS = 5;

export default function demoScoreDisplays( layoutBounds: Bounds2 ): Node {

  const scoreProperty = new NumberProperty( 0, {
    range: new Range( 0, 10 )
  } );

  const scoreDisplayStars = new ScoreDisplayStars( scoreProperty, { numberOfStars: NUM_STARS, perfectScore: scoreProperty.range.max } );
  const scoreDisplayLabelledStars = new ScoreDisplayLabeledStars( scoreProperty, {
    scoreDisplayStarsOptions: {
      numberOfStars: NUM_STARS, perfectScore: scoreProperty.range.max
    }
  } );
  const scoreDisplayNumberAndStar = new ScoreDisplayNumberAndStar( scoreProperty );
  const scoreDisplayLabeledNumber = new ScoreDisplayLabeledNumber( scoreProperty );

  // An accessible list Node demonstrating the accessible strings reading the score displays.
  const accessibleScoreListNode = new AccessibleListNode( [
    scoreDisplayStars.accessibleScoreStringProperty,
    scoreDisplayLabelledStars.accessibleScoreStringProperty,
    scoreDisplayNumberAndStar.accessibleScoreStringProperty,
    scoreDisplayLabeledNumber.accessibleScoreStringProperty
  ], {
    leadingParagraphStringProperty: new Property( 'Score displays:' )
  } );

  // Various options for displaying score.
  const scoreDisplays = new VBox( {
    resize: false,
    spacing: 50,
    align: 'left',
    centerX: layoutBounds.centerX,
    top: layoutBounds.top + 20,
    children: [
      scoreDisplayStars,
      scoreDisplayLabelledStars,
      scoreDisplayNumberAndStar,
      scoreDisplayLabeledNumber,

      accessibleScoreListNode
    ]
  } );

  const scoreSlider = new HBox( {
    spacing: 8,
    children: [
      new Text( VegasStrings.scoreStringProperty, { font: new PhetFont( 20 ) } ),
      new HSlider( scoreProperty, scoreProperty.range )
    ]
  } );

  return new VBox( {
    spacing: 50,
    align: 'left',
    children: [ scoreDisplays, scoreSlider ],
    center: layoutBounds.center
  } );
}