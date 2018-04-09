// Copyright 2018, University of Colorado Boulder

/**
 * Indicates score followed by a single star.
 * See specification in https://github.com/phetsims/vegas/issues/59.
 *
 * @author Andrea Lin
 */
define( function( require ) {
  'use strict';

  // modules
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var StarNode = require( 'SCENERY_PHET/StarNode' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );
  var vegas = require( 'VEGAS/vegas' );

  // constants
  var DEFAULT_FONT = new PhetFont( { size: 18, weight: 'bold' } );

  /**
   * @param {Property.<number>} scoreProperty
   * @param {Object} [options]
   * @constructor
   */
  function ScoreDisplayNumberAndStar( scoreProperty, options ) {

    var self = this;

    options = _.extend( {
      starNodeOptions: null, // options to StarNode
      font: DEFAULT_FONT,
      textFill: 'black',
      scoreDecimalPlaces: 0,
      spacing: 3
    }, options );

    // fill in defaults for starNodeOptions
    options.starNodeOptions = _.extend( {
      outerRadius: 10,
      innerRadius: 5,
      filledLineWidth: 1.5,
      emptyLineWidth: 1.5
    }, options.starNodeOptions );

    assert && assert( !options.children, 'ScoreDisplayNumber sets children' );

    HBox.call( this );

    // Update number displayed based on score.
    var scorePropertyListener = function( score ) {
      var children = [];

      if ( score === 0 ) {
        children.push( new StarNode( _.extend( { value: 0 }, options.starNodeOptions ) ) );
      }
      else {
        children.push( new Text( Util.toFixed( score, options.scoreDecimalPlaces ), {
          font: options.font,
          fill: options.textFill
        } ) );
        children.push( new StarNode( _.extend( { value: 1 }, options.starNodeOptions ) ) );
      }

      self.children = children;
    };
    scoreProperty.link( scorePropertyListener );

    // @private
    this.disposeScoreDisplayNumberAndStar = function() {
      scoreProperty.unlink( scorePropertyListener );
    };

    this.mutate( options );
  }

  vegas.register( 'ScoreDisplayNumberAndStar', ScoreDisplayNumberAndStar );

  return inherit( HBox, ScoreDisplayNumberAndStar, {

    // @public 
    dispose: function() {
      this.disposeScoreDisplayNumberAndStar();
      HBox.prototype.dispose.call( this );
    }
  } );
} );