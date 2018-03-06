// Copyright 2013-2017, University of Colorado Boulder

/**
 * Indicates a user's progress on a level by a number followed by a single star.
 *
 * @author Andrea Lin
 */
define( function( require ) {
  'use strict';

  // modules
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );
  var vegas = require( 'VEGAS/vegas' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );

  // constants
  var LABEL_FONT = new PhetFont( { size: 18, weight: 'bold' } );
  var patternScoreNumberString = require( 'string!VEGAS/pattern.score.number' );

  /**
   * @param {Property.<number>} scoreProperty
   * @param {Object} [options]
   * @constructor
   */
  function ScoreDisplayTextAndNumber( scoreProperty, options ) {

    options = _.extend( {
      textFont: LABEL_FONT,
      textFill: 'black',
      scoreDecimalPlaces: 2
    }, options );

    HBox.call( this, { spacing: 3, children: [] } );

    var scoreDisplayText = new Text( '', { font: options.textFont, fill: options.textFill } );

    this.children = [ scoreDisplayText ];

    // Update number displayed based on score.
    scoreProperty.link( function( score ) {

      scoreDisplayText.setText( StringUtils.fillIn( patternScoreNumberString, {
        score: Util.toFixed( score, options.scoreDecimalPlaces )
      } ) );

    } );

    this.mutate( options );
  }

  vegas.register( 'ScoreDisplayTextAndNumber', ScoreDisplayTextAndNumber );

  return inherit( HBox, ScoreDisplayTextAndNumber );
} );