// Copyright 2025, University of Colorado Boulder
/**
 * GameUtils contains utility functions for Vegas games.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import Property from '../../axon/js/Property.js';
import { TReadOnlyProperty } from '../../axon/js/TReadOnlyProperty.js';
import vegas from './vegas.js';
import VegasFluent from './VegasFluent.js';

const GameUtils = {

  /**
   * Updates the score and time together, ensuring that they remain appropriately synchronized. Will return true if
   * the time was updated.
   * @param score
   * @param time
   * @param scoreProperty
   * @param bestTimeForScoreProperty
   */
  updateScoreAndBestTime( score: number, time: number, scoreProperty: Property<number>,
                                           bestTimeForScoreProperty: Property<number> | Property<number | null> ): boolean {
    // Track whether we have a new best score or time.
    let newBest = false;

    // If we have a new high score, update both score and best time
    if ( score && score > scoreProperty.value ) {
      scoreProperty.value = score;

      // Do not update the best time for this score if the time is 0, which indicates that the timer was not running.
      bestTimeForScoreProperty.value = time === 0 ? bestTimeForScoreProperty.value : time;
      newBest = true;
    }

    // Only update the time if the timer was running and our current score has not changed and time has not been set
    // yet, or we have a new best time for this score. A time has not been set yet if it is null or 0.
    else if ( time !== 0 && score && score === scoreProperty.value &&
              ( bestTimeForScoreProperty.value === null ||
                bestTimeForScoreProperty.value === 0 ||
                time < bestTimeForScoreProperty.value ) ) {
      bestTimeForScoreProperty.value = time;
      newBest = true;
    }

    return newBest;
  },

  /**
   * Returns a string representing the time in hours, minutes, and seconds.
   * '{ $hours } hours, { $minutes } minutes, and { $seconds } seconds'
   * @param time
   */
  getMinutesAndSecondsString( time: number ): string {
    const extractedHoursMinutesAndSeconds = this.extractHoursMinutesAndSeconds( time );
    return VegasFluent.a11y.timeDisplayPattern.format( {
      hours: extractedHoursMinutesAndSeconds.hours,
      minutes: extractedHoursMinutesAndSeconds.minutes,
      seconds: extractedHoursMinutesAndSeconds.seconds
    } );
  },

  /**
   * Returns a string Property representing the time in hours, minutes, and seconds.
   * '{ $hours } hours, { $minutes } minutes, and { $seconds } seconds'
   * @param time
   */
  getMinutesAndSecondsStringProperty( time: number ): TReadOnlyProperty<string> {
    const extractedHoursMinutesAndSeconds = this.extractHoursMinutesAndSeconds( time );
    return VegasFluent.a11y.timeDisplayPattern.createProperty( {
      hours: extractedHoursMinutesAndSeconds.hours,
      minutes: extractedHoursMinutesAndSeconds.minutes,
      seconds: extractedHoursMinutesAndSeconds.seconds
    } );
  },

  /**
   * Extracts hours, minutes, and seconds from a time value in seconds.
   * @param time
   */
  extractHoursMinutesAndSeconds( time: number ): { hours: number; minutes: number; seconds: number } {
    const hours = Math.floor( time / 3600 );
    const minutes = Math.floor( ( time - ( hours * 3600 ) ) / 60 );
    const seconds = Math.floor( time - ( hours * 3600 ) - ( minutes * 60 ) );
    return { hours: hours, minutes: minutes, seconds: seconds };
  }
};

vegas.register( 'GameUtils', GameUtils );
export default GameUtils;