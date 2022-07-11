// Copyright 2022, University of Colorado Boulder

/**
 * Demo for GameInfoDialog
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import InfoButton from '../../../../scenery-phet/js/buttons/InfoButton.js';
import GameInfoDialog from '../../GameInfoDialog.js';

export default function demoGameInfoDialog( layoutBounds: Bounds2 ) {

  const levelDescriptions = [
    'Description of level 1',
    'Description of level 2',
    'Description of level 3',
    'Description of level 4'
  ];

  const dialog = new GameInfoDialog( levelDescriptions );

  return new InfoButton( {
    listener: () => dialog.show(),
    center: layoutBounds.center
  } );
}