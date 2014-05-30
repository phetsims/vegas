//  Copyright 2002-2014, University of Colorado Boulder

/**
 * Reward node that shows many nodes animating, for fun!  Shown when a perfect score is achieved in a game.
 *
 * Notes:
 * 1. Instead of continuous animation, the animation is shown as a transient behavior that shows for a few seconds and then disappears.
 *    This is to encourage the student to move to the next challenge, instead of becoming mesmerized by a perpetual animation.
 * 2. We could make the performance optimization to only animate objects that are currently onscreen, but that would lead to slowing down and speeding up behavior
 * 3. I would like to add optional support for rotation
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var StarNode = require( 'SCENERY_PHET/StarNode' );
  var FaceNode = require( 'SCENERY_PHET/FaceNode' );
  var Image = require( 'SCENERY/nodes/Image' );

  var starNode = new Node();
  var faceNode = new Node();

  new StarNode().toImage( function( image ) {
    starNode.children = [new Image( image )];
  } );

  //Create a smiling face.
  new FaceNode( 40, {headStroke: 'black', headLineWidth: 1.5} ).toImage( function( image ) {
    faceNode.children = [new Image( image )];
  } );

  function RewardNode( options ) {
    options = _.extend( {

      layoutBounds: ScreenView.DEFAULT_LAYOUT_BOUNDS,

      //Default nodes are many stars and smiling faces
      nodes: _.shuffle( _.times( 100, function() {
          return new Node( {children: [starNode]} );
        } ).concat( _.times( 100, function() {
          return new Node( {children: [faceNode]} );
        } ) )
      )
    }, options );


    var children = options.nodes;
    var layoutBounds = options.layoutBounds;

    this.speeds = [];

    //randomly scatter children above the top of the screen
    for ( var i = 0; i < children.length; i++ ) {
      var child = children[i];
      child.bottom = layoutBounds.top - Math.random() * layoutBounds.height;
      child.centerX = Math.random() * layoutBounds.width + layoutBounds.left;

      this.speeds.push( Math.random() + 1 );
    }

    Node.call( this, {children: children} );

    this.mutate( options );
  }

  return inherit( Node, RewardNode, {
    step: function( elapsed ) {
      var children = this.children;
      var numChildren = children.length;
      for ( var i = 0; i < numChildren; i++ ) {
        var child = children[i];
        child.translate( 0, 1 * elapsed * 60 * this.speeds[i] );
      }
    }
  } );
} );