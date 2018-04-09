// Copyright 2018, University of Colorado Boulder

/**
 * Indicates score in the format of "Score: " followed by the number.
 * See specification in https://github.com/phetsims/vegas/issues/59.
 *
 * @author Andrea Lin
 */
define( function( require ) {
  'use strict';

  // modules
  var Node = require( 'SCENERY/nodes/Node' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );
  var vegas = require( 'VEGAS/vegas' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );

  // constants
  var DEFAULT_FONT = new PhetFont( { size: 18, weight: 'bold' } );
  var patternScoreNumberString = require( 'string!VEGAS/pattern.score.number' );

  /**
   * @param {Property.<number>} scoreProperty
   * @param {Object} [options]
   * @constructor
   */
  function ScoreDisplayTextAndNumber( scoreProperty, options ) {

    options = _.extend( {
      font: DEFAULT_FONT,
      fill: 'black',
      scoreDecimalPlaces: 0
    }, options );

    var scoreDisplayText = new Text( '', {
      font: options.font,
      fill: options.fill
    } );

    assert && assert( !options.children, 'ScoreDisplayNumber sets children' );
    options.children = [ scoreDisplayText ];

    // Update number displayed based on score.
    var scorePropertyListener = function( score ) {
      scoreDisplayText.text = StringUtils.fillIn( patternScoreNumberString, {
        score: Util.toFixed( score, options.scoreDecimalPlaces )
      } );
    };
    scoreProperty.link( scorePropertyListener );

    // @private
    this.disposeScoreDisplayTextAndNumber = function() {
      scoreProperty.unlink( scorePropertyListener );
    };

    Node.call( this, options );
  }

  vegas.register( 'ScoreDisplayTextAndNumber', ScoreDisplayTextAndNumber );

  return inherit( Node, ScoreDisplayTextAndNumber, {

    // @public 
    dispose: function() {
      this.disposeScoreDisplayTextAndNumber();
      Node.prototype.dispose.call( this );
    }
  } );
} );