// Copyright 2013-2024, University of Colorado Boulder

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

  // Set this option to true when we want to show score increments through half stars.
  useHalfStarScores?: boolean;

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
      useHalfStarScores: false,
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
      if ( options.useHalfStarScores && remainder !== 0 ) {
        const numberOfHalves = numberOfStars * 2 - 1;
        const halfStarValue = perfectScore / numberOfHalves;
        numFilledStars = this.scoreStarsRound( score / ( halfStarValue * 2 ) );
        numFilledStars = numFilledStars === numberOfStars && score !== perfectScore ?
                         numberOfStars - 1 : numFilledStars;
        remainder = score / ( halfStarValue * 2 ) - numFilledStars > 0 ? 0.5 : 0;
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

  /**
   * Custom rounding function that rounds to the nearest integer, but rounds down if the decimal part is exactly 0.5.
   * We use this to calculate the number of filled stars. A star should remain at half-filled even if the number's tenth
   * value is 5. Once it crosses that boundary (0.5), we can fill a full star.
   *
   * // Examples
   *   console.log(customRound(0.5));  // Should round to 0
   *   console.log(customRound(1.5));  // Should round to 1
   *   console.log(customRound(2.51)); // Should round to 3
   *   console.log(customRound(2.4));  // Should round to 2
   */
  private scoreStarsRound( number: number ): number {
    const integerPart = Math.floor( number );
    const decimalPart = number - integerPart;

    if ( decimalPart > 0.5 ) {
      return Math.ceil( number );
    }
    else {
      return integerPart; // Round down if the decimal part is less than or equal to 0.5
    }
  }


  public override dispose(): void {
    this.disposeScoreDisplayStars();
    super.dispose();
  }
}

vegas.register( 'ScoreDisplayStars', ScoreDisplayStars );