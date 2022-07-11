// Copyright 2022, University of Colorado Boulder

/**
 * Demo for RewardDialog
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import { Text } from '../../../../scenery/js/imports.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import RewardDialog from '../../RewardDialog.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';

export default function demoRewardDialog( layoutBounds: Bounds2 ) {

  // RewardDialog
  return new RectangularPushButton( {
    content: new Text( 'open RewardDialog', { font: new PhetFont( 20 ) } ),
    listener: function() {
      const rewardDialog = new RewardDialog( 10, {
        keepGoingButtonListener: () => {
          console.log( 'Keep Going button' );
          rewardDialog.dispose();
        },
        newLevelButtonListener: () => {
          console.log( 'New Level button' );
          rewardDialog.dispose();
        }
      } );
      rewardDialog.show();
    },
    center: layoutBounds.center
  } );
}