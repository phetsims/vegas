// Copyright 2018-2021, University of Colorado Boulder

/**
 * Test harness for the things related to game rewards.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ScreenView from '../../../joist/js/ScreenView.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import Text from '../../../scenery/js/nodes/Text.js';
import RectangularPushButton from '../../../sun/js/buttons/RectangularPushButton.js';
import RewardDialog from '../RewardDialog.js';
import RewardNode from '../RewardNode.js';
import vegas from '../vegas.js';

class RewardScreenView extends ScreenView {

  constructor() {
    super();

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

  // @public
  step( timeElapsed ) {
    this.rewardNode.step( timeElapsed );
  }
}

vegas.register( 'RewardScreenView', RewardScreenView );
export default RewardScreenView;