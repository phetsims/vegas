// Copyright 2018-2020, University of Colorado Boulder

/**
 * Display a score as 'Score: * * * *', where '*' are stars, which may be fully or partially filled in.
 * See specification in https://github.com/phetsims/vegas/issues/59.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import inherit from '../../phet-core/js/inherit.js';
import merge from '../../phet-core/js/merge.js';
import HBox from '../../scenery/js/nodes/HBox.js';
import Text from '../../scenery/js/nodes/Text.js';
import ScoreDisplayStars from './ScoreDisplayStars.js';
import StatusBar from './StatusBar.js';
import vegasStrings from './vegas-strings.js';
import vegas from './vegas.js';

const scoreString = vegasStrings.score;

/**
 * @param {Property.<number>} scoreProperty
 * @param {Object} [options]
 * @constructor
 */
function ScoreDisplayLabeledStars( scoreProperty, options ) {

  options = merge( {
    font: StatusBar.DEFAULT_FONT,
    textFill: 'black',
    spacing: 5
  }, options );

  const textNode = new Text( scoreString, {
    font: options.font,
    fill: options.textFill
  } );

  const scoreDisplay = new ScoreDisplayStars( scoreProperty, options );

  assert && assert( !options.children, 'ScoreDisplayLabeledStars sets children' );
  options.children = [ textNode, scoreDisplay ];

  HBox.call( this, options );

  // @private
  this.disposeScoreDisplayLabeledStars = function() {
    scoreDisplay.dispose();
  };
}

vegas.register( 'ScoreDisplayLabeledStars', ScoreDisplayLabeledStars );

export default inherit( HBox, ScoreDisplayLabeledStars, {

  /**
   * @public
   * @override
   */
  dispose: function() {
    this.disposeScoreDisplayLabeledStars();
    HBox.prototype.dispose.call( this );
  }
} );