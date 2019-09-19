// Copyright 2014-2019, University of Colorado Boulder

/**
 * Reward node that shows many nodes animating continuously, for fun!  Shown when a perfect score is achieved in a game.
 * You can also test this by running vegas/vegas_en.html and clicking on the "Reward" screen.
 * Note that the number of images falling is constant, so if the screen is stretched out vertically (tall thin window)
 * they will be less dense.
 *
 * There are two ways to run the animation step function.  The client code can manually call step(dt), or the client
 * code can pass in an Events instance that triggers events on 'step'. In the latter case, the listener will
 * automatically be removed when the animation is complete.
 *
 * For details about the development of the RewardNode, please see https://github.com/phetsims/vegas/issues/4
 *
 * @author Sam Reid
 */
define( require => {
  'use strict';

  // modules
  const Bounds2 = require( 'DOT/Bounds2' );
  const CanvasNode = require( 'SCENERY/nodes/CanvasNode' );
  const FaceNode = require( 'SCENERY_PHET/FaceNode' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Node = require( 'SCENERY/nodes/Node' );
  const ScreenView = require( 'JOIST/ScreenView' );
  const StarNode = require( 'SCENERY_PHET/StarNode' );
  const vegas = require( 'VEGAS/vegas' );

  // ifphetio
  const phetioEngine = require( 'ifphetio!PHET_IO/phetioEngine' );

  // constants
  var DEBUG = false; // shows a gray rectangle for the CanvasNode to help ensure that its bounds are accurate
  var MAX_SPEED = 200; // The maximum speed an image can fall in screen pixels per second.

  /**
   * @param {Object} [options]
   * @constructor
   */
  function RewardNode( options ) {
    var self = this;

    /*
     * Bounds in which to render the canvas, which represents the full window. See below for how this is computed based
     * on ScreenView bounds and relative transforms
     */
    this.canvasDisplayBounds = new Bounds2( 0, 0, 0, 0 );

    // @private
    this.options = options = _.extend( {

      // Scale things up for rasterization and back down for rendering so they have nice resolution on retina
      scaleForResolution: 2,

      /*
       * Nodes to appear in the reward node.  They will be cached as images to improve performance.
       * The simulation should override this array to provide images specific to the simulation.
       */
      nodes: RewardNode.createRandomNodes( [
        new FaceNode( 40, { headStroke: 'black', headLineWidth: 1.5 } ),
        new StarNode()
      ], 150 ),

      // If you pass in a stepEmitter {Emitter}, it will drive the animation
      stepEmitter: null
    }, options );

    // If you pass in a stepEmitter, it will drive the animation
    if ( options.stepEmitter ) {
      this.stepCallback = function( dt ) { self.step( dt );};
      options.stepEmitter.addListener( this.stepCallback );
    }

    /*
     * Cache each unique node as an image for faster rendering in canvas.  Use an intermediate imageWrapper since the
     * images will be returned later asynchronously. And we need a place to store them, and know when they have arrived.
     */
    this.imageWrappers = []; // @private

    // find the unique nodes in the array
    var uniqueNodes = _.uniq( this.options.nodes );

    uniqueNodes.forEach( function( node, i ) {
      self.imageWrappers.push( {
        // The image to be rendered in the canvas, will be filled in by toImage callback
        image: null,

        // Record the width and height so the nodes can be positioned before the toImage call has completed
        width: node.width,
        height: node.height,

        // The node itself is recorded in the imageWrapper so the imageWrapper can be looked up based on the original node
        node: node
      } );
      var parent = new Node( { children: [ node ], scale: options.scaleForResolution } );
      parent.toImage( function( image ) {
        self.imageWrappers[ i ].image = image;
        parent.dispose(); // not needed anymore, see https://github.com/phetsims/area-model-common/issues/128
      } );
    } );

    CanvasNode.call( this, options );

    // @private - Some initialization must occur after this node is attached to the scene graph, see documentation for
    // RewardNode.init below.
    this.inited = false;

    // make sure this node is initialized when state is being set for PhET-iO
    if ( phetioEngine.phetioStateEngine ) {

      // @private
      this.initializationVerifier = function() {
        if ( !self.inited ) {
          self.init();
        }
      };
      phetioEngine.phetioStateEngine.stateSetEmitter.addListener( this.initializationVerifier );
    }
  }

  vegas.register( 'RewardNode', RewardNode );

  return inherit( CanvasNode, RewardNode, {

      /**
       * Paint the rewards on the canvas
       * @param {CanvasRenderingContext2D} context
       * @protected
       */
      paintCanvas: function( context ) {

        // If the debugging flag is on, show the bounds of the canvas
        if ( DEBUG ) {
          var bounds = this.canvasDisplayBounds;

          //Fill the canvas with gray
          context.fillStyle = 'rgba(50,50,50,0.5)';
          context.fillRect( bounds.minX, bounds.minY, bounds.width, bounds.height );

          //Stroke the canvas border with blue
          context.strokeStyle = '#0000ff';
          context.lineWidth = 5;
          context.strokeRect( bounds.minX, bounds.minY, bounds.width, bounds.height );
        }
        context.scale( 1 / this.options.scaleForResolution, 1 / this.options.scaleForResolution );

        // Display the rewards, but check that they exist first.  They do not exist when attached to the timer with stepEmitter
        if ( this.rewards ) {
          for ( var i = 0; i < this.rewards.length; i++ ) {
            var reward = this.rewards[ i ];
            if ( reward.imageWrapper.image ) {
              context.drawImage( reward.imageWrapper.image, reward.x, reward.y );
            }
          }
        }
      },

      // Find the root of the scene tree
      getScene: function() {
        return this.getUniqueTrail().nodes[ 0 ];
      },

      // Find the first parent that is a ScreenView so we can listen for its transform, see https://github.com/phetsims/vegas/issues/4
      getScreenView: function() {
        return this.getUniqueTrail( function( node ) { return node instanceof ScreenView; } ).rootNode();
      },

      /**
       * Only init after being attached to the scene graph, since we must ascertain the local bounds such that they take
       * up the global screen.
       * 1. listen to the size of the scene/display
       * 2. record the trail between the scene and your CanvasNode, and
       * 3. apply the inverse of that transform to the CanvasNode (whenever an ancestor's transform changes, or when the scene/display size changes).
       *
       * @jonathanolson said: for implementing now, I'd watch the iso transform, compute the inverse, and set bounds on
       * changes to be precise (since you need them anyways to draw).
       * @public
       */
      init: function() {
        var self = this;
        this.scene = this.getScene();
        this.screenView = this.getScreenView();

        // Listen to the bounds of the scene, so the canvas can be resized if the window is reshaped
        this.updateBounds = function() {

          var local = self.globalToLocalBounds( phet.joist.sim.display.bounds );
          self.setCanvasBounds( local );

          // Also, store the bounds in the options so the debug flag can render the bounds
          self.canvasDisplayBounds = local;
        };

        // When the ScreenView transform changes, update the bounds.  This prevents a "behind by one" problem, see https://github.com/phetsims/vegas/issues/4
        this.screenView.on( 'transform', this.updateBounds );

        // Set the initial bounds
        this.updateBounds();

        /*
         * Store each reward, which has an imageWrapper (see above), x, y, speed. It is not an image, it is not a node,
         * but it is one of the things that animates as falling in the RewardNode and its associated data.
         * @private
         */
        //TODO should we create a separate class for this?
        this.rewards = [];
        for ( var i = 0; i < this.options.nodes.length; i++ ) {

          var node = this.options.nodes[ i ];
          ( function( node ) {

            //find the image wrapper corresponding to the node
            var imageWrapper = _.find( self.imageWrappers, function( imageWrapper ) {return imageWrapper.node === node;} );
            self.rewards.push( {
              imageWrapper: imageWrapper,
              x: self.sampleImageXValue( imageWrapper ),
              y: self.sampleImageYValue( imageWrapper ),
              speed: ( phet.joist.random.nextDouble() + 1 ) * MAX_SPEED
            } );
          } )( node );
        }

        this.inited = true;
      },

      // Cease the animation.  If there is a stepEmitter, remove its listener
      stop: function() {
        this.options.stepEmitter && this.options.stepEmitter.removeListener( this.stepCallback );
      },

      // Select a random X value for the image when it is created.
      sampleImageXValue: function( imageWrapper ) {
        return ( phet.joist.random.nextDouble() * this.canvasDisplayBounds.width + this.canvasDisplayBounds.left ) * this.options.scaleForResolution - imageWrapper.width / 2;
      },

      // @private - select a random Y value for the image when it is created, or when it goes back to the top of the screen
      sampleImageYValue: function( imageWrapper ) {
        // Start things about 1 second off the top of the screen
        return this.canvasDisplayBounds.top - phet.joist.random.nextDouble() * this.canvasDisplayBounds.height * 2 - MAX_SPEED - imageWrapper.height;
      },

      // @public - move the rewards down according to their speed
      step: function( dt ) {
        if ( !this.inited && this.getScene() !== null ) {
          this.init();
        }

        // Update all of the rewards
        var maxY = this.canvasDisplayBounds.height * this.options.scaleForResolution;
        for ( var i = 0; i < this.rewards.length; i++ ) {
          var reward = this.rewards[ i ];

          // Move each node straight down at constant speed
          reward.y += reward.speed * dt;

          // Move back to the top after the node falls off the bottom
          if ( reward.y > maxY ) {
            reward.x = this.sampleImageXValue( reward.imageWrapper );
            reward.y = this.sampleImageYValue( reward.imageWrapper );
          }
        }
        this.invalidatePaint();
      },

      dispose: function() {
        this.stop();
        this.screenView && this.screenView.off( 'transform', this.updateBounds );
        this.initializationVerifier && phetioEngine.phetioStateEngine.stateSetEmitter.removeListener( this.initializationVerifier );
        CanvasNode.prototype.dispose.call( this );
      }
    },

    //Static methods
    {
      /**
       * Convenience factory method to create an array of the specified nodes in an even distribution.
       * @param {Node[]} nodes array of nodes to use
       * @param {number} count
       * @returns {Node[]}
       * @public
       */
      createRandomNodes: function( nodes, count ) {
        var array = [];
        for ( var i = 0; i < count; i++ ) {
          array.push( nodes[ i % nodes.length ] );
        }
        return array;
      }
    } );
} );