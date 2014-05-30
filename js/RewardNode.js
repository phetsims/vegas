//  Copyright 2002-2014, University of Colorado Boulder

/**
 * Reward node that shows many nodes animating, for fun!  Shown when a perfect score is achieved in a game.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );

  function RewardNode( options ) {

    options = _.extend( {
    }, options );

    Node.call( this );

    this.mutate( options );
  }

  return inherit( Node, RewardNode );
} );