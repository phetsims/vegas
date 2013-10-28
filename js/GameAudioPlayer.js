// Copyright 2002-2013, University of Colorado Boulder

/**
 * Audio player for the various sounds that are commonly used in PhET games.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // Imports
  var Sound = require( 'VIBE/Sound' );
  var correctAnswerSound = require( 'audio!VEGAS/correctAnswer' );
  var wrongAnswerSound = require( 'audio!VEGAS/incorrectAnswer' );
  var imperfectScoreSound = require( 'audio!VEGAS/gameOver-imperfectScore' );
  var perfectScoreSound = require( 'audio!VEGAS/gameOver-perfectScore2' );

  // Constants
  var CORRECT_ANSWER = new Sound( correctAnswerSound );
  var WRONG_ANSWER = new Sound( wrongAnswerSound );
  var IMPERFECT_SCORE = new Sound( imperfectScoreSound );
  var PERFECT_SCORE = new Sound( perfectScoreSound );

  /**
   * @param soundEnabledProperty
   * @constructor
   */
  function GameAudioPlayer( soundEnabledProperty ) {
    this.soundEnabledProperty = soundEnabledProperty;
  }

  GameAudioPlayer.prototype.correctAnswer = function() {
    if ( this.soundEnabledProperty.value ) {
      CORRECT_ANSWER.play();
    }
  };

  GameAudioPlayer.prototype.wrongAnswer = function() {
    if ( this.soundEnabledProperty.value ) {
      WRONG_ANSWER.play();
    }
  };

  GameAudioPlayer.prototype.gameOverZeroScore = function() {
    if ( this.soundEnabledProperty.value ) {
      WRONG_ANSWER.play();
    }
  };

  GameAudioPlayer.prototype.gameOverImperfectScore = function() {
    if ( this.soundEnabledProperty.value ) {
      IMPERFECT_SCORE.play();
    }
  };

  GameAudioPlayer.prototype.gameOverPerfectScore = function() {
    if ( this.soundEnabledProperty.value ) {
      PERFECT_SCORE.play();
    }
  };

  return GameAudioPlayer;
} );