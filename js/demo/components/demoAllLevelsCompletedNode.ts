// Copyright 2022-2025, University of Colorado Boulder

/**
 * Demo for AllLevelsCompletedNode
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import AllLevelsCompletedNode from '../../AllLevelsCompletedNode.js';

export default function demoAllLevelsCompletedNode( layoutBounds: Bounds2 ): Node {
  const allLevelsCompletedNode = new AllLevelsCompletedNode( () => _.noop );
  allLevelsCompletedNode.boundsProperty.link( () => {
    allLevelsCompletedNode.center = layoutBounds.center;
  } );
  return allLevelsCompletedNode;
}