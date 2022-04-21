// Copyright 2018-2022, University of Colorado Boulder

/**
 * Test harness for the things related to game rewards.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ScreenView from '../../../joist/js/ScreenView.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import { Text } from '../../../scenery/js/imports.js';
import RectangularPushButton from '../../../sun/js/buttons/RectangularPushButton.js';
import RewardDialog from '../RewardDialog.js';
import RewardNode from '../RewardNode.js';
import vegas from '../vegas.js';
import Tandem from '../../../tandem/js/Tandem.js';

export default class RewardScreenView extends ScreenView {

  private readonly rewardNode: RewardNode;

  constructor() {
    super( {
      tandem: Tandem.OPT_OUT
    } );

    // RewardNode
    this.rewardNode = new RewardNode();
    this.addChild( this.rewardNode );

    // RewardDialog
    const rewardDialogButton = new RectangularPushButton( {
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
      center: this.layoutBounds.center.plusXY( -20, 0 )
    } );
    this.addChild( rewardDialogButton );
  }

  public override step( timeElapsed: number ): void {
    this.rewardNode.step( timeElapsed );
  }
}

vegas.register( 'RewardScreenView', RewardScreenView );