/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,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';
const soundByteArray = base64SoundToByteArray( phetAudioContext, soundURI );
const unlock = asyncLoader.createLock( soundURI );
const wrappedAudioBuffer = new WrappedAudioBuffer();
const onDecodeSuccess = decodedAudio => {
  wrappedAudioBuffer.audioBufferProperty.set( decodedAudio );
  unlock();
};
const onDecodeError = decodeError => {
  console.warn( 'decode of audio data failed, using stubbed sound, error: ' + decodeError );
  wrappedAudioBuffer.audioBufferProperty.set( phetAudioContext.createBuffer( 1, 0, phetAudioContext.sampleRate ) );
  unlock();
};
phetAudioContext.decodeAudioData( soundByteArray.buffer, onDecodeSuccess, onDecodeError );
export default wrappedAudioBuffer;