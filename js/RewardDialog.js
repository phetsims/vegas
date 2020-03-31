// Copyright 2018-2020, University of Colorado Boulder

/**
 * A dialog that the client displays when the user gets a specific number of stars.
 * See specification in https://github.com/phetsims/vegas/issues/59.
 *
 * @author Andrea Lin
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../axon/js/NumberProperty.js';
import inherit from '../../phet-core/js/inherit.js';
import merge from '../../phet-core/js/merge.js';
import PhetColorScheme from '../../scenery-phet/js/PhetColorScheme.js';
import PhetFont from '../../scenery-phet/js/PhetFont.js';
import HBox from '../../scenery/js/nodes/HBox.js';
import Image from '../../scenery/js/nodes/Image.js';
import Text from '../../scenery/js/nodes/Text.js';
import VBox from '../../scenery/js/nodes/VBox.js';
import RectangularPushButton from '../../sun/js/buttons/RectangularPushButton.js';
import Dialog from '../../sun/js/Dialog.js';
import phetGirlJugglingStarsImage from '../images/phet-girl-juggling-stars_png.js';
import ScoreDisplayNumberAndStar from './ScoreDisplayNumberAndStar.js';
import vegasStrings from './vegasStrings.js';
import vegas from './vegas.js';

const keepGoingString = vegasStrings.keepGoing;
const newLevelString = vegasStrings.newLevel;

// constants
const DEFAULT_BUTTONS_FONT = new PhetFont( 16 );
const DEFAULT_SCORE_DISPLAY_OPTIONS = {
  font: new PhetFont( { size: 30, weight: 'bold' } ),
  spacing: 6,
  starNodeOptions: {
    outerRadius: 20,
    innerRadius: 10,
    filledLineWidth: 2
  }
};

/**
 * @param {number} score
 * @param {Object} [options]
 * @constructor
 */
function RewardDialog( score, options ) {

  options = merge( {

    // RewardDialog options
    phetGirlScale: 0.6,
    scoreDisplayOptions: null, // {Object|null} options passed to ScoreDisplayNumberAndStar
    buttonsFont: DEFAULT_BUTTONS_FONT,
    buttonsWidth: 110, // {number} fixed width for both buttons
    buttonsYSpacing: 15,
    keepGoingButtonListener: function() {}, // called when 'Keep Going' button is pressed
    newLevelButtonListener: function() {} // called when 'New Level' button is pressed
  }, options );

  options.scoreDisplayOptions = merge( {}, DEFAULT_SCORE_DISPLAY_OPTIONS, options.numeratorOptions );

  const phetGirlNode = new Image( phetGirlJugglingStarsImage, {
    scale: options.phetGirlScale
  } );

  const scoreDisplay = new ScoreDisplayNumberAndStar( new NumberProperty( score ), options.scoreDisplayOptions );

  const buttonOptions = {
    font: options.buttonsFont,
    minWidth: options.buttonsWidth,
    maxWidth: options.buttonsWidth
  };

  const keepGoingButton = new RectangularPushButton( merge( {}, buttonOptions, {
    content: new Text( keepGoingString, { font: DEFAULT_BUTTONS_FONT } ),
    listener: options.keepGoingButtonListener,
    baseColor: 'white'
  } ) );

  const newLevelButton = new RectangularPushButton( merge( {}, buttonOptions, {
    content: new Text( newLevelString, { font: DEFAULT_BUTTONS_FONT } ),
    listener: options.newLevelButtonListener,
    baseColor: PhetColorScheme.PHET_LOGO_YELLOW
  } ) );

  const buttons = new VBox( {
    children: [ keepGoingButton, newLevelButton ],
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
    spacing: 40
  } );

  Dialog.call( this, content, options );
}

vegas.register( 'RewardDialog', RewardDialog );

inherit( Dialog, RewardDialog );
export default RewardDialog;