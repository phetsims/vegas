// Copyright 2018-2025, University of Colorado Boulder

/**
 * A dialog that the client displays when the user gets a specific number of stars.
 * See specification in https://github.com/phetsims/vegas/issues/59.
 *
 * @author Andrea Lin
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../axon/js/NumberProperty.js';
import ReadOnlyProperty from '../../axon/js/ReadOnlyProperty.js';
import { TReadOnlyProperty } from '../../axon/js/TReadOnlyProperty.js';
import optionize, { combineOptions } from '../../phet-core/js/optionize.js';
import StrictOmit from '../../phet-core/js/types/StrictOmit.js';
import PhetColorScheme from '../../scenery-phet/js/PhetColorScheme.js';
import PhetFont from '../../scenery-phet/js/PhetFont.js';
import PDOMUtils from '../../scenery/js/accessibility/pdom/PDOMUtils.js';
import HBox from '../../scenery/js/layout/nodes/HBox.js';
import VBox from '../../scenery/js/layout/nodes/VBox.js';
import Image from '../../scenery/js/nodes/Image.js';
import Text from '../../scenery/js/nodes/Text.js';
import Font from '../../scenery/js/util/Font.js';
import { PushButtonListener } from '../../sun/js/buttons/PushButtonModel.js';
import RectangularPushButton, { RectangularPushButtonOptions } from '../../sun/js/buttons/RectangularPushButton.js';
import Dialog, { DialogOptions } from '../../sun/js/Dialog.js';
import phetGirlJugglingStars_png from '../images/phetGirlJugglingStars_png.js';
import ScoreDisplayNumberAndStar, { ScoreDisplayNumberAndStarOptions } from './ScoreDisplayNumberAndStar.js';
import vegas from './vegas.js';
import VegasFluent from './VegasFluent.js';
import VegasStrings from './VegasStrings.js';

// constants
const DEFAULT_BUTTONS_FONT = new PhetFont( 20 );
const DEFAULT_SCORE_DISPLAY_FONT = new PhetFont( { size: 38, weight: 'bold' } );

type SelfOptions = {
  phetGirlScale?: number;
  buttonsFont?: Font;
  buttonsWidth?: number; // fixed width for both buttons
  buttonsYSpacing?: number;
  dismissListener?: PushButtonListener; // called when 'Keep Going', 'Close' button, or 'Esc' key is pressed
  newLevelButtonListener?: PushButtonListener; // called when 'New Level' button is pressed
  scoreDisplayOptions?: ScoreDisplayNumberAndStarOptions;
};

export type RewardDialogOptions = SelfOptions & StrictOmit<DialogOptions, 'focusOnShowNode' | 'accessibleName'>;

export default class RewardDialog extends Dialog {
  private readonly level: number | TReadOnlyProperty<number>;
  private readonly accessibleScoreStringProperty: TReadOnlyProperty<string>;

  public constructor( level: number | TReadOnlyProperty<number>, score: number | ReadOnlyProperty<number>, providedOptions?: RewardDialogOptions ) {

    // To be disposed.
    const accessibleNameStringProperty = VegasFluent.a11y.rewardDialog.accessibleName.createProperty( { levelNumber: level } );

    const options = optionize<RewardDialogOptions, SelfOptions, DialogOptions>()( {

      // RewardDialogOptions
      phetGirlScale: 0.6,
      buttonsFont: DEFAULT_BUTTONS_FONT,
      buttonsWidth: 145,
      buttonsYSpacing: 20,
      dismissListener: _.noop,
      newLevelButtonListener: _.noop,
      scoreDisplayOptions: {
        font: DEFAULT_SCORE_DISPLAY_FONT,
        spacing: 8,
        starNodeOptions: {
          starShapeOptions: {
            outerRadius: 20,
            innerRadius: 10
          },
          filledLineWidth: 2
        }
      },

      // DialogOptions
      // pdom - Since we are setting the focusOnShowNode to be the first element in content, put the closeButton last
      closeButtonLastInPDOM: true,
      accessibleName: accessibleNameStringProperty
    }, providedOptions );

    const scoreProperty = ( typeof score === 'number' ) ? new NumberProperty( score ) : score;
    const scoreDisplay = new ScoreDisplayNumberAndStar( scoreProperty, options.scoreDisplayOptions );

    const phetGirlAccessibleParagraphStringProperty = VegasFluent.a11y.rewardDialog.phetGirl.accessibleParagraph.createProperty( { stars: scoreDisplay.accessibleScoreStringProperty } );
    const phetGirlNode = new Image( phetGirlJugglingStars_png, {
      scale: options.phetGirlScale,

      // pdom
      accessibleParagraph: phetGirlAccessibleParagraphStringProperty
    } );

    const buttonOptions = {
      font: options.buttonsFont,
      minWidth: options.buttonsWidth,
      maxWidth: options.buttonsWidth
    };

    const textOptions = { font: DEFAULT_BUTTONS_FONT, maxWidth: options.buttonsWidth * 0.9 };

    const newLevelAccessibleHelpTextStringProperty = VegasFluent.a11y.rewardDialog.newLevelButton.accessibleParagraph.createProperty( { levelNumber: level } );
    const newLevelButton = new RectangularPushButton(
      combineOptions<RectangularPushButtonOptions>( {}, buttonOptions, {
        content: new Text( VegasStrings.newLevelStringProperty, textOptions ),
        listener: options.newLevelButtonListener,
        baseColor: PhetColorScheme.PHET_LOGO_YELLOW,
        tandem: options.tandem?.createTandem( 'newLevelButton' ),
        accessibleHelpText: newLevelAccessibleHelpTextStringProperty
      } ) );

    // Handles dialog dismissal via close button, escape key, or "Keep Going" button.
    // - Executes the client-provided dismissal callback.
    // - Moves focus to the top of the game challenge for accessibility.
    // - Announces a context response to guide the user on how to continue.
    const closeDialogListener = () => {
      options.dismissListener();

      // TODO: add an option for where focus should go, it actually seems like focus should go to a designed location, see #138
      PDOMUtils.focusTop();
      this.addAccessibleContextResponse( VegasFluent.a11y.rewardDialog.keepGoingButton.accessibleContextResponse.format( {
        levelNumber: level
      } ), { alertWhenNotDisplayed: true } );
    };

    options.closeButtonListener = closeDialogListener;

    const keepGoingButton = new RectangularPushButton(
      combineOptions<RectangularPushButtonOptions>( {}, buttonOptions, {
        content: new Text( VegasStrings.keepGoingStringProperty, textOptions ),
        listener: closeDialogListener,
        baseColor: 'white',
        tandem: options.tandem?.createTandem( 'keepGoingButton' )
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

    // Focus the newLevelButton when the Dialog is shown.
    options.focusOnShowNode = newLevelButton;

    super( content, options );

    this.level = level;
    this.accessibleScoreStringProperty = scoreDisplay.accessibleScoreStringProperty;

    // Disposal
    this.addDisposable(
      phetGirlAccessibleParagraphStringProperty,
      newLevelAccessibleHelpTextStringProperty,
      accessibleNameStringProperty
    );
  }

  /**
   * When the dialog is shown, a custom context response is spoken summarizing the information.
   */
  public override show(): void {
    super.show();

    this.addAccessibleContextResponse( VegasFluent.a11y.rewardDialog.accessibleContextResponseShown.format( {
      levelNumber: this.level,
      stars: this.accessibleScoreStringProperty
    } ) );
  }
}

vegas.register( 'RewardDialog', RewardDialog );