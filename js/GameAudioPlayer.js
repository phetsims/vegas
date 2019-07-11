// Copyright 2013-2019, University of Colorado Boulder

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

  // constants
  const ding = new SoundClip( dingSound );
  const boing = new SoundClip( boingSound );
  const trumpet = new SoundClip( trumpetSound );
  const cheer = new SoundClip( cheerSound );
  const organ = new SoundClip( organSound );

  let isInitialized = false;

  /**
   * A function that adds all the sounds to the sound manager
   * Only does anything on the first time it is called
   */
  function addSoundsToSoundGenerator() {
    if ( isInitialized ) {
      return;
    }
    soundManager.addSoundGenerator( ding );
    soundManager.addSoundGenerator( boing );
    soundManager.addSoundGenerator( trumpet );
    soundManager.addSoundGenerator( cheer );
    soundManager.addSoundGenerator( organ );
    isInitialized = true;
  }

  /**
   * @constructor
   */
  class GameAudioPlayer {

    constructor() {
      addSoundsToSoundGenerator();
    }

    /**
     * play the sound that indicates a correct answer
     * @public
     */
    correctAnswer() {
      ding.play();
    }

    /**
     * play the sound that indicates an incorrect answer
     * @public
     */
    wrongAnswer() {
      boing.play();
    }

    /**
     * play the sound that indicates a challenge has been completed
     * @public
     */
    challengeComplete() {
      organ.play();
    }

    /**
     * play the sound that indicates that the user completed the game but didn't earn any points
     * @public
     */
    gameOverZeroScore() {
      boing.play();
    }

    /**
     * play the sound that indicates that the user finished the game and got some correct and some incorrect answers
     * @public
     */
    gameOverImperfectScore() {
      trumpet.play();
    }

    /**
     * play the sound that indicates that the user finished the game and got a perfact score
     * @public
     */
    gameOverPerfectScore() {
      cheer.play();
    }
  }

  return vegas.register( 'GameAudioPlayer', GameAudioPlayer );
} );