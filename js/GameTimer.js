// Copyright 2013-2019, University of Colorado Boulder

/**
 * Game timer, keeps track of the elapsed time in the game using "wall clock" time. The frame rate of this clock is
 * sufficient for displaying a game timer in "seconds", but not for driving smooth animation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const Property = require( 'AXON/Property' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const timer = require( 'AXON/timer' );
  const vegas = require( 'VEGAS/vegas' );

  // strings
  const pattern0Hours1Minutes2SecondsString = require( 'string!VEGAS/pattern.0hours.1minutes.2seconds' );
  const pattern0Minutes1SecondsString = require( 'string!VEGAS/pattern.0minutes.1seconds' );

  /**
   * @constructor
   */
  function GameTimer() {
    
    // @public seconds since the timer was started
    this.elapsedTimeProperty = new Property( 0 );
    this.isRunningProperty = new Property( false );
    
    this.intervalId = null; // @private
  }

  vegas.register( 'GameTimer', GameTimer );

  return inherit( Object, GameTimer, {
    
    // @public
    reset: function(){
      this.elapsedTimeProperty.reset();
      this.isRunningProperty.reset();
    },

    /**
     * Starts the timer. This is a no-op if the timer is already running.
     * @public
     */
    start: function() {
      if ( !this.isRunningProperty.value ) {
        const self = this;
        self.elapsedTimeProperty.value = 0;
        self.intervalId = timer.setInterval( function() {
          //TODO will this be accurate, or should we compute elapsed time and potentially skip some time values?
          self.elapsedTimeProperty.value = self.elapsedTimeProperty.value + 1;
        }, 1000 ); // fire once per second
        self.isRunningProperty.value = true;
      }
    },

    /**
     * Stops the timer. This is a no-op if the timer is already stopped.
     * @public
     */
    stop: function() {
      if ( this.isRunningProperty.value ) {
        timer.clearInterval( this.intervalId );
        this.intervalId = null;
        this.isRunningProperty.value = false;
      }
    },

    /**
     * Convenience function for restarting the timer.
     * @public
     */
    restart: function() {
      this.stop();
      this.start();
    }
  }, {

    /**
     * Formats a value representing seconds into H:MM:SS (localized).
     * @param {number} time in seconds
     * @returns {string}
     * @public
     * @static
     */
    formatTime: function( time ) {

      const hours = Math.floor( time / 3600 );
      const minutes = Math.floor( (time - (hours * 3600)) / 60 );
      const seconds = Math.floor( time - (hours * 3600) - (minutes * 60) );

      const minutesString = ( minutes > 9 || hours === 0 ) ? minutes : ( '0' + minutes );
      const secondsString = ( seconds > 9 ) ? seconds : ( '0' + seconds );

      if ( hours > 0 ) {
        return StringUtils.format( pattern0Hours1Minutes2SecondsString, hours, minutesString, secondsString );
      }
      else {
        return StringUtils.format( pattern0Minutes1SecondsString, minutesString, secondsString );
      }
    }
  } );
} );