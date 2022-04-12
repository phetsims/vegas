// Copyright 2018-2022, University of Colorado Boulder

/**
 * Display a score as 'Score: * * * *', where '*' are stars, which may be fully or partially filled in.
 * See specification in https://github.com/phetsims/vegas/issues/59.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { Font, HBox, HBoxOptions, IColor, Text } from '../../scenery/js/imports.js';
import ScoreDisplayStars, { ScoreDisplayStarsOptions } from './ScoreDisplayStars.js';
import StatusBar from '../../scenery-phet/js/StatusBar.js';
import vegas from './vegas.js';
import vegasStrings from './vegasStrings.js';
import IProperty from '../../axon/js/IProperty.js';
import optionize from '../../phet-core/js/optionize.js';

type SelfOptions = {
  font?: Font;
  textFill?: IColor;
  spacing?: number;
};

export type ScoreDisplayLabeledStarsOptions = SelfOptions & ScoreDisplayStarsOptions & Omit<HBoxOptions, 'children'>;

export default class ScoreDisplayLabeledStars extends HBox {

  private readonly disposeScoreDisplayLabeledStars: () => void;

  constructor( scoreProperty: IProperty<number>, providedOptions?: ScoreDisplayLabeledStarsOptions ) {

    const options = optionize<ScoreDisplayLabeledStarsOptions, SelfOptions, HBoxOptions>( {
      font: StatusBar.DEFAULT_FONT,
      textFill: 'black',
      spacing: 5
    }, providedOptions );

    const textNode = new Text( vegasStrings.score, {
      font: options.font,
      fill: options.textFill
    } );

    const scoreDisplay = new ScoreDisplayStars( scoreProperty, options );

    assert && assert( !options.children, 'ScoreDisplayLabeledStars sets children' );
    options.children = [ textNode, scoreDisplay ];

    super( options );

    this.disposeScoreDisplayLabeledStars = function() {
      scoreDisplay.dispose();
    };
  }

  public override dispose(): void {
    this.disposeScoreDisplayLabeledStars();
    super.dispose();
  }
}

vegas.register( 'ScoreDisplayLabeledStars', ScoreDisplayLabeledStars );