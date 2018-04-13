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
  var InfiniteStatusBar = require( 'VEGAS/InfiniteStatusBar' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var Range = require( 'DOT/Range' );
  var ScoreDisplayNumberAndStar = require( 'VEGAS/ScoreDisplayNumberAndStar' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var Text = require( 'SCENERY/nodes/Text' );
  var vegas = require( 'VEGAS/vegas' );

  // constants
  var SCORE_RANGE = new Range( 0, 1000 );

  /**
   * @constructor
   */
  function InfiniteChallengesScreenView() {

    ScreenView.call( this );

    var scoreProperty = new Property( 0 );

    // bar across the top
    var statusBar = new InfiniteStatusBar(
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