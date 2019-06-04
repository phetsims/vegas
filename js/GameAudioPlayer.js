// Copyright 2013-2018, University of Colorado Boulder

/**
 * audio player for the various sounds that are commonly used in PhET games
 *
 * @author John Blanco
 */
define( require => {
  'use strict';

  // modules
  const SoundClip = require( 'TAMBO/sound-generators/SoundClip' );
  const soundManager = require( 'TAMBO/soundManager' );
  const vegas = require( 'VEGAS/vegas' );

  // sounds
  const boingSound = require( 'sound!VEGAS/boing.mp3' );
  const cheerSound = require( 'sound!VEGAS/cheer.mp3' );
  const dingSound = require( 'sound!VEGAS/ding.mp3' );
  const trumpetSound = require( 'sound!VEGAS/trumpet.mp3' );
  const organSound = require( 'sound!VEGAS/organ.mp3' );

  /**
   * @constructor
   */
  class GameAudioPlayer {

    constructor() {

      // create and register the sound clips
      this.ding = new SoundClip( dingSound );
      soundManager.addSoundGenerator( this.ding );
      this.boing = new SoundClip( boingSound );
      soundManager.addSoundGenerator( this.boing );
      this.trumpet = new SoundClip( trumpetSound );
      soundManager.addSoundGenerator( this.trumpet );
      this.cheer = new SoundClip( cheerSound );
      soundManager.addSoundGenerator( this.cheer );
      this.organ = new SoundClip( organSound );
      soundManager.addSoundGenerator( this.organ );
    }

    /**
     * play the sound that indicates a correct answer
     * @public
     */
    correctAnswer() {
      this.ding.play();
    }

    /**
     * play the sound that indicates an incorrect answer
     * @public
     */
    wrongAnswer() {
      this.boing.play();
    }

    /**
     * play the sound that indicates a challenge has been completed
     * @public
     */
    challengeComplete() {
      this.organ.play();
    }

    /**
     * play the sound that indicates that the user completed the game but didn't earn any points
     * @public
     */
    gameOverZeroScore() {
      this.boing.play();
    }

    /**
     * play the sound that indicates that the user finished the game and got some correct and some incorrect answers
     * @public
     */
    gameOverImperfectScore() {
      this.trumpet.play();
    }

    /**
     * play the sound that indicates that the user finished the game and got a perfact score
     * @public
     */
    gameOverPerfectScore() {
      this.cheer.play();
    }
  }

  return vegas.register( 'GameAudioPlayer', GameAudioPlayer );
} );