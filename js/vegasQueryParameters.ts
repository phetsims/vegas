// Copyright 2022-2024, University of Colorado Boulder

/**
 * Query parameters for the vegas demo application.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import vegas from './vegas.js';
import getGameLevelsSchema from './getGameLevelsSchema.js';

const NUMBER_OF_GAME_LEVELS = 5;
export { NUMBER_OF_GAME_LEVELS };

const vegasQueryParameters = QueryStringMachine.getAll( {

  // The levels to show in demoGameInfoDialog.
  gameLevels: getGameLevelsSchema( NUMBER_OF_GAME_LEVELS ),

  // initial selection on the Components screen, values are the same as the labels on combo box items
  component: {
    type: 'string',
    defaultValue: null
  }
} );

vegas.register( 'vegasQueryParameters', vegasQueryParameters );
export default vegasQueryParameters;