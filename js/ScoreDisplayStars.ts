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
import Range from '../../dot/js/Range.js';

type SelfOptions = {
  numberOfStars?: number;
  perfectScore?: number;

  // keep the last star at a maximum of half-full while the score is in this score range
  halfStarScoreRange?: Range | null;

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
      halfStarScoreRange: null,
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

    // Update visibility of filled and half-filled stars based on score.
    const scorePropertyListener = ( score: number ) => {

      assert && assert( score <= perfectScore, `Score ${score} exceeds perfect score ${perfectScore}` );

      const children = [];

      const proportion = score / perfectScore;
      const numFilledStars = Math.floor( proportion * numberOfStars );

      for ( let i = 0; i < numFilledStars; i++ ) {
        children.push( new StarNode( combineOptions<StarNodeOptions>( { value: 1 }, options.starNodeOptions ) ) );
      }

      let remainder = proportion * numberOfStars - numFilledStars;
      const inHalfStarScoreRange = options.halfStarScoreRange && options.halfStarScoreRange.contains( score );
      if ( inHalfStarScoreRange || remainder > 1E-6 ) {
        if ( inHalfStarScoreRange ) {
          remainder = ( ( options.halfStarScoreRange!.min - 1 ) / perfectScore ) * numberOfStars - numFilledStars;
        }
        children.push( new StarNode( combineOptions<StarNodeOptions>( { value: remainder }, options.starNodeOptions ) ) );
      }

      const numEmptyStars = numberOfStars - children.length;
      for ( let i = 0; i < numEmptyStars; i++ ) {
        children.push( new StarNode( combineOptions<StarNodeOptions>( { value: 0 }, options.starNodeOptions ) ) );
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