// Copyright 2022-2024, University of Colorado Boulder

/**
 * Query parameters for the vegas demo application.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { QueryStringMachine } from '../../query-string-machine/js/QueryStringMachineModule.js';
import getGameLevelsSchema from './getGameLevelsSchema.js';
import vegas from './vegas.js';

const NUMBER_OF_GAME_LEVELS = 5;
export { NUMBER_OF_GAME_LEVELS };

const vegasQueryParameters = QueryStringMachine.getAll( {

  // The levels to show in demoGameInfoDialog.
  gameLevels: getGameLevelsSchema( NUMBER_OF_GAME_LEVELS )
} );

vegas.register( 'vegasQueryParameters', vegasQueryParameters );
export default vegasQueryParameters;