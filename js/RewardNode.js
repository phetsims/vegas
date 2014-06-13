//  Copyright 2002-2014, University of Colorado Boulder

/**
 * Reward node that shows many nodes animating, for fun!  Shown when a perfect score is achieved in a game.
 * You can also test this by running vegas/vegas_en.html and clicking on the "Reward" screen
 *
 * There are two ways to run the animation step function.  The client code can manually call step(dt), or the client code can pass in an Events instance that triggers events on 'step'.
 * In the latter case, the listener will automatically be removed when the animation is complete.
 *
 * Notes:
 * 1. Instead of continuous animation, the animation is shown as a transient behavior that shows for a few seconds and then disappears.
 *    This is to encourage the student to move to the next challenge, instead of becoming mesmerized by a perpetual animation.
 * 2. TODO: I would like to add optional support for rotation, scaling or other visual candy
 * 3. TODO: The RewardNode automatically detaches from its parents after the animation is complete?  Or perhaps this is normally coupled to the "continue" button in the LevelCompletedDialogNode?
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var CanvasNode = require( 'SCENERY/nodes/CanvasNode' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var StarNode = require( 'SCENERY_PHET/StarNode' );
  var FaceNode = require( 'SCENERY_PHET/FaceNode' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var Node = require( 'SCENERY/nodes/Node' );

  //This debug flag shows a gray rectangle for the CanvasNode to help ensure that its bounds are accurate
  var debug = false;

  function RewardNode( options ) {
    var rewardNode = this;
    this.options = options = _.extend( {

      //Bounds in which to render the canvas.  TODO: Should be full screen
      canvasBounds: new Bounds2( 0, 0, ScreenView.DEFAULT_LAYOUT_BOUNDS.width, ScreenView.DEFAULT_LAYOUT_BOUNDS.height ),

      //Scale things up for rasterization and back down for rendering so they have nice resolution on retina
      scaleForResolution: 2,

      //Nodes to appear in the reward node.  They will be cached as images to improve performance
      nodes: RewardNode.createRandomNodes( [
        new FaceNode( 40, {headStroke: 'black', headLineWidth: 1.5} ),
        new StarNode()
      ], 150 ),

      //If you pass in a stepSource, which conforms to the Events interface, the RewardNode will register for events through that source
      stepSource: null
    }, options );

    //If you pass in a stepSource, which conforms to the Events interface, the RewardNode will register for events through that source
    if ( options.stepSource ) {
      this.stepCallback = function( dt ) {rewardNode.step( dt );};
      options.stepSource.on( 'step', this.stepCallback );
    }

    //Cache the nodes as images.  Use an intermediate imageWrapper since the images will be returned later asynchronously
    //And we need a place to store them, and know when they have arrived
    this.imageWrappers = [];

    //find the unique nodes in the array
    var uniqueNodes = _.uniq( this.options.nodes );

    uniqueNodes.forEach( function( node, i ) {
      rewardNode.imageWrappers.push(
        {
          image: null,

          //Record the width so the nodes can be partially offscreen since layout done before toImage completed
          width: node.width,

          node: node
        } );
      var parent = new Node( {children: [node], scale: options.scaleForResolution} );
      parent.toImage( function( image ) {
        rewardNode.imageWrappers[i].image = image;
      } );
    } );

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
          var bounds = this.options.canvasBounds;

          //Fill the canvas with gray
          context.fillStyle = 'rgba(50,50,50,0.5)';
          context.fillRect( bounds.minX, bounds.minY, bounds.width, bounds.height );

          //Stroke the canvas border with blue
          context.strokeStyle = "#0000ff";
          context.lineWidth = 5;
          context.strokeRect( bounds.minX, bounds.minY, bounds.width, bounds.height );
        }
        context.scale( 1 / this.options.scaleForResolution, 1 / this.options.scaleForResolution );

        //Display the rewards, but check that they exist first.  They do not exist when attached to the timer with stepSource
        if ( this.rewards ) {
          for ( var i = 0; i < this.rewards.length; i++ ) {
            var reward = this.rewards[i];
            if ( reward.imageWrapper.image ) {
              context.drawImage( reward.imageWrapper.image, reward.x, reward.y );
            }
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

      //Find the first parent that is a ScreenView so we can listen for its transform, see https://github.com/phetsims/vegas/issues/4
      getScreenView: function() {
        var node = this;
        while ( node ) {
          assert && assert( node._parents[1] === undefined, 'globalToLocalPoint unable to work for DAG' );
          if ( node._parents[0] ) {
            node = node._parents[0];
            if ( node instanceof ScreenView ) {
              return node;
            }
          }
          else {
            break;
          }
        }

        throw new Error( 'No ScreenView found' );
      },

      //Only init after being attached to the scene graph, since we must ascertain the local bounds such that they take up the global screen.
      // 1. listen to the size of the scene/display
      // 2. record the trail between the scene and your CanvasNode, and
      // 3. apply the inverse of that transform to the CanvasNode (whenever an ancestor's transform changes, or when the scene/display size changes).
      //
      // JO said: for implementing now, I'd watch the iso transform, compute the inverse, and set bounds on changes to be precise (since you need them anyways to draw)
      init: function() {
        var rewardNode = this;
        var scene = this.getScene();

        //Listen to the bounds of the scene, so the canvas can be resized if the window is reshaped
        var updateBounds = function() {

          var local = rewardNode.globalToLocalBounds( scene.sceneBounds );
          rewardNode.setCanvasBounds( local );

          //Also, store the bounds in the options so the debug flag can render the bounds
          rewardNode.options.canvasBounds = local;
        };

        //When the scene is resized, update the bounds
        scene.addEventListener( 'resize', updateBounds );

        //When the ScreenView transform changes, update the bounds.  This prevents a "behind by one" problem, see https://github.com/phetsims/vegas/issues/4
        this.getScreenView().getTransform().addTransformListener( {before: function() {}, after: function() {updateBounds();}} );

        //Set the initial bounds
        updateBounds();

        //Store each reward, which has an imageWrapper (see above), x, y, speed
        this.rewards = [];
        for ( var i = 0; i < this.options.nodes.length; i++ ) {

          var node = this.options.nodes[i];
          //find the image wrapper corresponding to the node
          var imageWrapper = _.find( this.imageWrappers, function( imageWrapper ) {return imageWrapper.node === node} );
          this.rewards.push( {
            imageWrapper: imageWrapper,
            x: (Math.random() * this.options.canvasBounds.width + this.options.canvasBounds.left) * this.options.scaleForResolution - imageWrapper.width / 2,
            y: this.options.canvasBounds.top - Math.random() * this.options.canvasBounds.height * 2 - 200,
            speed: (Math.random() + 1) * 200
          } );
        }
      },

      //Move the rewards down according to their speed
      step: function( dt ) {
        if ( !this.inited && this.getScene() !== null ) {
          this.init();
          this.inited = true;
        }

        //Update all of the rewards
        var maxY = this.options.canvasBounds.height * this.options.scaleForResolution;
        for ( var i = 0; i < this.rewards.length; i++ ) {
          var reward = this.rewards[i];
          reward.y += reward.speed * dt;
          if ( reward.y > maxY ) {
            reward.y = this.options.canvasBounds.top - Math.random() * this.options.canvasBounds.height * 2 - 200;
          }
        }
        this.invalidatePaint();
      }
    },

    //Static methods
    {
      /**
       * Convenience factory method to create an array of the specified nodes in an even distribution.
       * @param {Array[Node]} nodes array of nodes to use
       * @param {Number} count
       */
      createRandomNodes: function( nodes, count ) {
        var array = [];
        for ( var i = 0; i < count; i++ ) {
          array.push( nodes[i % nodes.length] );
        }
        return array;
      }
    } );
} );