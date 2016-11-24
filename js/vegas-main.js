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
  var Property = require( 'AXON/Property' );
  var Color = require( 'SCENERY/util/Color' );

  // strings
  var vegasTitleString = require( 'string!VEGAS/vegas.title' );

  var simOptions = {
    credits: {
      leadDesign: 'PhET'
    }
  };

  // Creates a rectangle filled with a specified color
  var createScreenIcon = function( color ) {
    return new Rectangle( 0, 0, Screen.MINIMUM_HOME_SCREEN_ICON_SIZE.width, Screen.MINIMUM_HOME_SCREEN_ICON_SIZE.height, { fill: color } );
  };

  SimLauncher.launch( function() {
    new Sim( vegasTitleString, [

      new Screen(
        function() {return {};},
        function( model ) {return new VegasScreenView();},
        {
          name: 'Vegas',
          backgroundColorProperty: new Property( Color.toColor( '#fff' ) ),
          homeScreenIcon: createScreenIcon( 'yellow' )
        }
      ),

      new Screen(
        function() {return {};},
        function( model ) {return new RewardNodeScreenView();},
        {
          name: 'Rewards',
          backgroundColorProperty: new Property( Color.toColor( '#fff' ) ),
          homeScreenIcon: createScreenIcon( 'blue' )
        }
      )
    ], simOptions ).start();
  } );
} );