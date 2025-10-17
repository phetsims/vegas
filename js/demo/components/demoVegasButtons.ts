// Copyright 2025, University of Colorado Boulder

/**
 * Demo for various pre-made buttons in Vegas
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Font from '../../../../scenery/js/util/Font.js';
import CheckButton from '../../buttons/CheckButton.js';
import GameInfoButton from '../../buttons/GameInfoButton.js';
import GameTimerToggleButton from '../../buttons/GameTimerToggleButton.js';
import NextButton from '../../buttons/NextButton.js';
import ShowAnswerButton from '../../buttons/ShowAnswerButton.js';
import TryAgainButton from '../../buttons/TryAgainButton.js';

const BUTTON_FONT = new Font( { size: 24 } );

export default function demoVegasButtons( layoutBounds: Bounds2 ): Node {

  const labelText = new Text( 'Vegas Buttons Demo', { fontSize: 50 } );
  const checkButton = new CheckButton( { font: BUTTON_FONT } );
  const gameInfoButton = new GameInfoButton();
  const gameTimerToggleButton = new GameTimerToggleButton( new Property( true ) );
  const nextButton = new NextButton( { font: BUTTON_FONT } );
  const showAnswerButton = new ShowAnswerButton( { font: BUTTON_FONT } );
  const tryAgainButton = new TryAgainButton( { font: BUTTON_FONT } );

  return new VBox( {
    spacing: 20,
    center: layoutBounds.center,
    align: 'left',
    children: [
      labelText,
      checkButton,
      gameInfoButton,
      gameTimerToggleButton,
      nextButton,
      showAnswerButton,
      tryAgainButton
    ]
  } );
}