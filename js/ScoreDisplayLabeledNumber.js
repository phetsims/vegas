// Copyright 2018-2021, University of Colorado Boulder

/**
 * Display a score as 'Score: N', where N is a number.
 * See specification in https://github.com/phetsims/vegas/issues/59.
 *
 * @author Andrea Lin
 */

import Utils from '../../dot/js/Utils.js';
import merge from '../../phet-core/js/merge.js';
import StringUtils from '../../phetcommon/js/util/StringUtils.js';
import { Node } from '../../scenery/js/imports.js';
import { Text } from '../../scenery/js/imports.js';
import StatusBar from './StatusBar.js';
import vegas from './vegas.js';
import vegasStrings from './vegasStrings.js';

class ScoreDisplayLabeledNumber extends Node {

  /**
   * @param {Property.<number>} scoreProperty
   * @param {Object} [options]
   */
  constructor( scoreProperty, options ) {

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
      scoreDisplayText.text = StringUtils.fillIn( vegasStrings.pattern.score.number, {
        score: Utils.toFixed( score, options.scoreDecimalPlaces )
      } );
    };
    scoreProperty.link( scorePropertyListener );

    super( options );

    // @private
    this.disposeScoreDisplayLabeledNumber = function() {
      scoreProperty.unlink( scorePropertyListener );
    };
  }

  /**
   * @public
   * @override
   */
  dispose() {
    this.disposeScoreDisplayLabeledNumber();
    super.dispose();
  }
}

vegas.register( 'ScoreDisplayLabeledNumber', ScoreDisplayLabeledNumber );
export default ScoreDisplayLabeledNumber;