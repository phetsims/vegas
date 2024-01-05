// Copyright 2022, University of Colorado Boulder

/**
 * Demo for AllLevelsCompletedNode
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import { Node } from '../../../../scenery/js/imports.js';
import AllLevelsCompletedNode from '../../AllLevelsCompletedNode.js';

export default function demoAllLevelsCompletedNode( layoutBounds: Bounds2 ): Node {
  return new AllLevelsCompletedNode( () => _.noop, {
    center: layoutBounds.center
  } );
}