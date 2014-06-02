//  Copyright 2002-2014, University of Colorado Boulder

/**
 * Reward node that shows many nodes animating, for fun!  Shown when a perfect score is achieved in a game.
 * You can also test this by running vegas/vegas_en.html and clicking on the "Reward" screen
 *
 * Notes:
 * 1. Instead of continuous animation, the animation is shown as a transient behavior that shows for a few seconds and then disappears.
 *    This is to encourage the student to move to the next challenge, instead of becoming mesmerized by a perpetual animation.
 * 2. TODO: I would like to add optional support for rotation, scaling or other visual candy
 * 3. TODO: It is not exactly right to use the layout bounds, we should instead use the visible screen bounds.  EnergySkatePark has an example of computing the visual screen bounds.
 * 4. TODO: The RewardNode automatically detaches from its parents after the animation is complete?  Or perhaps this is normally coupled to the "continue" button in the LevelCompletedDialogNode?
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
  var Text = require( 'SCENERY/nodes/Text' );

  //This debug flag shows a gray rectangle for the CanvasNode to help ensure that its bounds are accurate
  var debug = true;

  function RewardNode( options ) {

    this.options = options = _.extend( {

      //Bounds in which to render the canvas.  TODO: Should be full screen
      canvasBounds: new Bounds2( 0, 0, ScreenView.DEFAULT_LAYOUT_BOUNDS.width, ScreenView.DEFAULT_LAYOUT_BOUNDS.height ),

      //Scale things up for rasterization and back down for rendering so they have nice resolution on retina
      scaleForResolution: 2,

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
      node.scale( options.scaleForResolution );
      node.toImage( function( image ) {
        imageWrappers[i].image = image;
      } );
    } );

    //Store each reward, which has an imageWrapper (see above), x, y, speed
    this.rewards = [];
    for ( var i = 0; i < options.rewardNodeCount; i++ ) {
      this.rewards.push( {
        imageWrapper: imageWrappers[i % imageWrappers.length],
        x: (Math.random() * options.canvasBounds.width + options.canvasBounds.left) * options.scaleForResolution,
        y: options.canvasBounds.top - Math.random() * options.canvasBounds.height - 200,
        speed: (Math.random() + 1) * 200
      } );
    }

    CanvasNode.call( this, options );

    //Some initialization must occur after this node is attached to the scene graph, see documentation for RewardNode.init below.
    this.inited = false;
  }

  return inherit( CanvasNode, RewardNode, {

    //Paint the rewards on the canvas
    // @param {CanvasContextWrapper} wrapper
    paintCanvas: function( wrapper ) {
      var context = wrapper.context;

      //If the debugging flag is on, show the bounds of the canvas
      if ( debug ) {
        //Fill the canvas with gray
        context.fillStyle = 'rgba(50,50,50,0.5)';
        context.fillRect( 0, 0, this.options.canvasBounds.width, this.options.canvasBounds.height );

        //Stroke the canvas border with blue
        context.strokeStyle = "#0000ff";
        context.lineWidth = 5;
        context.strokeRect( 0, 0, this.options.canvasBounds.width, this.options.canvasBounds.height );
      }
      context.scale( 1 / this.options.scaleForResolution, 1 / this.options.scaleForResolution );

      for ( var i = 0; i < this.rewards.length; i++ ) {
        var reward = this.rewards[i];
        if ( reward.imageWrapper.image ) {
          context.drawImage( reward.imageWrapper.image, reward.x, reward.y );
        }
      }
    },

    getScene: function() {
      //Find the root of the scene tree
      var node = this;
      while ( node ) {
        assert && assert( node._parents[1] === undefined, 'globalToLocalPoint unable to work for DAG' );
        if ( node._parents[0] ) {
          node = node._parents[0];
        }
        else {
          break;
        }
      }

      //TODO: add assertion to make sure node is a scenery.Scene
      return node;
    },

    //Only init after being attached to the scene graph, since we must ascertain the local bounds such that they take up the global screen.
    //@jonathanolson suggested getting the bounds right by doing the following:
    // 1. listen to the size of the scene/display
    // 2. record the trail between the scene and your CanvasNode, and
    // 3. apply the inverse of that transform to the CanvasNode (whenever an ancestor's transform changes, or when the scene/display size changes).

    // Later @jonathanolson continued:
    // I don't recall how Scenery will handle Bounds2.EVERYTHING (probably assertion fails) right now, but that can change
    // for implementing now, I'd watch the iso transform, compute the inverse, and set bounds on changes to be precise (since you need them anyways to draw)
    init: function() {
      var rewardNode = this;

      var scene = this.getScene();

      var bounds = scene.sceneBounds;
      console.log( bounds );

      //Listen to the bounds of the scene, so the canvas can be resized if the window is reshaped
      //TODO: The bounds are not working yet and I (@samreid) don't know why
      scene.addEventListener( 'resize', function() {

//        debugger;
        var globalBounds = scene.sceneBounds;
        var local = rewardNode.globalToLocalBounds( globalBounds );

        rewardNode.setCanvasBounds( new Bounds2( 0, 0, local.width, local.height ) );
        rewardNode.setTranslation( local.minX, local.minY );

        console.log( 'resized', local );

        //Also, store the bounds in the options so the debug flag can render the bounds
        rewardNode.options.canvasBounds = local;
      } );
    },

    //Move the rewards down according to their speed
    step: function( dt ) {
      if ( !this.inited && this.getScene() !== null ) {
        this.init();
        this.inited = true;
      }
      for ( var i = 0; i < this.rewards.length; i++ ) {
        var reward = this.rewards[i];
        reward.y += reward.speed * dt;
      }
      this.invalidatePaint();
    }
  } );
} );