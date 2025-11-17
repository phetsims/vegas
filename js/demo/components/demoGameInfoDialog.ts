// Copyright 2022-2025, University of Colorado Boulder

/**
 * Demo for GameInfoDialog
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import GameInfoButton from '../../buttons/GameInfoButton.js';
import GameInfoDialog from '../../GameInfoDialog.js';
import vegasQueryParameters, { NUMBER_OF_GAME_LEVELS } from '../../vegasQueryParameters.js';

export default function demoGameInfoDialog( layoutBounds: Bounds2 ): Node {

  const levelDescriptions: string[] = [];
  for ( let i = 1; i <= NUMBER_OF_GAME_LEVELS; i++ ) {
    levelDescriptions.push( `Description of level ${i}` );
  }

  const dialog = new GameInfoDialog( levelDescriptions, {
    gameLevels: vegasQueryParameters.gameLevels,
    ySpacing: 20
  } );

  return new GameInfoButton( {
    listener: () => dialog.show(),
    center: layoutBounds.center
  } );
}