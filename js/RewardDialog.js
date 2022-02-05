// Copyright 2018-2022, University of Colorado Boulder

/**
 * A dialog that the client displays when the user gets a specific number of stars.
 * See specification in https://github.com/phetsims/vegas/issues/59.
 *
 * @author Andrea Lin
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../axon/js/NumberProperty.js';
import merge from '../../phet-core/js/merge.js';
import PhetColorScheme from '../../scenery-phet/js/PhetColorScheme.js';
import PhetFont from '../../scenery-phet/js/PhetFont.js';
import { HBox } from '../../scenery/js/imports.js';
import { Image } from '../../scenery/js/imports.js';
import { Text } from '../../scenery/js/imports.js';
import { VBox } from '../../scenery/js/imports.js';
import RectangularPushButton from '../../sun/js/buttons/RectangularPushButton.js';
import Dialog from '../../sun/js/Dialog.js';
import phetGirlJugglingStars_png from '../images/phetGirlJugglingStars_png.js';
import ScoreDisplayNumberAndStar from './ScoreDisplayNumberAndStar.js';
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

class RewardDialog extends Dialog {

  /**
   * @param {number} score
   * @param {Object} [options]
   */
  constructor( score, options ) {

    options = merge( {

      // RewardDialog options
      phetGirlScale: 0.6,
      scoreDisplayOptions: null, // {Object|null} options passed to ScoreDisplayNumberAndStar
      buttonsFont: DEFAULT_BUTTONS_FONT,
      buttonsWidth: 145, // {number} fixed width for both buttons
      buttonsYSpacing: 20,
      keepGoingButtonListener: () => {}, // called when 'Keep Going' button is pressed
      newLevelButtonListener: () => {}, // called when 'New Level' button is pressed

      // pdom - Since we are setting the focusOnShowNode to be the first element in content, put the closeButton last
      closeButtonLastInPDOM: true
    }, options );

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

    const newLevelButton = new RectangularPushButton( merge( {}, buttonOptions, {
      content: new Text( vegasStrings.newLevel, { font: DEFAULT_BUTTONS_FONT } ),
      listener: options.newLevelButtonListener,
      baseColor: PhetColorScheme.PHET_LOGO_YELLOW
    } ) );

    const keepGoingButton = new RectangularPushButton( merge( {}, buttonOptions, {
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

    assert && assert( !options.focusOnShowNode );
    options.focusOnShowNode = newLevelButton;

    super( content, options );
  }
}

vegas.register( 'RewardDialog', RewardDialog );
export default RewardDialog;