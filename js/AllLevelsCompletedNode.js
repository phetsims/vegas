// Copyright 2018-2020, University of Colorado Boulder

/**
 * model dialog shown when all levels have been completed
 */

import inherit from '../../phet-core/js/inherit.js';
import merge from '../../phet-core/js/merge.js';
import FaceNode from '../../scenery-phet/js/FaceNode.js';
import PhetFont from '../../scenery-phet/js/PhetFont.js';
import Node from '../../scenery/js/nodes/Node.js';
import RichText from '../../scenery/js/nodes/RichText.js';
import Text from '../../scenery/js/nodes/Text.js';
import VBox from '../../scenery/js/nodes/VBox.js';
import RectangularPushButton from '../../sun/js/buttons/RectangularPushButton.js';
import Panel from '../../sun/js/Panel.js';
import vegasStrings from './vegas-strings.js';
import vegas from './vegas.js';

// constants
const FACE_DIAMETER = 160; // empirically determined

const doneString = vegasStrings.done;
const youCompletedAllLevelsString = vegasStrings.youCompletedAllLevels;

/**
 * @param {Function} listener - function that gets called when 'next' button is pressed
 * @param {Object} [options]
 * @constructor
 */
function AllLevelsCompletedNode( listener, options ) {
  Node.call( this );

  options = merge( {
    // {number} - Controls the width of the main message and the text in the button
    maxTextWidth: 300
  }, options );

  // create the smiley face
  const faceNode = new FaceNode( FACE_DIAMETER );

  // create the dialog text
  const textMessage = new RichText( youCompletedAllLevelsString, {
    font: new PhetFont( 25 ),
    lineWrap: 300,
    maxWidth: options.maxTextWidth,
    maxHeight: 300
  } );

  // create the button
  const button = new RectangularPushButton( {
    content: new Text( doneString, {
      font: new PhetFont( 30 ),
      maxWidth: options.maxTextWidth
    } ),
    listener: listener,
    baseColor: 'yellow'
  } );

  // add the main background panel
  this.addChild( new Panel(
    new VBox( { children: [ faceNode, textMessage, button ], spacing: 20 } ),
    { xMargin: 50, yMargin: 20 }
  ) );

  this.mutate( options );
}

vegas.register( 'AllLevelsCompletedNode', AllLevelsCompletedNode );

inherit( Node, AllLevelsCompletedNode );
export default AllLevelsCompletedNode;