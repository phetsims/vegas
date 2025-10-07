// Copyright 2018-2025, University of Colorado Boulder

/**
 * Display a score as 'N *', where N is a number and '*' is a star.
 * If N is 0, it is hidden and the star is grayed out.
 * See specification in https://github.com/phetsims/vegas/issues/59.
 *
 * @author Andrea Lin
 */

import DerivedProperty from '../../axon/js/DerivedProperty.js';
import ReadOnlyProperty from '../../axon/js/ReadOnlyProperty.js';
import { TReadOnlyProperty } from '../../axon/js/TReadOnlyProperty.js';
import { toFixed } from '../../dot/js/util/toFixed.js';
import { toFixedNumber } from '../../dot/js/util/toFixedNumber.js';
import optionize, { combineOptions } from '../../phet-core/js/optionize.js';
import StrictOmit from '../../phet-core/js/types/StrictOmit.js';
import StarNode, { StarNodeOptions } from '../../scenery-phet/js/StarNode.js';
import StatusBar from '../../scenery-phet/js/StatusBar.js';
import HBox, { HBoxOptions } from '../../scenery/js/layout/nodes/HBox.js';
import Text from '../../scenery/js/nodes/Text.js';
import Font from '../../scenery/js/util/Font.js';
import TColor from '../../scenery/js/util/TColor.js';
import Tandem from '../../tandem/js/Tandem.js';
import vegas from './vegas.js';
import VegasFluent from './VegasFluent.js';

type SelfOptions = {
  font?: Font;
  textFill?: TColor;
  scoreDecimalPlaces?: number;
  starNodeOptions?: StarNodeOptions;
};

export type ScoreDisplayNumberAndStarOptions = SelfOptions & StrictOmit<HBoxOptions, 'children'>;

export default class ScoreDisplayNumberAndStar extends HBox {

  // Property containing the accessible string representation of the score display.
  // For example, "0 stars", "1 star", "1.5 stars".
  public readonly accessibleScoreStringProperty: TReadOnlyProperty<string>;

  private readonly disposeScoreDisplayNumberAndStar: () => void;

  public constructor( scoreProperty: ReadOnlyProperty<number>, providedOptions?: ScoreDisplayNumberAndStarOptions ) {

    const options = optionize<ScoreDisplayNumberAndStarOptions, SelfOptions, HBoxOptions>()( {

      // SelfOptions
      font: StatusBar.DEFAULT_FONT,
      textFill: 'black',
      scoreDecimalPlaces: 0,
      starNodeOptions: {
        starShapeOptions: {
          outerRadius: 10,
          innerRadius: 5
        },
        filledLineWidth: 1.5,
        emptyLineWidth: 1.5
      },

      // HBoxOptions
      spacing: 5,
      tandem: Tandem.OPTIONAL,
      phetioFeatured: true,
      visiblePropertyOptions: {
        phetioFeatured: true
      }
    }, providedOptions );

    super( options );

    // Update number displayed based on score.
    const scorePropertyListener = ( score: number ) => {
      const children = [];

      if ( score === 0 ) {
        children.push( new StarNode( combineOptions<StarNodeOptions>( { value: 0 }, options.starNodeOptions ) ) );
      }
      else {
        children.push( new Text( toFixed( score, options.scoreDecimalPlaces ), {
          font: options.font,
          fill: options.textFill
        } ) );
        children.push( new StarNode( combineOptions<StarNodeOptions>( { value: 1 }, options.starNodeOptions ) ) );
      }

      this.children = children;
    };
    scoreProperty.link( scorePropertyListener );

    const accessibleStarsProperty = new DerivedProperty( [ scoreProperty ], score => toFixedNumber( score, options.scoreDecimalPlaces ) );
    this.accessibleScoreStringProperty = VegasFluent.a11y.scoreDisplays.scoreDisplayNumberAndStar.accessibleScore.createProperty( {
      stars: accessibleStarsProperty
    } );

    if ( this.isPhetioInstrumented() && scoreProperty.isPhetioInstrumented() ) {
      this.addLinkedElement( scoreProperty );
    }

    this.disposeScoreDisplayNumberAndStar = function() {
      scoreProperty.unlink( scorePropertyListener );
      accessibleStarsProperty.dispose();
      this.accessibleScoreStringProperty.dispose();
    };
  }

  public override dispose(): void {
    this.disposeScoreDisplayNumberAndStar();
    super.dispose();
  }
}

vegas.register( 'ScoreDisplayNumberAndStar', ScoreDisplayNumberAndStar );