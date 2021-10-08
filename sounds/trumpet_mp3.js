/* eslint-disable */
import simLauncher from '../../joist/js/simLauncher.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,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';
const soundByteArray = base64SoundToByteArray( phetAudioContext, soundURI );
const unlock = simLauncher.createLock( soundURI );
const wrappedAudioBuffer = new WrappedAudioBuffer();

// safe way to unlock
let unlocked = false;
const safeUnlock = () => {
  if ( !unlocked ) {
    unlock();
    unlocked = true;
  }
};

const onDecodeSuccess = decodedAudio => {
  if ( wrappedAudioBuffer.audioBufferProperty.value === null ) {
    wrappedAudioBuffer.audioBufferProperty.set( decodedAudio );
    safeUnlock();
  }
};
const onDecodeError = decodeError => {
  console.warn( 'decode of audio data failed, using stubbed sound, error: ' + decodeError );
  wrappedAudioBuffer.audioBufferProperty.set( phetAudioContext.createBuffer( 1, 1, phetAudioContext.sampleRate ) );
  safeUnlock();
};
const decodePromise = phetAudioContext.decodeAudioData( soundByteArray.buffer, onDecodeSuccess, onDecodeError );
if ( decodePromise ) {
  decodePromise
    .then( decodedAudio => {
      if ( wrappedAudioBuffer.audioBufferProperty.value === null ) {
        wrappedAudioBuffer.audioBufferProperty.set( decodedAudio );
        safeUnlock();
      }
    } )
    .catch( e => {
      console.warn( 'promise rejection caught for audio decode, error = ' + e );
      safeUnlock();
    } );
}
export default wrappedAudioBuffer;