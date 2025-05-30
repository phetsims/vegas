// Copyright 2013-2025, University of Colorado Boulder

/**
 * Display a score as '* * * *', where '*' are stars, which may be fully or partially filled in.
 * See specification in https://github.com/phetsims/vegas/issues/59.
 *
 * @author John Blanco
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrea Lin
 */

import optionize, { combineOptions } from '../../phet-core/js/optionize.js';
import StrictOmit from '../../phet-core/js/types/StrictOmit.js';
import StarNode, { StarNodeOptions } from '../../scenery-phet/js/StarNode.js';
import HBox, { HBoxOptions } from '../../scenery/js/layout/nodes/HBox.js';
import vegas from './vegas.js';
import Tandem from '../../tandem/js/Tandem.js';
import ReadOnlyProperty from '../../axon/js/ReadOnlyProperty.js';

type SelfOptions = {
  numberOfStars?: number;
  perfectScore?: number;
  starNodeOptions?: StarNodeOptions;
};

export type ScoreDisplayStarsOptions = SelfOptions & StrictOmit<HBoxOptions, 'children'>;

export default class ScoreDisplayStars extends HBox {

  private readonly disposeScoreDisplayStars: () => void;

  public constructor( scoreProperty: ReadOnlyProperty<number>, providedOptions?: ScoreDisplayStarsOptions ) {

    const options = optionize<ScoreDisplayStarsOptions, SelfOptions, HBoxOptions>()( {

      // SelfOptions
      numberOfStars: 1,
      perfectScore: 1,
      starNodeOptions: {
        starShapeOptions: {
          outerRadius: 10,
          innerRadius: 5
        },
        filledLineWidth: 1.5,
        emptyLineWidth: 1.5
      },

      // HBoxOptions
      spacing: 3,
      tandem: Tandem.OPTIONAL,
      phetioFeatured: true,
      visiblePropertyOptions: {
        phetioFeatured: true
      }
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

      const remainder = proportion * numberOfStars - numFilledStars;
      if ( remainder > 1E-6 ) {
        children.push( new StarNode( combineOptions<StarNodeOptions>( { value: remainder }, options.starNodeOptions ) ) );
      }

      const numEmptyStars = numberOfStars - children.length;
      for ( let i = 0; i < numEmptyStars; i++ ) {
        children.push( new StarNode( combineOptions<StarNodeOptions>( { value: 0 }, options.starNodeOptions ) ) );
      }

      this.children = children;
    };
    scoreProperty.link( scorePropertyListener );

    if ( this.isPhetioInstrumented() && scoreProperty.isPhetioInstrumented() ) {
      this.addLinkedElement( scoreProperty );
    }

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