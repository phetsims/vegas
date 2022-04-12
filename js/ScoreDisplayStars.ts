// Copyright 2013-2022, University of Colorado Boulder

/**
 * Display a score as '* * * *', where '*' are stars, which may be fully or partially filled in.
 * See specification in https://github.com/phetsims/vegas/issues/59.
 *
 * @author John Blanco
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrea Lin
 */

import IProperty from '../../axon/js/IProperty.js';
import merge from '../../phet-core/js/merge.js';
import optionize from '../../phet-core/js/optionize.js';
import StarNode from '../../scenery-phet/js/StarNode.js';
import { HBox, HBoxOptions } from '../../scenery/js/imports.js';
import vegas from './vegas.js';

type SelfOptions = {
  numberOfStars?: number;
  perfectScore?: number;
  spacing?: number;
  starNodeOptions?: any; //TODO https://github.com/phetsims/scenery-phet/issues/734
};

export type ScoreDisplayStarsOptions = SelfOptions & Omit<HBoxOptions, 'children'>;

export default class ScoreDisplayStars extends HBox {

  private readonly disposeScoreDisplayStars: () => void;

  constructor( scoreProperty: IProperty<number>, providedOptions?: ScoreDisplayStarsOptions ) {

    const options = optionize<ScoreDisplayStarsOptions, SelfOptions, HBoxOptions>( {
      numberOfStars: 1,
      perfectScore: 1,
      spacing: 3,
      starNodeOptions: {
        outerRadius: 10,
        innerRadius: 5,
        filledLineWidth: 1.5,
        emptyLineWidth: 1.5
      }
    }, providedOptions );

    const numberOfStars = options.numberOfStars;
    const perfectScore = options.perfectScore;

    super( options );

    // Update visibility of filled and half-filled stars based on score.
    assert && assert( !options.children, 'ScoreDisplayStars sets children' );
    const scorePropertyListener = ( score: number ) => {

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