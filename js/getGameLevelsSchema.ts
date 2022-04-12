// Copyright 2021, University of Colorado Boulder

// @ts-nocheck
/**
 * Gets the QueryStringMachine schema for the gameLevels query parameter.
 *
 * History:
 * - The `gameLevels` query parameter was first proposed and discussed in https://github.com/phetsims/vegas/issues/86.
 * - The design of the gameLevels query parameter was solidified, and it was first implemented in Equality Explorer,
 *   see https://github.com/phetsims/equality-explorer/issues/165.
 * - When gameLevels was needed in Fourier, the schema was then copied from Fourier to Equality Explorer,
 *   see https://github.com/phetsims/fourier-making-waves/issues/145.
 * - During code review of Number Play in https://github.com/phetsims/number-play/issues/92, yet-another implementation
 *   was discovered. That motivated factoring out this function, to prevent further duplication and inconsistency.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import vegas from './vegas.js';

function getGameLevelsSchema( numberOfLevels ) {
  return {
    public: true,
    type: 'array',
    elementSchema: {
      type: 'number',
      isValidValue: Number.isInteger
    },
    defaultValue: null,
    isValidValue: array => {
      return ( array === null ) || (
        array.length > 0 &&
        // unique level numbers
        array.length === _.uniq( array ).length &&
        // valid level numbers
        _.every( array, element => element > 0 && element <= numberOfLevels ) &&
        // sorted by ascending level number
        _.every( array, ( value, index, array ) => ( index === 0 || array[ index - 1 ] <= value ) )
      );
    }
  };
}

vegas.register( 'getGameLevelsSchema', getGameLevelsSchema );
export default getGameLevelsSchema;