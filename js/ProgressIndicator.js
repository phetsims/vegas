// Copyright 2002-2013, University of Colorado Boulder

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
  var Star = require( 'VEGAS/Star' );

  /**
   * @param {number} numStars
   * @param {number} starDiameter
   * @param {Property<Number>} scoreProperty
   * @param {number} perfectScore
   * @constructor
   */
  function ProgressIndicator( numStars, starDiameter, scoreProperty, perfectScore, options ) {

    options = _.extend( {
      filledStarColor: 'yellow',
      filledStarStroke: 'black',
      unfilledStarColor: 'rgb( 220, 220, 220 )',
      unfilledStarStroke: 'rgb( 190, 190, 190 )',
      distanceBetweenStars: starDiameter * 0.15
    }, options );

    Node.call( this );

    // Add stars.
    var starLeft = 0; // left edge of the star we're adding
    var filledStars = [];
    var filledHalfStars = [];
    for ( var i = 0; i < numStars; i++ ) {

      // Unfilled stars will always be visible. Add them first, so they are behind filled stars.
      this.addChild( new Star( starDiameter,
        {
          fill: options.unfilledStarColor,
          stroke: options.unfilledStarStroke,
          lineWidth: 1,
          left: starLeft,
          lineCap: 'round'
        } ) );

      filledStars.push( new Star( starDiameter,
        {
          fill: options.filledStarColor,
          stroke: options.filledStarStroke,
          lineWidth: 1,
          left: starLeft,
          lineCap: 'round'
        } ) );
      this.addChild( filledStars[i] );

      filledHalfStars.push( new HalfStar( starDiameter,
        {
          fill: options.filledStarColor,
          stroke: options.filledStarStroke,
          lineWidth: 1,
          left: starLeft,
          lineCap: 'round'
        } ) );
      this.addChild( filledHalfStars[i] );

      starLeft += options.distanceBetweenStars + starDiameter;
    }

    // Update visibility of filled and half-filled stars based on score.
    scoreProperty.link( function( score ) {
      var proportion = score / perfectScore;
      var numFilledStars = Math.floor( proportion * numStars );
      for ( var i = 0; i < numStars; i++ ) {
        filledStars[i].visible = i < numFilledStars;
      }
      filledHalfStars.forEach( function( halfStar ) {
        halfStar.visible = false;
      } );
      if ( proportion * numStars - numFilledStars > 0.49 ) {
        filledHalfStars[numFilledStars ].visible = true;
      }
    } );

    this.mutate( options );
  }

  return inherit( Node, ProgressIndicator );
} );