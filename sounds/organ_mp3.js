/* eslint-disable */
import simLauncher from '../../joist/js/simLauncher.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,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rcqD2R7/qIYKJG/9Azn/82LE9SF8MkAoecWJ3+7ln//p3eVssagYfLLVWpFsBSTS9XGPBlhsglzxxYUqGQUUNti0RsFhRx8L8JiBRrDeuRaKSxIstMLx8EErzlr28r2zSlzQhwLsXjxSOmw+j+T5ViiEuq6zgsSFTpqJvTfXUtUjxGraSKGswqMn+ZK1zIUgVrr97ZP/3G////xX1/dP9Jys1+lO7aMz7lys//NixOwfEipIPHtFiJOxrXZUs7rYzIxbmIyEc6HcYUqCyhFuY0NODixGI01CvRnMLyPi8NsYV0K27mL1NszULTTZPdysOoT4Iz++320JhqmYI9EWCuz22XTdP8J5wyA9PL/MxgWVssmZi+lWyShpEhuj6163+YnnqqCWa3V0v/q6jX6v7f/v//29/pps1J/7z/7/renjtfe4pryNm//zYsT/I+xKOAp8hTWGp2hoNuo92gVXUxxXmNQ9W2LRxPy219LYugk1ohxcqIpMQU1F/xBanxmeWRua0Ozw/o0VeTerG9bvcSrkpt+DvtR1yTRvg+YGt4z8T/otwfB9mrbtJA/dTuPlpfrWk0HP+pjoe7+r6mlRoR/dOenSjLrn06//9eaR/9/Pt7Kltkrnos7bMZmWU33qqGlj1JX/82DE/yPsfjAAe014sUS8R6js2YZZTnQGwuaOKSedMks+31kX/f2dcRhaEJVMQU1FMy45OS4zVVVVIAIFv5GAd6zrKjRF8MjrgPlyauokYTR6CTy4RBUMtr6qwAl8WCTsWtWh0+nu4lytvtQzGpNXqGjnSk03DNrLsnfO2H+UzWrrsX26lOp/+RHz/hRJclJGHI7/Ph5G3XaHsfX/82LE+iKsgjAKec18jt/eRDrF1R/Ilnir0k1MoR7D8ZHRTOiR9yEorMFd2BOqTICEWMZSzIIlmEQKzlVn2QweKnKVjX1Yxqt6lhn6hWMz/opZjGMbXob/Q3/qFayGM/Qz/ylLmfyt0ev/T/NmM/0KUrSgIluv9WrXce1at+s7WZnDlS09b2TkxJRkfPVWuphCUtPMxLnkoSiUqOT3//NixPIgjII1lkFG/KEcQOolruW2uW2xWJ3zY6EZedEoSo2Vq11adXW1rWToykxBTUUzLjk5LjOqqpdsIyaZkZlTRGRbTMjMqYSMi2mZGZU0RkW0zIzKmEjIj/mRk1/kZH/+0IyMy3IyIyp/+ZEZU8zL///yMiMv/zI7q6uvm7GUVlUk0kk0k0l4ThV1ebGSqFEQkQyHhsgIy6Bs8f/zYsT+I7SCCCgomVwwpIhkaEQyNDZARoG2HNKrKpJqLqrKrJpLqLppJ0GLVUxBTUUzLjk5LjNVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/82DE9SEMbTGKCFNdVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU=';
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