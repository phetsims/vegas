// Copyright 2014-2018, University of Colorado Boulder

/**
 * Demonstrates the challenge UI for a game that has an infinite number of challenges per level.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const HBox = require( 'SCENERY/nodes/HBox' );
  const HSlider = require( 'SUN/HSlider' );
  const InfiniteStatusBar = require( 'VEGAS/InfiniteStatusBar' );
  const inherit = require( 'PHET_CORE/inherit' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Property = require( 'AXON/Property' );
  const Range = require( 'DOT/Range' );
  const ScreenView = require( 'JOIST/ScreenView' );
  const StatusBar = require( 'VEGAS/StatusBar' );
  const Text = require( 'SCENERY/nodes/Text' );
  const vegas = require( 'VEGAS/vegas' );

  // constants
  var SCORE_RANGE = new Range( 0, 1000 );

  /**
   * @constructor
   */
  function InfiniteChallengesScreenView() {

    ScreenView.call( this );

    var scoreProperty = new Property( 0 );

    // bar across the top
    var messageNode = new Text( 'Your Node goes here', {
      font: StatusBar.DEFAULT_FONT
    } );
    var statusBar = new InfiniteStatusBar( this.layoutBounds, this.visibleBoundsProperty, messageNode, scoreProperty, {
      backButtonListener: function() { console.log( 'back' ); }
    } );
    this.addChild( statusBar );

    // slider for testing score changes
    var scoreSlider = new HBox( {
      right: this.layoutBounds.right - 20,
      top: statusBar.bottom + 30,
      children: [
        new Text( 'Score: ', { font: new PhetFont( 20 ) } ),
        new HSlider( scoreProperty, SCORE_RANGE )
      ]
    } );

    this.addChild( scoreSlider );
  }

  vegas.register( 'InfiniteChallengesScreenView', InfiniteChallengesScreenView );

  return inherit( ScreenView, InfiniteChallengesScreenView );
} );