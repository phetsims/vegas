// Copyright 2018, University of Colorado Boulder

/**
 * Demonstrates the challenge UI for a game that has an infinite number of challenges per level.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var HBox = require( 'SCENERY/nodes/HBox' );
  var HSlider = require( 'SUN/HSlider' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var ScoreDisplayNumberAndStar = require( 'VEGAS/ScoreDisplayNumberAndStar' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var StatusBar = require( 'VEGAS/StatusBar' );
  var Text = require( 'SCENERY/nodes/Text' );
  var vegas = require( 'VEGAS/vegas' );

  // constants
  var PERFECT_SCORE = 1000;

  /**
   * @constructor
   */
  function InfiniteChallengesScreenView() {

    ScreenView.call( this );

    var scoreProperty = new Property( 0 );

    var statusBar = new StatusBar(
      this.layoutBounds,
      this.visibleBoundsProperty,
      new Text( 'Your Node goes here', {
        font: new PhetFont( 20 ),
        fill: 'white'
      } ),
      new ScoreDisplayNumberAndStar( scoreProperty ), {
        backButtonListener: function() { scoreProperty.reset(); }
      } );
    this.addChild( statusBar );

    var scoreSlider = new HBox( {
      right: this.layoutBounds.right - 20,
      top: statusBar.bottom + 30,
      children: [
        new Text( 'Score: ', { font: new PhetFont( 20 ) } ),
        new HSlider( scoreProperty, { min: 0, max: PERFECT_SCORE } )
      ]
    } );

    this.addChild( scoreSlider );
  }

  vegas.register( 'InfiniteChallengesScreenView', InfiniteChallengesScreenView );

  return inherit( ScreenView, InfiniteChallengesScreenView );
} );