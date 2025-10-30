// Copyright 2014-2025, University of Colorado Boulder

/**
 * Main file for the vegas library demo.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Property from '../../axon/js/Property.js';
import Screen from '../../joist/js/Screen.js';
import Sim, { SimOptions } from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import TModel from '../../joist/js/TModel.js';
import BasicActionsKeyboardHelpSection from '../../scenery-phet/js/keyboard/help/BasicActionsKeyboardHelpSection.js';
import KeyboardHelpSectionRow from '../../scenery-phet/js/keyboard/help/KeyboardHelpSectionRow.js';
import TwoColumnKeyboardHelpContent from '../../scenery-phet/js/keyboard/help/TwoColumnKeyboardHelpContent.js';
import TextKeyNode from '../../scenery-phet/js/keyboard/TextKeyNode.js';
import Node from '../../scenery/js/nodes/Node.js';
import Tandem from '../../tandem/js/Tandem.js';
import ComponentsScreenView from './demo/components/ComponentsScreenView.js';
import FiniteChallengesScreenView from './demo/FiniteChallengesScreenView.js';
import InfiniteChallengesScreenView from './demo/InfiniteChallengesScreenView.js';
import GameShortcutsKeyboardHelpSection from './keyboard/GameShortcutsKeyboardHelpSection.js';
import VegasStrings from './VegasStrings.js';

// constants
const vegasTitleStringProperty = VegasStrings.vegas.titleStringProperty;

const simOptions: SimOptions = {
  credits: {
    leadDesign: 'PhET'
  }
};

class VegasModel implements TModel {
  public reset(): void { /* nothing to do */ }
}

function createEmptyModel(): VegasModel {
  return new VegasModel();
}

// Demonstrate the keyboard help content for game shortcuts.
function createKeyboardHelpNode(): Node {

  // Game shortcuts on the left, basic actions on the right
  return new TwoColumnKeyboardHelpContent(
    [ new GameShortcutsKeyboardHelpSection( {

      // You can put additional rows in the game shortcuts section if desired.
      additionalContent: [
        KeyboardHelpSectionRow.labelWithIcon( 'Do a thing', TextKeyNode.space(), {
          labelInnerContent: 'Do a thing with spacebar.'
        } )
      ]
    } ) ],
    [ new BasicActionsKeyboardHelpSection() ]
  );
}

simLauncher.launch( () => {
  new Sim( vegasTitleStringProperty, [

    new Screen(
      createEmptyModel,
      () => new ComponentsScreenView(), {
        name: VegasStrings.screen.componentsStringProperty,
        backgroundColorProperty: new Property( 'white' ),
        createKeyboardHelpNode: createKeyboardHelpNode,
        tandem: Tandem.OPT_OUT
      } ),

    new Screen(
      createEmptyModel,
      () => new FiniteChallengesScreenView(), {
        name: VegasStrings.screen.finiteChallengesStringProperty,
        backgroundColorProperty: new Property( 'white' ),
        createKeyboardHelpNode: createKeyboardHelpNode,
        tandem: Tandem.OPT_OUT
      } ),

    new Screen(
      createEmptyModel,
      () => new InfiniteChallengesScreenView(), {
        name: VegasStrings.screen.infiniteChallengesStringProperty,
        backgroundColorProperty: new Property( 'white' ),
        createKeyboardHelpNode: createKeyboardHelpNode,
        tandem: Tandem.OPT_OUT
      } )
  ], simOptions ).start();
} );