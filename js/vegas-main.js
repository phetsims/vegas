// Copyright 2014-2017, University of Colorado Boulder

/**
 * Main file for the vegas library demo.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var Property = require( 'AXON/Property' );
  var RewardScreenView = require( 'VEGAS/demo/RewardScreenView' );
  var Screen = require( 'JOIST/Screen' );
  var Sim = require( 'JOIST/Sim' );
  var SimLauncher = require( 'JOIST/SimLauncher' );
  var VegasScreenView = require( 'VEGAS/demo/VegasScreenView' );

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
        function() {return {};},
        function( model ) { return new VegasScreenView(); }, {
          name: 'Vegas',
          backgroundColorProperty: new Property( '#fff' )
        } ),

      new Screen(
        function() {return {};},
        function( model ) { return new RewardScreenView(); }, {
          name: 'Reward',
          backgroundColorProperty: new Property( '#fff' )
        } )
    ], simOptions ).start();
  } );
} );