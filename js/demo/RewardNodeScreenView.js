// Copyright 2014-2017, University of Colorado Boulder

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
  var RewardNode = require( 'VEGAS/RewardNode' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var vegas = require( 'VEGAS/vegas' );

  /**
   * @constructor
   */
  function RewardNodeScreenView() {
    ScreenView.call( this, { layoutBounds: new Bounds2( 0, 0, 768, 504 ) } );

    this.rewardNode = new RewardNode();
    this.addChild( this.rewardNode );
  }

  vegas.register( 'RewardNodeScreenView', RewardNodeScreenView );

  return inherit( ScreenView, RewardNodeScreenView, {

    // @public
    step: function( timeElapsed ) {
      this.rewardNode.step( timeElapsed );
    }
  } );
} );