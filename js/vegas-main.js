// Copyright 2014-2019, University of Colorado Boulder

/**
 * Main file for the vegas library demo.
 *
 * @author Sam Reid
 */
define( require => {
  'use strict';

  // modules
  const FiniteChallengesScreenView = require( 'VEGAS/demo/FiniteChallengesScreenView' );
  const InfiniteChallengesScreenView = require( 'VEGAS/demo/InfiniteChallengesScreenView' );
  const LevelSelectionScreenView = require( 'VEGAS/demo/LevelSelectionScreenView' );
  const Property = require( 'AXON/Property' );
  const RewardScreenView = require( 'VEGAS/demo/RewardScreenView' );
  const Screen = require( 'JOIST/Screen' );
  const Sim = require( 'JOIST/Sim' );
  const SimLauncher = require( 'JOIST/SimLauncher' );

  // strings
  const vegasTitleString = require( 'string!VEGAS/vegas.title' );

  const simOptions = {
    credits: {
      leadDesign: 'PhET'
    }
  };

  SimLauncher.launch( function() {
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
} );