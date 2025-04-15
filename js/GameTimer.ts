// Copyright 2013-2025, University of Colorado Boulder

/**
 * Game timer, keeps track of the elapsed time in the game using "wall clock" time. The frame rate of this clock is
 * sufficient for displaying a game timer in "seconds", but not for driving smooth animation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../axon/js/BooleanProperty.js';
import NumberProperty from '../../axon/js/NumberProperty.js';
import Property from '../../axon/js/Property.js';
import stepTimer from '../../axon/js/stepTimer.js';
import { TimerListener } from '../../axon/js/Timer.js';
import StringUtils from '../../phetcommon/js/util/StringUtils.js';
import Tandem from '../../tandem/js/Tandem.js';
import vegas from './vegas.js';
import VegasStrings from './VegasStrings.js';
import PhetioObject from '../../tandem/js/PhetioObject.js';
import phetioStateSetEmitter from '../../tandem/js/phetioStateSetEmitter.js';

export default class GameTimer extends PhetioObject {

  // Whether the timer is running. This should typically only be set by GameTimer. But there are some sims that
  // set it to restore a specific time, for example see arithmetic.ArithmeticModel.
  private readonly isRunningProperty: Property<boolean>;

  // seconds since the timer was started
  public readonly elapsedTimeProperty: Property<number>;

  // see Timer.setInterval and clearInterval
  private intervalId: TimerListener | null;

  public constructor( tandem = Tandem.OPT_OUT ) {

    super( {
      phetioState: false
    } );

    this.isRunningProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'isRunningProperty' ),
      phetioFeatured: true,
      phetioReadOnly: true // Sims use start(), stop(), or restart() to change isRunningProperty.
    } );

    this.elapsedTimeProperty = new NumberProperty( 0, {
      numberType: 'Integer',
      units: 's',
      isValidValue: elapsedTime => ( elapsedTime >= 0 ),
      tandem: tandem.createTandem( 'elapsedTimeProperty' ),
      phetioFeatured: true,
      phetioReadOnly: true
    } );

    this.intervalId = null;

    // After setting PhET-iO state, the Timer listener may need to be restored.
    phetioStateSetEmitter.addListener( () => {
      if ( this.isRunningProperty.value && this.intervalId === null ) {
        this.intervalId = this.setTimerListener();
      }
    } );
  }

  public reset(): void {
    this.isRunningProperty.reset();
    this.elapsedTimeProperty.reset();
    if ( this.intervalId ) {
      stepTimer.clearInterval( this.intervalId );
      this.intervalId = null;
    }
  }

  public get isRunning(): boolean {
    return this.isRunningProperty.value;
  }

  /**
   * Starts the timer. This is a no-op if the timer is already running.
   */
  public start(): void {
    if ( !this.isRunningProperty.value ) {
      this.elapsedTimeProperty.value = 0;
      this.intervalId = this.setTimerListener();
      this.isRunningProperty.value = true;
    }
  }

  /**
   * Adds a listener to stepTimer to advance elapsed time in increments of 1 second.
   */
  private setTimerListener(): TimerListener {
    assert && assert( !this.intervalId, 'stepTimer already has a listener.' );
    return stepTimer.setInterval( () => {
      this.elapsedTimeProperty.value = this.elapsedTimeProperty.value + 1;
    }, 1000 ); // fire once per second
  }

  /**
   * Stops the timer. This is a no-op if the timer is already stopped.
   */
  public stop(): void {
    if ( this.isRunningProperty.value ) {
      stepTimer.clearInterval( this.intervalId! );
      this.intervalId = null;
      this.isRunningProperty.value = false;
    }
  }

  /**
   * Convenience function for restarting the timer.
   */
  public restart(): void {
    this.stop();
    this.start();
  }

  /**
   * Formats a value representing seconds into H:MM:SS (localized).
   */
  public static formatTime( time: number ): string {

    const hours = Math.floor( time / 3600 );
    const minutes = Math.floor( ( time - ( hours * 3600 ) ) / 60 );
    const seconds = Math.floor( time - ( hours * 3600 ) - ( minutes * 60 ) );

    const minutesString = ( minutes > 9 || hours === 0 ) ? minutes : ( `0${minutes}` );
    const secondsString = ( seconds > 9 ) ? seconds : ( `0${seconds}` );

    // Factor out patternStringProperty here, because [...].value confuses the chipper build process.
    if ( hours > 0 ) {
      const patternStringProperty = VegasStrings.pattern[ '0hours' ][ '1minutes' ][ '2secondsStringProperty' ];
      return StringUtils.format( patternStringProperty.value, hours, minutesString, secondsString );
    }
    else {
      const patternStringProperty = VegasStrings.pattern[ '0minutes' ][ '1secondsStringProperty' ];
      return StringUtils.format( patternStringProperty.value, minutesString, secondsString );
    }
  }
}

vegas.register( 'GameTimer', GameTimer );