// Copyright 2014-2018, University of Colorado Boulder

/**
 * Demonstrates vegas UI components.
 *
 * @author Sam Reid
 * @author Andrea Lin
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var LevelCompletedNode = require( 'VEGAS/LevelCompletedNode' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var vegas = require( 'VEGAS/vegas' );

  /**
   * @constructor
   */
  function FiniteChallengesScreenView() {

    var self = this;
    ScreenView.call( this );

    //TODO add ScoreboardBar

    // LevelCompletedNode that cycles through score values when you press 'Continue' button
    var score = 0;
    var addLevelCompletedNode = function() {
      var maxScore = 12;
      var levelCompletedNode = new LevelCompletedNode( 7, score, maxScore, 4, true, 77, 74, true, function() {
        console.log( 'continue' );
        score++;
        if ( score > maxScore ) {
          score = 0;
        }
        levelCompletedNode.detach();
        addLevelCompletedNode();
      }, {
        center: self.layoutBounds.center
      } );
      self.addChild( levelCompletedNode );
    };
    addLevelCompletedNode();
  }

  vegas.register( 'FiniteChallengesScreenView', FiniteChallengesScreenView );

  return inherit( ScreenView, FiniteChallengesScreenView );
} );