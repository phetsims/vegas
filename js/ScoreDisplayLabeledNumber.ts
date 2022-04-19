// Copyright 2018-2022, University of Colorado Boulder

/**
 * Display a score as 'Score: N', where N is a number.
 * See specification in https://github.com/phetsims/vegas/issues/59.
 *
 * @author Andrea Lin
 */

import Utils from '../../dot/js/Utils.js';
import StringUtils from '../../phetcommon/js/util/StringUtils.js';
import { Font, HBoxOptions, IColor, Node, Text } from '../../scenery/js/imports.js';
import StatusBar from '../../scenery-phet/js/StatusBar.js';
import vegas from './vegas.js';
import vegasStrings from './vegasStrings.js';
import IProperty from '../../axon/js/IProperty.js';
import optionize from '../../phet-core/js/optionize.js';

type SelfOptions = {
  font?: Font;
  textFill?: IColor;
  scoreDecimalPlaces?: number;
};

export type ScoreDisplayLabeledNumberOptions = SelfOptions & Omit<HBoxOptions, 'children'>;

export default class ScoreDisplayLabeledNumber extends Node {

  private readonly disposeScoreDisplayLabeledNumber: () => void;

  constructor( scoreProperty: IProperty<number>, providedOptions?: ScoreDisplayLabeledNumberOptions ) {

    const options = optionize<ScoreDisplayLabeledNumberOptions, SelfOptions, HBoxOptions>()( {
      font: StatusBar.DEFAULT_FONT,
      textFill: 'black',
      scoreDecimalPlaces: 0
    }, providedOptions );

    const scoreDisplayText = new Text( '', {
      font: options.font,
      fill: options.textFill
    } );

    assert && assert( !options.children, 'ScoreDisplayNumber sets children' );
    options.children = [ scoreDisplayText ];

    // Update number displayed based on score.
    const scorePropertyListener = ( score: number ) => {
      scoreDisplayText.text = StringUtils.fillIn( vegasStrings.pattern.score.number, {
        score: Utils.toFixed( score, options.scoreDecimalPlaces )
      } );
    };
    scoreProperty.link( scorePropertyListener );

    super( options );

    this.disposeScoreDisplayLabeledNumber = function() {
      scoreProperty.unlink( scorePropertyListener );
    };
  }

  public override dispose(): void {
    this.disposeScoreDisplayLabeledNumber();
    super.dispose();
  }
}

vegas.register( 'ScoreDisplayLabeledNumber', ScoreDisplayLabeledNumber );