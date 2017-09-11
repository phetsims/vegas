// Copyright 2013-2015, University of Colorado Boulder

/**
 * Audio player for the various sounds that are commonly used in PhET games.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Sound = require( 'VIBE/Sound' );
  var vegas = require( 'VEGAS/vegas' );

  // audio
  var boingSound = require( 'audio!VEGAS/boing' );
  var cheerSound = require( 'audio!VEGAS/cheer' );
  var dingSound = require( 'audio!VEGAS/ding' );
  var trumpetSound = require( 'audio!VEGAS/trumpet' );

  // constants
  var CORRECT_ANSWER = new Sound( dingSound );
  var WRONG_ANSWER = new Sound( boingSound );
  var IMPERFECT_SCORE = new Sound( trumpetSound );
  var PERFECT_SCORE = new Sound( cheerSound );

  /**
   * @param {Property.<boolean>} soundEnabledProperty
   * @constructor
   */
  function GameAudioPlayer( soundEnabledProperty ) {
    this.soundEnabledProperty = soundEnabledProperty; // @private
  }

  vegas.register( 'GameAudioPlayer', GameAudioPlayer );

  return inherit( Object, GameAudioPlayer, {

    /**
     * play the sound that indicates a correct answer
     * @public
     */
    correctAnswer: function() {
      if ( this.soundEnabledProperty.value ) {
        CORRECT_ANSWER.play();
      }
    },

    /**
     * play the sound that indicates an incorrect answer
     * @public
     */
    wrongAnswer: function() {
      if ( this.soundEnabledProperty.value ) {
        WRONG_ANSWER.play();
      }
    },

    /**
     * play the sound that indicates that the user completed the game but didn't earn any points
     * @public
     */
    gameOverZeroScore: function() {
      if ( this.soundEnabledProperty.value ) {
        WRONG_ANSWER.play();
      }
    },

    /**
     * play the sound that indicates that the user finished the game and got some correct and some incorrect answers
     * @public
     */
    gameOverImperfectScore: function() {
      if ( this.soundEnabledProperty.value ) {
        IMPERFECT_SCORE.play();
      }
    },

    /**
     * play the sound that indicates that the user finished the game and got a perfact score
     * @public
     */
    gameOverPerfectScore: function() {
      if ( this.soundEnabledProperty.value ) {
        PERFECT_SCORE.play();
      }
    }
  } );
} );