// Copyright 2022, University of Colorado Boulder

/**
 * Demo for RewardNode
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import { Node } from '../../../../scenery/js/imports.js';
import RewardNode from '../../RewardNode.js';
import stepTimer from '../../../../axon/js/stepTimer.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import TimeControlNode from '../../../../scenery-phet/js/TimeControlNode.js';

export default function demoRewardNode( layoutBounds: Bounds2 ) {

  const rewardNode = new RewardNode();

  const isPlayingProperty = new BooleanProperty( true );

  const timeControls = new TimeControlNode( isPlayingProperty, {
    playPauseStepButtonOptions: {
      stepForwardButtonOptions: {
        listener: () => rewardNode.step( 0.1 )
      }
    },
    centerX: layoutBounds.centerX,
    bottom: layoutBounds.bottom - 20
  } );

  stepTimer.addListener( dt => {
    if ( isPlayingProperty.value ) {
      rewardNode.step( dt );
    }
  } );

  return new Node( {
    children: [ rewardNode, timeControls ]
  } );
}