// Copyright 2014-2015, University of Colorado Boulder

/**
 * Test harness for the RewardNode
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var OutsideBackgroundNode = require( 'SCENERY_PHET/OutsideBackgroundNode' );
  var RewardNode = require( 'VEGAS/RewardNode' );
  var vegas = require( 'VEGAS/vegas' );

  /**
   * @constructor
   */
  function RewardNodeScreenView() {
    ScreenView.call( this, { layoutBounds: new Bounds2( 0, 0, 768, 504 ) } );

    // background
    this.addChild( new OutsideBackgroundNode( this.layoutBounds.centerX, this.layoutBounds.centerY + 20, this.layoutBounds.width * 3, this.layoutBounds.height, this.layoutBounds.height ) );

    this.rewardNode = new RewardNode();
    this.addChild( this.rewardNode );

    // Workaround for https://github.com/phetsims/joist/issues/130
    // this.rewardNode.step( 0.01 );
  }

  vegas.register( 'RewardNodeScreenView', RewardNodeScreenView );

  return inherit( ScreenView, RewardNodeScreenView, {

    // @public
    step: function( timeElapsed ) {
      this.rewardNode.step( timeElapsed );
    }
  } );
} );