// Copyright 2014-2015, University of Colorado Boulder

/**
 * Main file for the vegas library demo.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var Screen = require( 'JOIST/Screen' );
  var Sim = require( 'JOIST/Sim' );
  var SimLauncher = require( 'JOIST/SimLauncher' );
  var VegasScreenView = require( 'VEGAS/demo/VegasScreenView' );
  var RewardNodeScreenView = require( 'VEGAS/demo/RewardNodeScreenView' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  // strings
  var vegasTitleString = require( 'string!VEGAS/vegas.title' );

  var simOptions = {
    credits: {
      leadDesign: 'PhET'
    }
  };

  // Creates a rectangle filled with a specified color
  var createScreenIcon = function( color ) {
    return new Rectangle( 0, 0, Screen.HOME_SCREEN_ICON_SIZE.width, Screen.HOME_SCREEN_ICON_SIZE.height, { fill: color } );
  };

  SimLauncher.launch( function() {
    new Sim( vegasTitleString, [

      new Screen(
        function() {return {};},
        function( model ) {return new VegasScreenView();},
        {
          name: 'Vegas',
          backgroundColor: '#fff',
          homeScreenIcon: createScreenIcon( 'yellow' )
        }
      ),

      new Screen(
        function() {return {};},
        function( model ) {return new RewardNodeScreenView();},
        {
          name: 'Rewards',
          backgroundColor: '#fff',
          homeScreenIcon: createScreenIcon( 'blue' )
        }
      )
    ], simOptions ).start();
  } );
} );