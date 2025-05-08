// Copyright 2018-2025, University of Colorado Boulder

/**
 * Display a score as 'Score: * * * *', where '*' are stars, which may be fully or partially filled in.
 * See specification in https://github.com/phetsims/vegas/issues/59.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize from '../../phet-core/js/optionize.js';
import StrictOmit from '../../phet-core/js/types/StrictOmit.js';
import StatusBar from '../../scenery-phet/js/StatusBar.js';
import HBox, { HBoxOptions } from '../../scenery/js/layout/nodes/HBox.js';
import Text from '../../scenery/js/nodes/Text.js';
import Font from '../../scenery/js/util/Font.js';
import TColor from '../../scenery/js/util/TColor.js';
import ScoreDisplayStars, { ScoreDisplayStarsOptions } from './ScoreDisplayStars.js';
import vegas from './vegas.js';
import VegasStrings from './VegasStrings.js';
import Tandem from '../../tandem/js/Tandem.js';
import ReadOnlyProperty from '../../axon/js/ReadOnlyProperty.js';

type SelfOptions = {
  font?: Font;
  textFill?: TColor;
  spacing?: number;
  scoreDisplayStarsOptions?: ScoreDisplayStarsOptions;
};

export type ScoreDisplayLabeledStarsOptions = SelfOptions & StrictOmit<HBoxOptions, 'children'>;

export default class ScoreDisplayLabeledStars extends HBox {

  private readonly disposeScoreDisplayLabeledStars: () => void;

  public constructor( scoreProperty: ReadOnlyProperty<number>, providedOptions?: ScoreDisplayLabeledStarsOptions ) {

    const options = optionize<ScoreDisplayLabeledStarsOptions, StrictOmit<SelfOptions, 'scoreDisplayStarsOptions'>, HBoxOptions>()( {

      // SelfOptions
      font: StatusBar.DEFAULT_FONT,
      textFill: 'black',
      spacing: 5,

      // HBoxOptions
      tandem: Tandem.OPTIONAL,
      phetioFeatured: true,
      visiblePropertyOptions: {
        phetioFeatured: true
      }
    }, providedOptions );

    const textNode = new Text( VegasStrings.scoreStringProperty, {
      font: options.font,
      fill: options.textFill
    } );

    const scoreDisplay = new ScoreDisplayStars( scoreProperty, options.scoreDisplayStarsOptions );

    options.children = [ textNode, scoreDisplay ];

    super( options );

    if ( this.isPhetioInstrumented() && scoreProperty.isPhetioInstrumented() ) {
      this.addLinkedElement( scoreProperty );
    }

    this.disposeScoreDisplayLabeledStars = () => {
      textNode.dispose();
      scoreDisplay.dispose();
    };
  }

  public override dispose(): void {
    this.disposeScoreDisplayLabeledStars();
    super.dispose();
  }
}

vegas.register( 'ScoreDisplayLabeledStars', ScoreDisplayLabeledStars );