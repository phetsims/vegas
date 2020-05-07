// Copyright 2014-2020, University of Colorado Boulder

/**
 * Main file for the vegas library demo.
 *
 * @author Sam Reid
 */

import Property from '../../axon/js/Property.js';
import Screen from '../../joist/js/Screen.js';
import Sim from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import FiniteChallengesScreenView from './demo/FiniteChallengesScreenView.js';
import InfiniteChallengesScreenView from './demo/InfiniteChallengesScreenView.js';
import LevelSelectionScreenView from './demo/LevelSelectionScreenView.js';
import RewardScreenView from './demo/RewardScreenView.js';
import vegasStrings from './vegasStrings.js';

const vegasTitleString = vegasStrings.vegas.title;

const simOptions = {
  credits: {
    leadDesign: 'PhET'
  }
};

simLauncher.launch( function() {
  new Sim( vegasTitleString, [

    new Screen(
      function() { return {}; },
      function( model ) { return new LevelSelectionScreenView(); }, {
        name: 'Level Selection',
        backgroundColorProperty: new Property( 'white' )
      } ),

    new Screen(
      function() { return {}; },
      function( model ) { return new FiniteChallengesScreenView(); }, {
        name: 'Finite Challenges',
        backgroundColorProperty: new Property( 'white' )
      } ),

    new Screen(
      function() { return {}; },
      function( model ) { return new InfiniteChallengesScreenView(); }, {
        name: 'Infinite Challenges',
        backgroundColorProperty: new Property( 'white' )
      } ),

    new Screen(
      function() { return {}; },
      function( model ) { return new RewardScreenView(); }, {
        name: 'Reward',
        backgroundColorProperty: new Property( 'white' )
      } )
  ], simOptions ).start();
} );