// Copyright 2013-2020, University of Colorado Boulder

/**
 * audio player for the various sounds that are commonly used in PhET games
 *
 * @author John Blanco
 */

import SoundClip from '../../tambo/js/sound-generators/SoundClip.js';
import soundManager from '../../tambo/js/soundManager.js';
import boingSound from '../sounds/boing_mp3.js';
import cheerSound from '../sounds/cheer_mp3.js';
import dingSound from '../sounds/ding_mp3.js';
import organSound from '../sounds/organ_mp3.js';
import trumpetSound from '../sounds/trumpet_mp3.js';
import vegas from './vegas.js';

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

vegas.register( 'GameAudioPlayer', GameAudioPlayer );
export default GameAudioPlayer;