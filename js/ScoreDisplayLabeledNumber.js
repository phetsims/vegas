// Copyright 2018-2020, University of Colorado Boulder

/**
 * Display a score as 'Score: N', where N is a number.
 * See specification in https://github.com/phetsims/vegas/issues/59.
 *
 * @author Andrea Lin
 */

import Utils from '../../dot/js/Utils.js';
import inherit from '../../phet-core/js/inherit.js';
import merge from '../../phet-core/js/merge.js';
import StringUtils from '../../phetcommon/js/util/StringUtils.js';
import Node from '../../scenery/js/nodes/Node.js';
import Text from '../../scenery/js/nodes/Text.js';
import StatusBar from './StatusBar.js';
import vegasStrings from './vegasStrings.js';
import vegas from './vegas.js';

const patternScoreNumberString = vegasStrings.pattern.score.number;

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
      score: Utils.toFixed( score, options.scoreDecimalPlaces )
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

inherit( Node, ScoreDisplayLabeledNumber, {

  // @public
  dispose: function() {
    this.disposeScoreDisplayLabeledNumber();
    Node.prototype.dispose.call( this );
  }
} );

export default ScoreDisplayLabeledNumber;