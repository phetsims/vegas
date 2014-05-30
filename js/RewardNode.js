//  Copyright 2002-2014, University of Colorado Boulder

/**
 * Reward node that shows many nodes animating, for fun!  Shown when a perfect score is achieved in a game.
 *
 * Notes:
 * 1. Instead of continuous animation, the animation is shown as a transient behavior that shows for a few seconds and then disappears.
 *    This is to encourage the student to move to the next challenge, instead of becoming mesmerized by a perpetual animation.
 * 2. TODO: I would like to add optional support for rotation, scaling or other visual candy
 * 3. TODO: It is not exactly right to use the layout bounds, we should instead use the visible screen bounds.  EnergySkatePark has an example of computing the visual screen bounds.
 * 4. TODO: Provide utility support for the default node creation code and client code so that nodes can automatically be replicated and cached.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var CanvasNode = require( 'SCENERY/nodes/CanvasNode' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var StarNode = require( 'SCENERY_PHET/StarNode' );
  var FaceNode = require( 'SCENERY_PHET/FaceNode' );
  var Image = require( 'SCENERY/nodes/Image' );
  var Bounds2 = require( 'DOT/Bounds2' );

  var debug = false;

  function RewardNode( options ) {

    this.options = options = _.extend( {

      //Bounds in which to render the canvas.  TODO: Should be full screen
      canvasBounds: new Bounds2( 0, 0, ScreenView.DEFAULT_LAYOUT_BOUNDS.width, ScreenView.DEFAULT_LAYOUT_BOUNDS.height ),

      //Nodes to appear in the reward node.  They will be cached as images to improve performance
      nodes: [
        new FaceNode( 40, {headStroke: 'black', headLineWidth: 1.5} ),
        new StarNode()
      ],

      //Total number of nodes to display
      rewardNodeCount: 100
    }, options );

    //Cache the nodes as images.  Use an intermediate imageWrapper since the images will be returned later asynchronously
    //And we need a place to store them, and know when they have arrived
    var imageWrappers = [];
    options.nodes.forEach( function( node, i ) {
      imageWrappers.push( {image: null} );
      node.toImage( function( image ) {
        imageWrappers[i].image = image;
      } );
    } );

    //Store each reward, which has an imageWrapper (see above), x, y, speed
    this.rewards = [];
    for ( var i = 0; i < options.rewardNodeCount; i++ ) {
      this.rewards.push( {
        imageWrapper: imageWrappers[i % imageWrappers.length],
        x: Math.random() * options.canvasBounds.width + options.canvasBounds.left,
        y: options.canvasBounds.top - Math.random() * options.canvasBounds.height - 200,
        speed: (Math.random() + 1) * 60
      } );
    }

    CanvasNode.call( this, options );
  }

  return inherit( CanvasNode, RewardNode, {

    //Paint the rewards on the canvas
    // @param {CanvasContextWrapper} wrapper
    paintCanvas: function( wrapper ) {
      var context = wrapper.context;
      if ( debug ) {
        context.fillStyle = 'rgba(50,50,50,0.5)';
        context.fillRect( 0, 0, this.options.canvasBounds.width, this.options.canvasBounds.height );
      }

      for ( var i = 0; i < this.rewards.length; i++ ) {
        var reward = this.rewards[i];
        if ( reward.imageWrapper.image ) {
          context.drawImage( reward.imageWrapper.image, reward.x, reward.y );
        }
      }
    },

    //Move the rewards down according to their speed
    step: function( dt ) {
      for ( var i = 0; i < this.rewards.length; i++ ) {
        var reward = this.rewards[i];
        reward.y += reward.speed * dt;
      }
      this.invalidatePaint();
    }
  } );
} );