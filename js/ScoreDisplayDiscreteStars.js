// Copyright 2013-2017, University of Colorado Boulder

/**
 * Indicates score by illuminating stars.
 *
 * @author John Blanco
 * @author Sam Reid
 * @author Andrea Lin
 */
define( function( require ) {
  'use strict';

  // modules
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var StarNode = require( 'SCENERY_PHET/StarNode' );
  var vegas = require( 'VEGAS/vegas' );

  /**
   * @param {Property.<number>} scoreProperty
   * @param {Object} [options]
   * @constructor
   */
  function ScoreDisplayDiscreteStars( scoreProperty, options ) {

    options = _.extend( {
      starOuterRadius: 10,
      starInnerRadius: 5,
      starFilledLineWidth: 1.5,
      starEmptyLineWidth: 1.5,
      numStars: 1,
      perfectScore: 1
    }, options );
    
    assert && assert( !options.children, 'ScoreDisplayNumber sets children' );

    var numStars = options.numStars;
    var perfectScore = options.perfectScore;

    HBox.call( this, { spacing: 3, children: [] } );
    var self = this;

    var starOptions = {
      outerRadius: options.starOuterRadius,
      innerRadius: options.starInnerRadius,
      filledLineWidth: options.starFilledLineWidth,
      emptyLineWidth: options.starEmptyLineWidth
    };

    // Update visibility of filled and half-filled stars based on score.
    // TODO: Could be rewritten to use deltas if it needs to animate
    
    var scorePropertyListener = function( score ) {

      assert && assert( score <= perfectScore );

      var children = [];

      var proportion = score / perfectScore;
      var numFilledStars = Math.floor( proportion * numStars );

      for ( var i = 0; i < numFilledStars; i++ ) {
        children.push( new StarNode( _.extend( { value: 1 }, starOptions ) ) );
      }
      var remainder = proportion * numStars - numFilledStars;
      if ( remainder > 1E-6 ) {
        children.push( new StarNode( _.extend( { value: remainder }, starOptions ) ) );
      }
      var numEmptyStars = numStars - children.length;
      for ( i = 0; i < numEmptyStars; i++ ) {
        children.push( new StarNode( _.extend( { value: 0 }, starOptions ) ) );
      }

      self.children = children;
    };

    scoreProperty.link( scorePropertyListener );

    // @private
    this.disposeScoreDisplayDiscreteStars = function() {
      scoreProperty.unlink( scorePropertyListener );
    };

    this.mutate( options );
  }

  vegas.register( 'ScoreDisplayDiscreteStars', ScoreDisplayDiscreteStars );

  return inherit( HBox, ScoreDisplayDiscreteStars, {

    // @public 
    dispose: function() {
      this.disposeScoreDisplayDiscreteStars();
      HBox.prototype.dispose.call( this );
    }
  } );
} );