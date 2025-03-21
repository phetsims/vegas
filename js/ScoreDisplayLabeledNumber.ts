// Copyright 2018-2025, University of Colorado Boulder

/**
 * Display a score as 'Score: N', where N is a number.
 * See specification in https://github.com/phetsims/vegas/issues/59.
 *
 * @author Andrea Lin
 */

import DerivedProperty from '../../axon/js/DerivedProperty.js';
import TReadOnlyProperty from '../../axon/js/TReadOnlyProperty.js';
import optionize from '../../phet-core/js/optionize.js';
import StrictOmit from '../../phet-core/js/types/StrictOmit.js';
import StringUtils from '../../phetcommon/js/util/StringUtils.js';
import StatusBar from '../../scenery-phet/js/StatusBar.js';
import { HBoxOptions } from '../../scenery/js/layout/nodes/HBox.js';
import Node from '../../scenery/js/nodes/Node.js';
import Text from '../../scenery/js/nodes/Text.js';
import Font from '../../scenery/js/util/Font.js';
import TColor from '../../scenery/js/util/TColor.js';
import vegas from './vegas.js';
import VegasStrings from './VegasStrings.js';
import { toFixed } from '../../dot/js/util/toFixed.js';

type SelfOptions = {
  font?: Font;
  textFill?: TColor;
  scoreDecimalPlaces?: number;
};

export type ScoreDisplayLabeledNumberOptions = SelfOptions & StrictOmit<HBoxOptions, 'children'>;

export default class ScoreDisplayLabeledNumber extends Node {

  private readonly disposeScoreDisplayLabeledNumber: () => void;

  public constructor( scoreProperty: TReadOnlyProperty<number>, providedOptions?: ScoreDisplayLabeledNumberOptions ) {

    const options = optionize<ScoreDisplayLabeledNumberOptions, SelfOptions, HBoxOptions>()( {

      // SelfOptions
      font: StatusBar.DEFAULT_FONT,
      textFill: 'black',
      scoreDecimalPlaces: 0
    }, providedOptions );

    const scoreDisplayStringProperty = new DerivedProperty(
      [ VegasStrings.pattern.score.numberStringProperty, scoreProperty ],
      ( pattern: string, score: number ) => StringUtils.fillIn( pattern, {
        score: toFixed( score, options.scoreDecimalPlaces )
      } )
    );

    const scoreDisplayText = new Text( scoreDisplayStringProperty, {
      font: options.font,
      fill: options.textFill
    } );

    options.children = [ scoreDisplayText ];

    super( options );

    this.disposeScoreDisplayLabeledNumber = () => {
      scoreDisplayStringProperty.dispose();
    };
  }

  public override dispose(): void {
    this.disposeScoreDisplayLabeledNumber();
    super.dispose();
  }
}

vegas.register( 'ScoreDisplayLabeledNumber', ScoreDisplayLabeledNumber );