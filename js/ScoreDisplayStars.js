// Copyright 2013-2018, University of Colorado Boulder

/**
 * Display a score as '* * * *', where '*' are stars, which may be fully or partially filled in.
 * See specification in https://github.com/phetsims/vegas/issues/59.
 *
 * @author John Blanco
 * @author Sam Reid
 * @author Andrea Lin
 */
define( require => {
  'use strict';

  // modules
  const HBox = require( 'SCENERY/nodes/HBox' );
  const inherit = require( 'PHET_CORE/inherit' );
  const StarNode = require( 'SCENERY_PHET/StarNode' );
  const vegas = require( 'VEGAS/vegas' );

  /**
   * @param {Property.<number>} scoreProperty
   * @param {Object} [options]
   * @constructor
   */
  function ScoreDisplayStars( scoreProperty, options ) {

    var self = this;

    options = _.extend( {
      starNodeOptions: null, // options to StarNode
      numberOfStars: 1,
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

    var numberOfStars = options.numberOfStars;
    var perfectScore = options.perfectScore;

    assert && assert( !options.children, 'ScoreDisplayStars sets children' );
    HBox.call( this, { children: [] } );

    // Update visibility of filled and half-filled stars based on score.
    var scorePropertyListener = function( score ) {

      assert && assert( score <= perfectScore, 'Score ' + score + ' exceeds perfect score ' + perfectScore );

      var children = [];

      var proportion = score / perfectScore;
      var numFilledStars = Math.floor( proportion * numberOfStars );

      for ( var i = 0; i < numFilledStars; i++ ) {
        children.push( new StarNode( _.extend( { value: 1 }, options.starNodeOptions ) ) );
      }

      var remainder = proportion * numberOfStars - numFilledStars;
      if ( remainder > 1E-6 ) {
        children.push( new StarNode( _.extend( { value: remainder }, options.starNodeOptions ) ) );
      }

      var numEmptyStars = numberOfStars - children.length;
      for ( i = 0; i < numEmptyStars; i++ ) {
        children.push( new StarNode( _.extend( { value: 0 }, options.starNodeOptions ) ) );
      }

      self.children = children;
    };
    scoreProperty.link( scorePropertyListener );

    // @private
    this.disposeScoreDisplayStars = function() {
      scoreProperty.unlink( scorePropertyListener );
    };

    this.mutate( options );
  }

  vegas.register( 'ScoreDisplayStars', ScoreDisplayStars );

  return inherit( HBox, ScoreDisplayStars, {

    // @public 
    dispose: function() {
      this.disposeScoreDisplayStars();
      HBox.prototype.dispose.call( this );
    }
  } );
} );