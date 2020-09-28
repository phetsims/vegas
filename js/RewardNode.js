// Copyright 2014-2020, University of Colorado Boulder

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

import Bounds2 from '../../dot/js/Bounds2.js';
import ScreenView from '../../joist/js/ScreenView.js';
import merge from '../../phet-core/js/merge.js';
import FaceNode from '../../scenery-phet/js/FaceNode.js';
import StarNode from '../../scenery-phet/js/StarNode.js';
import CanvasNode from '../../scenery/js/nodes/CanvasNode.js';
import Node from '../../scenery/js/nodes/Node.js';
import Tandem from '../../tandem/js/Tandem.js';
import vegas from './vegas.js';

// constants
const DEBUG = false; // shows a gray rectangle for the CanvasNode to help ensure that its bounds are accurate
const MAX_SPEED = 200; // The maximum speed an image can fall in screen pixels per second.

class RewardNode extends CanvasNode {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    // @private
    options = merge( {

      // Scale things up for rasterization and back down for rendering so they have nice resolution on retina
      scaleForResolution: 2,

      // {Node[]} Nodes to appear in the reward node.  They will be cached as images to improve performance.
      // The simulation should override this array to provide images specific to the simulation.
      // If null, the default is initialized below.
      nodes: null,

      // If you pass in a stepEmitter {Emitter}, it will drive the animation
      stepEmitter: null
    }, options );

    if ( options.nodes === null ) {
      options.nodes = RewardNode.createRandomNodes( [
        new FaceNode( 40, { headStroke: 'black', headLineWidth: 1.5 } ),
        new StarNode()
      ], 150 );
    }

    super( options );

    // @private
    this.options = options;

    // Bounds in which to render the canvas, which represents the full window. See below for how this is computed based
    // on ScreenView bounds and relative transforms
    this.canvasDisplayBounds = new Bounds2( 0, 0, 0, 0 );

    // @private If you pass in a stepEmitter, it will drive the animation
    this.stepEmitterListener = null;
    if ( options.stepEmitter ) {
      this.stepEmitterListener = dt => this.step( dt );
      options.stepEmitter.addListener( this.stepEmitterListener );
    }

    // @private {Node[]}
    // Cache each unique node as an image for faster rendering in canvas.  Use an intermediate imageWrapper since the
    // images will be returned later asynchronously. And we need a place to store them, and know when they have arrived.
    this.imageWrappers = [];

    // find the unique nodes in the array
    const uniqueNodes = _.uniq( options.nodes );
    uniqueNodes.forEach( ( node, i ) => {
      this.imageWrappers.push( {
        // The image to be rendered in the canvas, will be filled in by toImage callback
        image: null,

        // Record the width and height so the nodes can be positioned before the toImage call has completed
        width: node.width,
        height: node.height,

        // The node itself is recorded in the imageWrapper so the imageWrapper can be looked up based on the original node
        node: node
      } );

      const parent = new Node( { children: [ node ], scale: options.scaleForResolution } );
      parent.toImage( image => {
        this.imageWrappers[ i ].image = image;
        parent.dispose(); // not needed anymore, see https://github.com/phetsims/area-model-common/issues/128
      } );
    } );

    // @private {boolean} Some initialization must occur after this node is attached to the scene graph,
    // see documentation for initialize() method below.
    this.isInitialized = false;

    // @private these will be set by init
    this.scene = null; // {Node}
    this.screenView = null; // {ScreenView}
    this.updateBounds = null; // {function}

    // @private {function} For PhET-iO brand only: make sure this Node is initialized when state is being set for PhET-iO
    this.initializationVerifier = null;
    if ( Tandem.PHET_IO_ENABLED && phet.phetio.phetioEngine.phetioStateEngine ) {
      this.initializationVerifier = () => {
        if ( !this.isInitialized ) {
          this.initialize();
        }
      };
      Tandem.PHET_IO_ENABLED && phet.phetio.phetioEngine.phetioStateEngine.stateSetEmitter.addListener( this.initializationVerifier );
    }

    // @private
    this.disposeRewardNode = () => {
      options.stepEmitter && options.stepEmitter.removeListener( this.stepEmitterListener );
      this.screenView && this.screenView.transformEmitter.removeListener( this.updateBounds );
      this.initializationVerifier && phet.phetio.phetioEngine.phetioStateEngine.stateSetEmitter.removeListener( this.initializationVerifier );
    };
  }

  /**
   * @public
   * @override
   */
  dispose() {
    this.disposeRewardNode();
    super.dispose();
  }

  /**
   * Convenience factory method to create an array of the specified nodes in an even distribution.
   * @param {Node[]} nodes array of nodes to use
   * @param {number} count
   * @returns {Node[]}
   * @public
   */
  static createRandomNodes( nodes, count ) {
    const array = [];
    for ( let i = 0; i < count; i++ ) {
      array.push( nodes[ i % nodes.length ] );
    }
    return array;
  }

  /**
   * Paint the rewards on the canvas
   * @param {CanvasRenderingContext2D} context
   * @protected
   */
  paintCanvas( context ) {

    // If the debugging flag is on, show the bounds of the canvas
    if ( DEBUG ) {
      const bounds = this.canvasDisplayBounds;

      // Fill the canvas with gray
      context.fillStyle = 'rgba(50,50,50,0.5)';
      context.fillRect( bounds.minX, bounds.minY, bounds.width, bounds.height );

      // Stroke the canvas border with blue
      context.strokeStyle = '#0000ff';
      context.lineWidth = 5;
      context.strokeRect( bounds.minX, bounds.minY, bounds.width, bounds.height );
    }
    context.scale( 1 / this.options.scaleForResolution, 1 / this.options.scaleForResolution );

    // Display the rewards, but check that they exist first.  They do not exist when attached to the timer with stepEmitter
    if ( this.rewards ) {
      for ( let i = 0; i < this.rewards.length; i++ ) {
        const reward = this.rewards[ i ];
        if ( reward.imageWrapper.image ) {
          context.drawImage( reward.imageWrapper.image, reward.x, reward.y );
        }
      }
    }
  }

  /**
   * Find the root of the scenegraph.
   * @returns {Node}
   * @private
   */
  getScene() {
    return this.getUniqueTrail().nodes[ 0 ];
  }

  /**
   * Finds the first parent that is a ScreenView so we can listen for its transform, see https://github.com/phetsims/vegas/issues/4
   * @returns {Node}
   * @private
   */
  getScreenView() {
    return this.getUniqueTrail( node => node instanceof ScreenView ).rootNode();
  }

  /**
   * Only init after being attached to the scene graph, since we must ascertain the local bounds are such that they take
   * up the global screen.
   * 1. listen to the size of the scene/display
   * 2. record the trail between the scene and your CanvasNode, and
   * 3. apply the inverse of that transform to the CanvasNode (whenever an ancestor's transform changes, or when the scene/display size changes).
   *
   * @jonathanolson said: for implementing now, I'd watch the iso transform, compute the inverse, and set bounds on
   * changes to be precise (since you need them anyways to draw).
   * @private
   */
  initialize() {
    assert && assert( !this.isInitialized, 'already initialized' );

    this.scene = this.getScene();
    this.screenView = this.getScreenView();

    // Listen to the bounds of the scene, so the canvas can be resized if the window is reshaped
    this.updateBounds = () => {

      const local = this.globalToLocalBounds( phet.joist.sim.display.bounds );
      this.setCanvasBounds( local );

      // Also, store the bounds in the options so the debug flag can render the bounds
      this.canvasDisplayBounds = local;
    };

    // When the ScreenView transform changes, update the bounds.  This prevents a "behind by one" problem, see https://github.com/phetsims/vegas/issues/4
    this.screenView.transformEmitter.addListener( this.updateBounds );

    // Set the initial bounds
    this.updateBounds();

    /*
     * Store each reward, which has an imageWrapper (see above), x, y, speed. It is not an image, it is not a node,
     * but it is one of the things that animates as falling in the RewardNode and its associated data.
     * @private
     */
    // TODO should we create a separate class for this?  See https://github.com/phetsims/vegas/issues/79.
    this.rewards = this.options.nodes.map( node => {

      //find the image wrapper corresponding to the node
      const imageWrapper = _.find( this.imageWrappers, imageWrapper => imageWrapper.node === node );
      return {
        imageWrapper: imageWrapper,
        x: this.sampleImageXValue( imageWrapper ),
        y: this.sampleImageYValue( imageWrapper ),
        speed: ( phet.joist.random.nextDouble() + 1 ) * MAX_SPEED
      };
    } );

    this.isInitialized = true;
  }

  /**
   * Selects a random X value for the image when it is created.
   * @param {Node} imageWrapper
   * @returns {number}
   * @private
   */
  sampleImageXValue( imageWrapper ) {
    return ( phet.joist.random.nextDouble() * this.canvasDisplayBounds.width + this.canvasDisplayBounds.left ) *
           this.options.scaleForResolution - imageWrapper.width / 2;
  }

  /**
   * Selects a random Y value for the image when it is created, or when it goes back to the top of the screen
   * @param {Node} imageWrapper
   * @returns {number}
   * @public
   */
  sampleImageYValue( imageWrapper ) {
    // Start things about 1 second off the top of the screen
    return this.canvasDisplayBounds.top - phet.joist.random.nextDouble() * this.canvasDisplayBounds.height * 2 -
           MAX_SPEED - imageWrapper.height;
  }

  /**
   * Moves the rewards down according to their speed.
   * @param {number} dt
   * @public
   */
  step( dt ) {
    if ( !this.isInitialized && this.getScene() !== null ) {
      this.initialize();
    }

    // Update all of the rewards
    const maxY = this.canvasDisplayBounds.height * this.options.scaleForResolution;
    for ( let i = 0; i < this.rewards.length; i++ ) {
      const reward = this.rewards[ i ];

      // Move each node straight down at constant speed
      reward.y += reward.speed * dt;

      // Move back to the top after the node falls off the bottom
      if ( reward.y > maxY ) {
        reward.x = this.sampleImageXValue( reward.imageWrapper );
        reward.y = this.sampleImageYValue( reward.imageWrapper );
      }
    }
    this.invalidatePaint();
  }
}

vegas.register( 'RewardNode', RewardNode );
export default RewardNode;