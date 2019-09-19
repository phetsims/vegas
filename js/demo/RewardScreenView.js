// Copyright 2018, University of Colorado Boulder

/**
 * Test harness for the things related to game rewards.
 *
 * @author Sam Reid
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  const RewardDialog = require( 'VEGAS/RewardDialog' );
  const RewardNode = require( 'VEGAS/RewardNode' );
  const ScreenView = require( 'JOIST/ScreenView' );
  const Text = require( 'SCENERY/nodes/Text' );
  const vegas = require( 'VEGAS/vegas' );

  /**
   * @constructor
   */
  function RewardScreenView() {
    ScreenView.call( this );

    // RewardNode
    this.rewardNode = new RewardNode();
    this.addChild( this.rewardNode );

    // RewardDialog
    var rewardDialogButton = new RectangularPushButton( {
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

  return inherit( ScreenView, RewardScreenView, {

    // @public
    step: function( timeElapsed ) {
      this.rewardNode.step( timeElapsed );
    }
  } );
} );