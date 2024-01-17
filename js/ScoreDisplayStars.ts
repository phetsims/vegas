// Copyright 2013-2023, University of Colorado Boulder

/**
 * Display a score as '* * * *', where '*' are stars, which may be fully or partially filled in.
 * See specification in https://github.com/phetsims/vegas/issues/59.
 *
 * @author John Blanco
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrea Lin
 */

import TReadOnlyProperty from '../../axon/js/TReadOnlyProperty.js';
import optionize, { combineOptions } from '../../phet-core/js/optionize.js';
import StrictOmit from '../../phet-core/js/types/StrictOmit.js';
import StarNode, { StarNodeOptions } from '../../scenery-phet/js/StarNode.js';
import { HBox, HBoxOptions } from '../../scenery/js/imports.js';
import vegas from './vegas.js';

type SelfOptions = {
  numberOfStars?: number;
  perfectScore?: number;

  // Scores required to fill in the stars in half-star increments.
  halfStarScores?: Array<number>;

  starNodeOptions?: StarNodeOptions;
};

export type ScoreDisplayStarsOptions = SelfOptions & StrictOmit<HBoxOptions, 'children'>;

export default class ScoreDisplayStars extends HBox {

  private readonly disposeScoreDisplayStars: () => void;

  public constructor( scoreProperty: TReadOnlyProperty<number>, providedOptions?: ScoreDisplayStarsOptions ) {

    const options = optionize<ScoreDisplayStarsOptions, SelfOptions, HBoxOptions>()( {

      // SelfOptions
      numberOfStars: 1,
      perfectScore: 1,
      halfStarScores: [],
      starNodeOptions: {
        starShapeOptions: {
          outerRadius: 10,
          innerRadius: 5
        },
        filledLineWidth: 1.5,
        emptyLineWidth: 1.5
      },

      // HBoxOptions
      spacing: 3
    }, providedOptions );

    const numberOfStars = options.numberOfStars;
    const perfectScore = options.perfectScore;

    super( options );

    // Return a star node filled to the proportion of the given fill value.
    const createStarNode = ( fillValue: number ) => {
      return new StarNode( combineOptions<StarNodeOptions>( { value: fillValue }, options.starNodeOptions ) );
    };

    // Update visibility of filled and half-filled stars based on score.
    const scorePropertyListener = ( score: number ) => {

      assert && assert( score <= perfectScore, `Score ${score} exceeds perfect score ${perfectScore}` );

      const children = [];

      const proportion = score / perfectScore;
      let numFilledStars = Math.floor( proportion * numberOfStars );
      let remainder = proportion * numberOfStars - numFilledStars;

      // Fill stars in using half-star increments.
      if ( options.halfStarScores.length !== 0 && numberOfStars === 5 ) {

        // Set the remainder for scores that would have a half-star fill, otherwise, no half-stars (remainder = 0).
        remainder = 0;
        const scoreArray = options.halfStarScores;
        if ( score >= scoreArray[ 0 ] && score < scoreArray[ 1 ] ||
             score >= scoreArray[ 2 ] && score < scoreArray[ 3 ] ||
             score >= scoreArray[ 4 ] && score < scoreArray[ 5 ] ||
             score >= scoreArray[ 6 ] && score < scoreArray[ 7 ] ||
             score >= scoreArray[ 8 ] && score < scoreArray[ 9 ] ) {
          remainder = 0.5;
        }

        // Set the number of filled stars.
        if ( score >= scoreArray[ 1 ] && score < scoreArray[ 3 ] ) {
          numFilledStars = 1;
        }
        else if ( score >= scoreArray[ 3 ] && score < scoreArray[ 5 ] ) {
          numFilledStars = 2;
        }
        else if ( score >= scoreArray[ 5 ] && score < scoreArray[ 7 ] ) {
          numFilledStars = 3;
        }
        else if ( score >= scoreArray[ 7 ] && score < scoreArray[ 9 ] ) {
          numFilledStars = 4;
        }
        else if ( score === scoreArray[ 9 ] ) {
          numFilledStars = numberOfStars;
        }
      }

      // Fill stars in.
      for ( let i = 0; i < numFilledStars; i++ ) {
        children.push( createStarNode( 1 ) );
      }
      if ( remainder > 1E-6 ) {
        children.push( createStarNode( remainder ) );
      }
      const numEmptyStars = numberOfStars - children.length;
      for ( let i = 0; i < numEmptyStars; i++ ) {
        children.push( createStarNode( 0 ) );
      }

      this.children = children;
    };
    scoreProperty.link( scorePropertyListener );

    this.disposeScoreDisplayStars = function() {
      scoreProperty.unlink( scorePropertyListener );
    };
  }

  public override dispose(): void {
    this.disposeScoreDisplayStars();
    super.dispose();
  }
}

vegas.register( 'ScoreDisplayStars', ScoreDisplayStars );