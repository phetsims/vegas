// Copyright 2018-2022, University of Colorado Boulder

// @ts-nocheck
/**
 * Display a score as 'Score: * * * *', where '*' are stars, which may be fully or partially filled in.
 * See specification in https://github.com/phetsims/vegas/issues/59.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../phet-core/js/merge.js';
import { HBox } from '../../scenery/js/imports.js';
import { Text } from '../../scenery/js/imports.js';
import ScoreDisplayStars from './ScoreDisplayStars.js';
import StatusBar from '../../scenery-phet/js/StatusBar.js';
import vegas from './vegas.js';
import vegasStrings from './vegasStrings.js';

class ScoreDisplayLabeledStars extends HBox {

  /**
   * @param {Property.<number>} scoreProperty
   * @param {Object} [options]
   */
  constructor( scoreProperty, options ) {

    options = merge( {
      font: StatusBar.DEFAULT_FONT,
      textFill: 'black',
      spacing: 5
    }, options );

    const textNode = new Text( vegasStrings.score, {
      font: options.font,
      fill: options.textFill
    } );

    const scoreDisplay = new ScoreDisplayStars( scoreProperty, options );

    assert && assert( !options.children, 'ScoreDisplayLabeledStars sets children' );
    options.children = [ textNode, scoreDisplay ];

    super( options );

    // @private
    this.disposeScoreDisplayLabeledStars = function() {
      scoreDisplay.dispose();
    };
  }

  /**
   * @public
   * @override
   */
  dispose() {
    this.disposeScoreDisplayLabeledStars();
    super.dispose();
  }
}

vegas.register( 'ScoreDisplayLabeledStars', ScoreDisplayLabeledStars );
export default ScoreDisplayLabeledStars;