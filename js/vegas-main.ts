// Copyright 2014-2022, University of Colorado Boulder

/**
 * Main file for the vegas library demo.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Property from '../../axon/js/Property.js';
import Screen from '../../joist/js/Screen.js';
import Sim from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import Tandem from '../../tandem/js/Tandem.js';
import FiniteChallengesScreenView from './demo/FiniteChallengesScreenView.js';
import InfiniteChallengesScreenView from './demo/InfiniteChallengesScreenView.js';
import LevelSelectionScreenView from './demo/LevelSelectionScreenView.js';
import RewardScreenView from './demo/RewardScreenView.js';
import vegasStrings from './vegasStrings.js';

// constants
const vegasTitleString = vegasStrings.vegas.title;

const simOptions = {
  credits: {
    leadDesign: 'PhET'
  }
};

function createEmptyModel() {
  return {};
}

simLauncher.launch( () => {
  new Sim( vegasTitleString, [

    new Screen(
      createEmptyModel,
      () => new LevelSelectionScreenView(), {
        name: 'Level Selection',
        backgroundColorProperty: new Property( 'white' ),
        tandem: Tandem.OPT_OUT
      } ),

    new Screen(
      createEmptyModel,
      () => new FiniteChallengesScreenView(), {
        name: 'Finite Challenges',
        backgroundColorProperty: new Property( 'white' ),
        tandem: Tandem.OPT_OUT
      } ),

    new Screen(
      createEmptyModel,
      () => new InfiniteChallengesScreenView(), {
        name: 'Infinite Challenges',
        backgroundColorProperty: new Property( 'white' ),
        tandem: Tandem.OPT_OUT
      } ),

    new Screen(
      createEmptyModel,
      () => new RewardScreenView(), {
        name: 'Reward',
        backgroundColorProperty: new Property( 'white' ),
        tandem: Tandem.OPT_OUT
      } )
  ], simOptions ).start();
} );