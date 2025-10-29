// Copyright 2022-2025, University of Colorado Boulder

/**
 * Demo for AllLevelsCompletedNode
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import BooleanRectangularToggleButton from '../../../../sun/js/buttons/BooleanRectangularToggleButton.js';
import AllLevelsCompletedNode from '../../AllLevelsCompletedNode.js';

export default function demoAllLevelsCompletedNode( layoutBounds: Bounds2 ): Node {
  const visibleProperty = new BooleanProperty( true );

  const textOptions = { fontSize: 20 };
  const visibilityButton = new BooleanRectangularToggleButton(
    visibleProperty,
    new Text( 'Hide', textOptions ),
    new Text( 'Show', textOptions )
  );

  const allLevelsCompletedNode = new AllLevelsCompletedNode( () => {
    visibleProperty.value = false;
    visibilityButton.focus();
  }, {
    visibleProperty: visibleProperty
  } );

  const parentNode = new VBox( {
    children: [ visibilityButton, allLevelsCompletedNode ],
    spacing: 20
  } );
  parentNode.boundsProperty.link( () => {
    parentNode.center = layoutBounds.center;
  } );
  return parentNode;
}