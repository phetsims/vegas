// Copyright 2018, University of Colorado Boulder

/**
 * Indicates score followed by a single star.
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
  var DEFAULT_TEXT_FONT = new PhetFont( { size: 18, weight: 'bold' } );

  /**
   * @param {Property.<number>} scoreProperty
   * @param {Object} [options]
   * @constructor
   */
  function ScoreDisplayNumberAndStar( scoreProperty, options ) {

    options = _.extend( {
      starOuterRadius: 10,
      starInnerRadius: 5,
      starFilledLineWidth: 1.5,
      starEmptyLineWidth: 1.5,
      textFont: DEFAULT_TEXT_FONT,
      textFill: 'black',
      scoreDecimalPlaces: 0
    }, options );

    HBox.call( this, { spacing: 3, children: [] } );
    var self = this;


    // Update number displayed based on score.
    scoreProperty.link( function( score ) {
      var children = [];

      var starOptions = {
        outerRadius: options.starOuterRadius,
        innerRadius: options.starInnerRadius,
        filledLineWidth: options.starFilledLineWidth,
        emptyLineWidth: options.starEmptyLineWidth
      };

      if ( score === 0 ) {
        children.push( new StarNode( _.extend( { value: 0 }, starOptions ) ) );
      }
      else {
        children.push( new Text( Util.toFixed( score, options.scoreDecimalPlaces ), { font: options.textFont, fill: options.textFill } ) );
        children.push( new StarNode( _.extend ( { value: 1 }, starOptions ) ) );
      }

      self.children = children;
    } );

    this.mutate( options );
  }

  vegas.register( 'ScoreDisplayNumberAndStar', ScoreDisplayNumberAndStar );

  return inherit( HBox, ScoreDisplayNumberAndStar );
} );