// Copyright 2014-2018, University of Colorado Boulder

/**
 * Main file for the vegas library demo.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var LevelSelectionScreenView = require( 'VEGAS/demo/LevelSelectionScreenView' );
  var Property = require( 'AXON/Property' );
  var RewardScreenView = require( 'VEGAS/demo/RewardScreenView' );
  var Screen = require( 'JOIST/Screen' );
  var Sim = require( 'JOIST/Sim' );
  var SimLauncher = require( 'JOIST/SimLauncher' );
  var InfiniteChallengesScreenView = require( 'VEGAS/demo/InfiniteChallengesScreenView' );
  var FiniteChallengesScreenView = require( 'VEGAS/demo/FiniteChallengesScreenView' );

  // strings
  var vegasTitleString = require( 'string!VEGAS/vegas.title' );

  var simOptions = {
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
          backgroundColorProperty: new Property( 'rgb( 214, 233, 254 )' )
        } ),

      new Screen(
        function() { return {}; },
        function( model ) { return new InfiniteChallengesScreenView(); }, {
          name: 'Infinite Challenges',
          backgroundColorProperty: new Property( 'rgb( 214, 233, 254 )' )
        } ),

      new Screen(
        function() { return {}; },
        function( model ) { return new RewardScreenView(); }, {
          name: 'Reward',
          backgroundColorProperty: new Property( 'rgb( 248, 227, 226 )' )
        } )
    ], simOptions ).start();
  } );
} );