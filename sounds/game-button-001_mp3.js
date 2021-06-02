/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,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22mlALTRCLxwpLHnQLOoUgirQ/Y/7Pb1uu9Pv6avtl0AnkclQpK0wyCg0yi47bhhVrp2gzAaKUgciIPg1HMLakffKp+Sm015OOUNSW17RA2nt2jajcgDZuCWhTwEQemn6LzFOEpEfBSGn3SqFGlXF+pvKdS0F45997LpFPGrs99WNHjoRv50IP/7MMT/gAqJJRMjGGvw1Q6j6BCNfsvXEgGJJf/PAokvkJcuhFxsVnXY/6a/2s//6j7glc0w6QqVJISYcabbaUEhSiO6Mb4Wc5G+R/HsiRzEV5eXprRDFNFbWl1G35IZU5tiEcbFz0fne9AAANIyhHOJaUSrQVeHEtNnHO2Zki2kXzskajJtVdVKNKAjMftnqVAUAlVVJgICa+CAh//7MsTyAAppJRVDGG3wZQBnNACIBl/h0ozNfDCoBUK3AxhRMNj+N+GPY6JVT9dRMOHShqJ4KUxBTUUzLjk5LjVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+zLE/QAL2SUE4zzAkJAAZXQAiAZVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUxBTUUzLjk5LjVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//syxP+ADT0c9Cwwy5iBgCXwAIwGVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7MMT+AAY8wyWghE/xS6Sf5GGOzlVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7MsS7g8AAAaQAAAAgAAA0gAAABFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU=';
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