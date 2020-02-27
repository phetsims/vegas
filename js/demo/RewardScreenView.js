// Copyright 2018-2019, University of Colorado Boulder

/**
 * Test harness for the things related to game rewards.
 *
 * @author Sam Reid
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ScreenView from '../../../joist/js/ScreenView.js';
import inherit from '../../../phet-core/js/inherit.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import Text from '../../../scenery/js/nodes/Text.js';
import RectangularPushButton from '../../../sun/js/buttons/RectangularPushButton.js';
import RewardDialog from '../RewardDialog.js';
import RewardNode from '../RewardNode.js';
import vegas from '../vegas.js';

/**
 * @constructor
 */
function RewardScreenView() {
  ScreenView.call( this );

  // RewardNode
  this.rewardNode = new RewardNode();
  this.addChild( this.rewardNode );

  // RewardDialog
  const rewardDialogButton = new RectangularPushButton( {
    content: new Text( 'open RewardDialog', { font: new PhetFont( 20 ) } ),
    listener: function() {
      var rewardDialog = new RewardDialog( 10, {
        keepGoingButtonListener: function() {
          console.log( 'Keep Going button' );
          rewardDialog.dispose();
        },
        newLevelButtonListener: function() {
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

vegas.register( 'RewardScreenView', RewardScreenView );

export default inherit( ScreenView, RewardScreenView, {

  // @public
  step: function( timeElapsed ) {
    this.rewardNode.step( timeElapsed );
  }
} );