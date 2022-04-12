// Copyright 2018-2022, University of Colorado Boulder

/**
 * Display a score as 'N *', where N is a number and '*' is a star.
 * If N is 0, it is hidden and the star is grayed out.
 * See specification in https://github.com/phetsims/vegas/issues/59.
 *
 * @author Andrea Lin
 */

import Utils from '../../dot/js/Utils.js';
import merge from '../../phet-core/js/merge.js';
import StarNode from '../../scenery-phet/js/StarNode.js';
import { Font, HBox, HBoxOptions, IColor, Text } from '../../scenery/js/imports.js';
import StatusBar from '../../scenery-phet/js/StatusBar.js';
import vegas from './vegas.js';
import IProperty from '../../axon/js/IProperty.js';
import optionize from '../../phet-core/js/optionize.js';

type SelfOptions = {
  font?: Font;
  textFill?: IColor;
  scoreDecimalPlaces?: number;
  starNodeOptions?: any; //TODO https://github.com/phetsims/scenery-phet/issues/734
};

export type ScoreDisplayNumberAndStarOptions = SelfOptions & Omit<HBoxOptions, 'children'>;

export default class ScoreDisplayNumberAndStar extends HBox {

  private readonly disposeScoreDisplayNumberAndStar: () => void;

  constructor( scoreProperty: IProperty<number>, providedOptions?: ScoreDisplayNumberAndStarOptions ) {

    const options = optionize<ScoreDisplayNumberAndStarOptions, SelfOptions, HBoxOptions>( {

      // SelfOptions
      font: StatusBar.DEFAULT_FONT,
      textFill: 'black',
      scoreDecimalPlaces: 0,
      starNodeOptions: {
        outerRadius: 10,
        innerRadius: 5,
        filledLineWidth: 1.5,
        emptyLineWidth: 1.5
      },

      // HBoxOptions
      spacing: 5
    }, providedOptions );

    super( options );

    // Update number displayed based on score.
    assert && assert( !options.children, 'ScoreDisplayNumberAndStar sets children' );
    const scorePropertyListener = ( score: number ) => {
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

      this.children = children;
    };
    scoreProperty.link( scorePropertyListener );

    this.disposeScoreDisplayNumberAndStar = function() {
      scoreProperty.unlink( scorePropertyListener );
    };
  }

  public override dispose(): void {
    this.disposeScoreDisplayNumberAndStar();
    super.dispose();
  }
}

vegas.register( 'ScoreDisplayNumberAndStar', ScoreDisplayNumberAndStar );