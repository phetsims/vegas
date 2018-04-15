// Copyright 2018, University of Colorado Boulder

/**
 * Display a score as 'Score: N', where N is a number.
 * See specification in https://github.com/phetsims/vegas/issues/59.
 *
 * @author Andrea Lin
 */
define( function( require ) {
  'use strict';

  // modules
  var Node = require( 'SCENERY/nodes/Node' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );
  var vegas = require( 'VEGAS/vegas' );
  var StatusBar = require( 'VEGAS/StatusBar' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );

  // strings
  var patternScoreNumberString = require( 'string!VEGAS/pattern.score.number' );

  /**
   * @param {Property.<number>} scoreProperty
   * @param {Object} [options]
   * @constructor
   */
  function ScoreDisplayLabeledNumber( scoreProperty, options ) {

    options = _.extend( {
      font: StatusBar.DEFAULT_FONT,
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
    this.disposeScoreDisplayLabeledNumber = function() {
      scoreProperty.unlink( scorePropertyListener );
    };

    Node.call( this, options );
  }

  vegas.register( 'ScoreDisplayLabeledNumber', ScoreDisplayLabeledNumber );

  return inherit( Node, ScoreDisplayLabeledNumber, {

    // @public 
    dispose: function() {
      this.disposeScoreDisplayLabeledNumber();
      Node.prototype.dispose.call( this );
    }
  } );
} );