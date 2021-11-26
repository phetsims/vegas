// Copyright 2018-2021, University of Colorado Boulder

/**
 * AllLevelsCompletedNode is a pseudo-dialog shown when all game levels have been completed.
 *
 * @author Jonathan Olson
 */

import merge from '../../phet-core/js/merge.js';
import FaceNode from '../../scenery-phet/js/FaceNode.js';
import PhetFont from '../../scenery-phet/js/PhetFont.js';
import { Node } from '../../scenery/js/imports.js';
import { RichText } from '../../scenery/js/imports.js';
import { Text } from '../../scenery/js/imports.js';
import { VBox } from '../../scenery/js/imports.js';
import RectangularPushButton from '../../sun/js/buttons/RectangularPushButton.js';
import Panel from '../../sun/js/Panel.js';
import vegas from './vegas.js';
import vegasStrings from './vegasStrings.js';

// constants
const FACE_DIAMETER = 160; // empirically determined

class AllLevelsCompletedNode extends Node {

  /**
   * @param {Function} listener - function that gets called when 'next' button is pressed
   * @param {Object} [options]
   */
  constructor( listener, options ) {
    super();

    options = merge( {
      // {number} - Controls the width of the main message and the text in the button
      maxTextWidth: 300
    }, options );

    // create the smiley face
    const faceNode = new FaceNode( FACE_DIAMETER );

    // create the dialog text
    const textMessage = new RichText( vegasStrings.youCompletedAllLevels, {
      font: new PhetFont( 25 ),
      lineWrap: 300,
      maxWidth: options.maxTextWidth,
      maxHeight: 300
    } );

    // create the button
    const button = new RectangularPushButton( {
      content: new Text( vegasStrings.done, {
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
}

vegas.register( 'AllLevelsCompletedNode', AllLevelsCompletedNode );
export default AllLevelsCompletedNode;