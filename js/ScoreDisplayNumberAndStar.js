// Copyright 2018-2019, University of Colorado Boulder

/**
 * Display a score as 'N *', where N is a number and '*' is a star.
 * If N is 0, it is hidden and the star is grayed out.
 * See specification in https://github.com/phetsims/vegas/issues/59.
 *
 * @author Andrea Lin
 */

import Utils from '../../dot/js/Utils.js';
import inherit from '../../phet-core/js/inherit.js';
import merge from '../../phet-core/js/merge.js';
import StarNode from '../../scenery-phet/js/StarNode.js';
import HBox from '../../scenery/js/nodes/HBox.js';
import Text from '../../scenery/js/nodes/Text.js';
import StatusBar from './StatusBar.js';
import vegas from './vegas.js';

/**
 * @param {Property.<number>} scoreProperty
 * @param {Object} [options]
 * @constructor
 */
function ScoreDisplayNumberAndStar( scoreProperty, options ) {

  const self = this;

  options = merge( {
    starNodeOptions: null, // options to StarNode
    font: StatusBar.DEFAULT_FONT,
    textFill: 'black',
    scoreDecimalPlaces: 0,
    spacing: 5
  }, options );

  // fill in defaults for starNodeOptions
  options.starNodeOptions = merge( {
    outerRadius: 10,
    innerRadius: 5,
    filledLineWidth: 1.5,
    emptyLineWidth: 1.5
  }, options.starNodeOptions );

  assert && assert( !options.children, 'ScoreDisplayNumber sets children' );

  HBox.call( this );

  // Update number displayed based on score.
  const scorePropertyListener = function( score ) {
    const children = [];

    if ( score === 0 ) {
      children.push( new StarNode( merge( { value: 0 }, options.starNodeOptions ) ) );
    }
    else {
      children.push( new Text( Utils.toFixed( score, options.scoreDecimalPlaces ), {
        font: options.font,
        fill: options.textFill
      } ) );
      children.push( new StarNode( merge( { value: 1 }, options.starNodeOptions ) ) );
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

export default inherit( HBox, ScoreDisplayNumberAndStar, {

  // @public 
  dispose: function() {
    this.disposeScoreDisplayNumberAndStar();
    HBox.prototype.dispose.call( this );
  }
} );