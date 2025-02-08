// Copyright 2022-2025, University of Colorado Boulder

/**
 * Demo for LevelCompletedNode
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import LevelCompletedNode from '../../LevelCompletedNode.js';

export default function demoLevelCompletedNode( layoutBounds: Bounds2 ): Node {

  const levelCompletedNode = new LevelCompletedNode( 1, 10, 10, 5, true, 2000, null, true, _.noop, {
    contentMaxWidth: 500
  } );

  // LevelCompletedNode has dynamic strings, so requires dynamic layout.
  levelCompletedNode.boundsProperty.link( () => {
    levelCompletedNode.center = layoutBounds.center;
  } );

  return levelCompletedNode;
}