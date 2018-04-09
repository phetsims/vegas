// Copyright 2013-2017, University of Colorado Boulder

/**
 * Indicates score by illuminating stars.
 * See specification in https://github.com/phetsims/vegas/issues/59.
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

    var self = this;

    options = _.extend( {
      starNodeOptions: null, // options to StarNode
      numStars: 1,
      perfectScore: 1,
      spacing: 3
    }, options );

    // fill in defaults for starNodeOptions
    options.starNodeOptions = _.extend( {
      outerRadius: 10,
      innerRadius: 5,
      filledLineWidth: 1.5,
      emptyLineWidth: 1.5
    }, options.starNodeOptions );

    var numStars = options.numStars;
    var perfectScore = options.perfectScore;

    assert && assert( !options.children, 'ScoreDisplayDiscreteStars sets children' );
    HBox.call( this, { children: [] } );

    // Update visibility of filled and half-filled stars based on score.
    var scorePropertyListener = function( score ) {

      assert && assert( score <= perfectScore, 'Score ' + score + ' exceeds perfect score ' + perfectScore );

      var children = [];

      var proportion = score / perfectScore;
      var numFilledStars = Math.floor( proportion * numStars );

      for ( var i = 0; i < numFilledStars; i++ ) {
        children.push( new StarNode( _.extend( { value: 1 }, options.starNodeOptions ) ) );
      }

      var remainder = proportion * numStars - numFilledStars;
      if ( remainder > 1E-6 ) {
        children.push( new StarNode( _.extend( { value: remainder }, options.starNodeOptions ) ) );
      }

      var numEmptyStars = numStars - children.length;
      for ( i = 0; i < numEmptyStars; i++ ) {
        children.push( new StarNode( _.extend( { value: 0 }, options.starNodeOptions ) ) );
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