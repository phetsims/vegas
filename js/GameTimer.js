// Copyright 2013-2020, University of Colorado Boulder

/**
 * Game timer, keeps track of the elapsed time in the game using "wall clock" time. The frame rate of this clock is
 * sufficient for displaying a game timer in "seconds", but not for driving smooth animation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../axon/js/BooleanProperty.js';
import NumberProperty from '../../axon/js/NumberProperty.js';
import stepTimer from '../../axon/js/stepTimer.js';
import StringUtils from '../../phetcommon/js/util/StringUtils.js';
import vegas from './vegas.js';
import vegasStrings from './vegasStrings.js';

class GameTimer {

  constructor() {

    // @public seconds since the timer was started
    this.elapsedTimeProperty = new NumberProperty( 0 );
    this.isRunningProperty = new BooleanProperty( false );

    this.intervalId = null; // @private
  }

  // @public
  reset() {
    this.elapsedTimeProperty.reset();
    this.isRunningProperty.reset();
  }

  /**
   * Starts the timer. This is a no-op if the timer is already running.
   * @public
   */
  start() {
    if ( !this.isRunningProperty.value ) {
      this.elapsedTimeProperty.value = 0;
      this.intervalId = stepTimer.setInterval( () => {
        this.elapsedTimeProperty.value = this.elapsedTimeProperty.value + 1;
      }, 1000 ); // fire once per second
      this.isRunningProperty.value = true;
    }
  }

  /**
   * Stops the timer. This is a no-op if the timer is already stopped.
   * @public
   */
  stop() {
    if ( this.isRunningProperty.value ) {
      stepTimer.clearInterval( this.intervalId );
      this.intervalId = null;
      this.isRunningProperty.value = false;
    }
  }

  /**
   * Convenience function for restarting the timer.
   * @public
   */
  restart() {
    this.stop();
    this.start();
  }

  /**
   * Formats a value representing seconds into H:MM:SS (localized).
   * @param {number} time in seconds
   * @returns {string}
   * @public
   */
  static formatTime( time ) {

    const hours = Math.floor( time / 3600 );
    const minutes = Math.floor( ( time - ( hours * 3600 ) ) / 60 );
    const seconds = Math.floor( time - ( hours * 3600 ) - ( minutes * 60 ) );

    const minutesString = ( minutes > 9 || hours === 0 ) ? minutes : ( `0${minutes}` );
    const secondsString = ( seconds > 9 ) ? seconds : ( `0${seconds}` );

    if ( hours > 0 ) {
      return StringUtils.format( vegasStrings.pattern[ '0hours' ][ '1minutes' ][ '2seconds' ], hours, minutesString, secondsString );
    }
    else {
      return StringUtils.format( vegasStrings.pattern[ '0minutes' ][ '1seconds' ], minutesString, secondsString );
    }
  }
}

vegas.register( 'GameTimer', GameTimer );
export default GameTimer;