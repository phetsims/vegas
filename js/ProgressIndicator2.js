//  Copyright 2002-2014, University of Colorado Boulder

/**
 * Indicates a user's progress on a level by illuminating stars.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var HalfStar = require( 'VEGAS/HalfStar' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var StarNode = require( 'SCENERY_PHET/StarNode' );
  var HBox = require( 'SCENERY/nodes/HBox' );

  /**
   * @param {number} numStars
   * @param {number} starDiameter
   * @param {Property<Number>} scoreProperty
   * @param {number} perfectScore
   * @constructor
   */
  function ProgressIndicator2( numStars, starDiameter, scoreProperty, perfectScore, options ) {

    options = _.extend( {
      filledStarColor: 'yellow',
      filledStarStroke: 'black',
      unfilledStarColor: 'rgb( 220, 220, 220 )',
      unfilledStarStroke: 'rgb( 190, 190, 190 )',
      distanceBetweenStars: starDiameter * 0.15
    }, options );

    HBox.call( this, {spacing: 3, children: []} );
    var progressIndicator2 = this;

    // Update visibility of filled and half-filled stars based on score.
    // TODO: Could be rewritten to use deltas if it needs to animate
    scoreProperty.link( function( score ) {
      var children = [];

      var proportion = score / perfectScore;
      var numFilledStars = Math.floor( proportion * numStars );

      for ( var i = 0; i < numFilledStars; i++ ) {
        children.push( new StarNode( {value: 1} ) );
      }
      var remainder = proportion * numStars - numFilledStars;
      if ( remainder > 1E-6 ) {
        children.push( new StarNode( {value: remainder} ) );
      }
      var numEmptyStars = numStars - children.length;
      for ( i = 0; i < numEmptyStars; i++ ) {
        children.push( new StarNode( {value: 0} ) );
      }

      progressIndicator2.children = children;
    } );

    this.mutate( options );
  }

  return inherit( HBox, ProgressIndicator2 );
} );