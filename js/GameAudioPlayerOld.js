// Copyright 2019, University of Colorado Boulder

/**
 * Audio player for the various sounds that are commonly used in PhET games.
 *
 * @deprecated - This is the version that was based on the "vibe" sound library, we have since migrated to "tambo",
 * do not use this for new development.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Sound = require( 'VIBE/Sound' );
  var vegas = require( 'VEGAS/vegas' );

  // sounds
  var boingSound = require( 'sound!VEGAS/boing.mp3' );
  var cheerSound = require( 'sound!VEGAS/cheer.mp3' );
  var dingSound = require( 'sound!VEGAS/ding.mp3' );
  var trumpetSound = require( 'sound!VEGAS/trumpet.mp3' );
  var organSound = require( 'sound!VEGAS/organ.mp3' );

  // constants
  var CORRECT_ANSWER = new Sound( dingSound );
  var WRONG_ANSWER = new Sound( boingSound );
  var IMPERFECT_SCORE = new Sound( trumpetSound );
  var PERFECT_SCORE = new Sound( cheerSound );
  var CHALLENGE_SCORE = new Sound( organSound );

  /**
   * @param {Property.<boolean>} soundEnabledProperty
   * @constructor
   */
  function GameAudioPlayerOld( soundEnabledProperty ) {
    this.soundEnabledProperty = soundEnabledProperty; // @private
  }

  vegas.register( 'GameAudioPlayerOld', GameAudioPlayerOld );

  return inherit( Object, GameAudioPlayerOld, {

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
     * play the sound that indicates a challenge has been completed
     * @public
     */
    challengeComplete: function() {
      if ( this.soundEnabledProperty.value ) {
        CHALLENGE_SCORE.play();
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