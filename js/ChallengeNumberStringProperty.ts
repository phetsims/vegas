// Copyright 2025, University of Colorado Boulder

/**
 * A derived property that produces a challenge number string like "Challenge 1 of 5".
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import { DerivedProperty3 } from '../../axon/js/DerivedProperty.js';
import { TReadOnlyProperty } from '../../axon/js/TReadOnlyProperty.js';
import StringUtils from '../../phetcommon/js/util/StringUtils.js';
import Tandem from '../../tandem/js/Tandem.js';
import vegas from './vegas.js';
import VegasStrings from './VegasStrings.js';

export default class ChallengeNumberStringProperty extends DerivedProperty3<string, string, number, number> {

  /**
   * @param challengeNumberProperty - 1-based index of the current challenge
   * @param challengeCountProperty - total number of challenges
   */
  public constructor( challengeNumberProperty: TReadOnlyProperty<number>, challengeCountProperty: TReadOnlyProperty<number> ) {
    super( [ VegasStrings.pattern[ '0challenge' ][ '1maxStringProperty' ], challengeNumberProperty, challengeCountProperty ],
      ( pattern: string, challengeNumber: number, challengeCount: number ) => {
        return StringUtils.format( pattern, challengeNumber, challengeCount );
      }, {
        tandem: Tandem.OPT_OUT
      } );
  }
}

vegas.register( 'ChallengeNumberStringProperty', ChallengeNumberStringProperty );