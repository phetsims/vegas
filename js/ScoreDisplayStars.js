// Copyright 2013-2021, University of Colorado Boulder

/**
 * Display a score as '* * * *', where '*' are stars, which may be fully or partially filled in.
 * See specification in https://github.com/phetsims/vegas/issues/59.
 *
 * @author John Blanco
 * @author Sam Reid
 * @author Andrea Lin
 */

import merge from '../../phet-core/js/merge.js';
import StarNode from '../../scenery-phet/js/StarNode.js';
import HBox from '../../scenery/js/nodes/HBox.js';
import vegas from './vegas.js';

class ScoreDisplayStars extends HBox {

  /**
   * @param {Property.<number>} scoreProperty
   * @param {Object} [options]
   */
  constructor( scoreProperty, options ) {

    options = merge( {
      starNodeOptions: null, // options to StarNode
      numberOfStars: 1,
      perfectScore: 1,
      spacing: 3
    }, options );

    // fill in defaults for starNodeOptions
    options.starNodeOptions = merge( {
      outerRadius: 10,
      innerRadius: 5,
      filledLineWidth: 1.5,
      emptyLineWidth: 1.5
    }, options.starNodeOptions );

    const numberOfStars = options.numberOfStars;
    const perfectScore = options.perfectScore;

    super( options );

    // Update visibility of filled and half-filled stars based on score.
    assert && assert( !options.children, 'ScoreDisplayStars sets children' );
    const scorePropertyListener = score => {

      assert && assert( score <= perfectScore, `Score ${score} exceeds perfect score ${perfectScore}` );

      const children = [];

      const proportion = score / perfectScore;
      const numFilledStars = Math.floor( proportion * numberOfStars );

      for ( let i = 0; i < numFilledStars; i++ ) {
        children.push( new StarNode( merge( { value: 1 }, options.starNodeOptions ) ) );
      }

      const remainder = proportion * numberOfStars - numFilledStars;
      if ( remainder > 1E-6 ) {
        children.push( new StarNode( merge( { value: remainder }, options.starNodeOptions ) ) );
      }

      const numEmptyStars = numberOfStars - children.length;
      for ( let i = 0; i < numEmptyStars; i++ ) {
        children.push( new StarNode( merge( { value: 0 }, options.starNodeOptions ) ) );
      }

      this.children = children;
    };
    scoreProperty.link( scorePropertyListener );

    // @private
    this.disposeScoreDisplayStars = function() {
      scoreProperty.unlink( scorePropertyListener );
    };
  }

  /**
   * @public
   * @override
   */
  dispose() {
    this.disposeScoreDisplayStars();
    super.dispose();
  }
}

vegas.register( 'ScoreDisplayStars', ScoreDisplayStars );
export default ScoreDisplayStars;