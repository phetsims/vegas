// Copyright 2018-2019, University of Colorado Boulder

/**
 * Display a score as 'Score: N', where N is a number.
 * See specification in https://github.com/phetsims/vegas/issues/59.
 *
 * @author Andrea Lin
 */
define( require => {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const merge = require( 'PHET_CORE/merge' );
  const Node = require( 'SCENERY/nodes/Node' );
  const StatusBar = require( 'VEGAS/StatusBar' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Util = require( 'DOT/Util' );
  const vegas = require( 'VEGAS/vegas' );

  // strings
  const patternScoreNumberString = require( 'string!VEGAS/pattern.score.number' );

  /**
   * @param {Property.<number>} scoreProperty
   * @param {Object} [options]
   * @constructor
   */
  function ScoreDisplayLabeledNumber( scoreProperty, options ) {

    options = merge( {
      font: StatusBar.DEFAULT_FONT,
      textFill: 'black',
      scoreDecimalPlaces: 0
    }, options );

    const scoreDisplayText = new Text( '', {
      font: options.font,
      fill: options.textFill
    } );

    assert && assert( !options.children, 'ScoreDisplayNumber sets children' );
    options.children = [ scoreDisplayText ];

    // Update number displayed based on score.
    const scorePropertyListener = function( score ) {
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