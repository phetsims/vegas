// Copyright 2018-2022, University of Colorado Boulder

/**
 * A dialog that the client displays when the user gets a specific number of stars.
 * See specification in https://github.com/phetsims/vegas/issues/59.
 *
 * @author Andrea Lin
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../axon/js/NumberProperty.js';
import StrictOmit from '../../phet-core/js/types/StrictOmit.js';
import merge from '../../phet-core/js/merge.js';
import optionize, { combineOptions3 } from '../../phet-core/js/optionize.js';
import PhetColorScheme from '../../scenery-phet/js/PhetColorScheme.js';
import PhetFont from '../../scenery-phet/js/PhetFont.js';
import { Font, HBox, Image, Text, VBox } from '../../scenery/js/imports.js';
import { PushButtonListener } from '../../sun/js/buttons/PushButtonModel.js';
import RectangularPushButton, { RectangularPushButtonOptions } from '../../sun/js/buttons/RectangularPushButton.js';
import Dialog from '../../sun/js/Dialog.js';
import phetGirlJugglingStars_png from '../images/phetGirlJugglingStars_png.js';
import ScoreDisplayNumberAndStar, { ScoreDisplayNumberAndStarOptions } from './ScoreDisplayNumberAndStar.js';
import vegas from './vegas.js';
import vegasStrings from './vegasStrings.js';

// constants
const DEFAULT_BUTTONS_FONT = new PhetFont( 20 );
const DEFAULT_SCORE_DISPLAY_OPTIONS = {
  font: new PhetFont( { size: 38, weight: 'bold' } ),
  spacing: 8,
  starNodeOptions: {
    outerRadius: 20,
    innerRadius: 10,
    filledLineWidth: 2
  }
};

type SelfOptions = {
  phetGirlScale?: number;
  scoreDisplayOptions?: ScoreDisplayNumberAndStarOptions;
  buttonsFont?: Font;
  buttonsWidth?: number; // fixed width for both buttons
  buttonsYSpacing?: number;
  keepGoingButtonListener?: PushButtonListener; // called when 'Keep Going' button is pressed
  newLevelButtonListener?: PushButtonListener; // called when 'New Level' button is pressed
};

type DialogOptions = any; //TODO https://github.com/phetsims/vegas/issues/103 Dialog.js has not been ported to TypeScript

export type RewardDialogOptions = SelfOptions & StrictOmit<DialogOptions, 'focusOnShowNode'>;

export default class RewardDialog extends Dialog {

  constructor( score: number, providedOptions?: RewardDialogOptions ) {

    const options = optionize<RewardDialogOptions, StrictOmit<SelfOptions, 'scoreDisplayOptions'>, DialogOptions>()( {

      // RewardDialogOptions
      phetGirlScale: 0.6,
      buttonsFont: DEFAULT_BUTTONS_FONT,
      buttonsWidth: 145,
      buttonsYSpacing: 20,
      keepGoingButtonListener: _.noop,
      newLevelButtonListener: _.noop,

      // DialogOptions
      // pdom - Since we are setting the focusOnShowNode to be the first element in content, put the closeButton last
      closeButtonLastInPDOM: true
    }, providedOptions );

    options.scoreDisplayOptions = merge( {}, DEFAULT_SCORE_DISPLAY_OPTIONS, options.numeratorOptions );

    const phetGirlNode = new Image( phetGirlJugglingStars_png, {
      scale: options.phetGirlScale
    } );

    const scoreDisplay = new ScoreDisplayNumberAndStar( new NumberProperty( score ), options.scoreDisplayOptions );

    const buttonOptions = {
      font: options.buttonsFont,
      minWidth: options.buttonsWidth,
      maxWidth: options.buttonsWidth
    };

    const newLevelButton = new RectangularPushButton(
      combineOptions3<RectangularPushButtonOptions>( {}, buttonOptions, {
        content: new Text( vegasStrings.newLevel, { font: DEFAULT_BUTTONS_FONT } ),
        listener: options.newLevelButtonListener,
        baseColor: PhetColorScheme.PHET_LOGO_YELLOW
      } ) );

    const keepGoingButton = new RectangularPushButton(
      combineOptions3<RectangularPushButtonOptions>( {}, buttonOptions, {
        content: new Text( vegasStrings.keepGoing, { font: DEFAULT_BUTTONS_FONT } ),
        listener: options.keepGoingButtonListener,
        baseColor: 'white'
      } ) );

    const buttons = new VBox( {
      children: [ newLevelButton, keepGoingButton ],
      spacing: options.buttonsYSpacing
    } );

    // half the remaining height, so that scoreDisplay will be centered in the negative space above the buttons.
    const scoreSpacing = ( phetGirlNode.height - scoreDisplay.height - buttons.height ) / 2;
    assert && assert( scoreSpacing > 0, 'phetGirlNode is scaled down too much' );

    const rightSideNode = new VBox( {
      children: [ scoreDisplay, buttons ],
      align: 'center',
      spacing: scoreSpacing
    } );

    const content = new HBox( {
      align: 'bottom',
      children: [ phetGirlNode, rightSideNode ],
      spacing: 52
    } );

    options.focusOnShowNode = newLevelButton;

    super( content, options );
  }
}

vegas.register( 'RewardDialog', RewardDialog );