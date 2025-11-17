// Copyright 2022-2025, University of Colorado Boulder

/**
 * Demo for LevelCompletedNode
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import TextPushButton from '../../../../sun/js/buttons/TextPushButton.js';
import LevelCompletedNode from '../../LevelCompletedNode.js';

export default function demoLevelCompletedNode( layoutBounds: Bounds2 ): Node {

  const visibleProperty = new BooleanProperty( false );
  const levelCompletedNode = new LevelCompletedNode( 1, 10, 10, 5, true, 2000, null, true,
    () => visibleProperty.toggle(), {
    contentMaxWidth: 500,
    visibleProperty: visibleProperty
  } );

  const completeLevelButton = new TextPushButton( 'Complete Level', {
    font: new PhetFont( 32 ),
    listener: () => {
      visibleProperty.toggle();
    }
  } );

  const container = new VBox( {
    children: [ completeLevelButton, levelCompletedNode ],
    align: 'center',
    excludeInvisibleChildrenFromBounds: false
  } );

  // LevelCompletedNode has dynamic strings, so requires dynamic layout.
  levelCompletedNode.boundsProperty.link( () => {
    container.centerTop = layoutBounds.centerTop.plusXY( 0, 60 );
  } );

  return container;
}