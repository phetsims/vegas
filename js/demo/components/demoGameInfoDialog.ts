// Copyright 2022-2024, University of Colorado Boulder

/**
 * Demo for GameInfoDialog
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import InfoButton from '../../../../scenery-phet/js/buttons/InfoButton.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Node, Text } from '../../../../scenery/js/imports.js';
import GameInfoDialog from '../../GameInfoDialog.js';
import vegasQueryParameters, { NUMBER_OF_GAME_LEVELS } from '../../vegasQueryParameters.js';

export default function demoGameInfoDialog( layoutBounds: Bounds2 ): Node {

  const levelDescriptions: string[] = [];
  for ( let i = 1; i <= NUMBER_OF_GAME_LEVELS; i++ ) {
    levelDescriptions.push( `Description of level ${i}` );
  }

  const dialog = new GameInfoDialog( levelDescriptions, {
    gameLevels: vegasQueryParameters.gameLevels,
    title: new Text( 'Your Title', {
      font: new PhetFont( { size: 30, weight: 'bold' } )
    } ),
    ySpacing: 20
  } );

  return new InfoButton( {
    listener: () => dialog.show(),
    center: layoutBounds.center
  } );
}