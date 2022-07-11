// Copyright 2022, University of Colorado Boulder

/**
 * Demo for RewardNode
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import RewardNode from '../../RewardNode.js';
import stepTimer from '../../../../axon/js/stepTimer.js';

export default function demoRewardNode( layoutBounds: Bounds2 ) {

  const rewardNode = new RewardNode();

  stepTimer.addListener( dt => {
    rewardNode.step( dt );
  } );

  return rewardNode;
}