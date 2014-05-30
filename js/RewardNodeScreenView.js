// Copyright 2002-2014, University of Colorado Boulder

/**
 * Test harness for the RewardNode
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var OutsideBackgroundNode = require( 'SCENERY_PHET/OutsideBackgroundNode' );
  var Property = require( 'AXON/Property' );
  var RewardNode = require( 'VEGAS/RewardNode' );

  function RewardNodeScreenView() {
    ScreenView.call( this, { renderer: 'svg' } );

    // background
    this.addChild( new OutsideBackgroundNode( this.layoutBounds.centerX, this.layoutBounds.centerY + 20, this.layoutBounds.width * 3, this.layoutBounds.height, this.layoutBounds.height ) );

    this.addChild( new RewardNode() );
  }

  return inherit( ScreenView, RewardNodeScreenView, {
    step: function( timeElapsed ) {
      // Does nothing for now.
    }
  } );
} );