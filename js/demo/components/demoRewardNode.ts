// Copyright 2022-2025, University of Colorado Boulder

/**
 * Demo for RewardNode
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import stepTimer from '../../../../axon/js/stepTimer.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import TimeControlNode from '../../../../scenery-phet/js/TimeControlNode.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import RewardNode from '../../RewardNode.js';

export default function demoRewardNode( layoutBounds: Bounds2 ): Node {
  return new DemoNode( layoutBounds );
}

class DemoNode extends Node {

  private readonly disposeDemoNode: () => void;

  public constructor( layoutBounds: Bounds2 ) {

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

    const stepTimerListener = ( dt: number ) => {
      if ( isPlayingProperty.value ) {
        rewardNode.step( dt );
      }
    };
    stepTimer.addListener( stepTimerListener );

    super( {
      children: [ rewardNode, timeControls ]
    } );

    this.disposeDemoNode = () => {
      rewardNode.dispose(); // must be disposed in the demo, see https://github.com/phetsims/vegas/issues/111
      isPlayingProperty.dispose();
      timeControls.dispose();
      if ( stepTimer.hasListener( stepTimerListener ) ) {
        stepTimer.removeListener( stepTimerListener );
      }
    };
  }

  public override dispose(): void {
    this.disposeDemoNode();
    super.dispose();
  }
}