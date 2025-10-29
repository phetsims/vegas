// Copyright 2018-2025, University of Colorado Boulder

/**
 * AllLevelsCompletedNode is a pseudo-dialog shown when all game levels have been completed.
 *
 * @author Jonathan Olson
 */

import optionize from '../../phet-core/js/optionize.js';
import FaceNode from '../../scenery-phet/js/FaceNode.js';
import PhetFont from '../../scenery-phet/js/PhetFont.js';
import VBox from '../../scenery/js/layout/nodes/VBox.js';
import Node, { NodeOptions } from '../../scenery/js/nodes/Node.js';
import RichText from '../../scenery/js/nodes/RichText.js';
import Text from '../../scenery/js/nodes/Text.js';
import { PushButtonListener } from '../../sun/js/buttons/PushButtonModel.js';
import RectangularPushButton from '../../sun/js/buttons/RectangularPushButton.js';
import Panel from '../../sun/js/Panel.js';
import vegas from './vegas.js';
import VegasFluent from './VegasFluent.js';
import VegasStrings from './VegasStrings.js';

type SelfOptions = {

  // diameter of the smiley face
  faceDiameter?: number;

  // Controls the width of the main message and the text in the button
  maxTextWidth?: number;
};

export type AllLevelsCompletedNodeOptions = SelfOptions & NodeOptions;

export default class AllLevelsCompletedNode extends Node {
  private readonly button: Node;

  /**
   * @param listener function that gets called when 'next' button is pressed
   * @param providedOptions
   */
  public constructor( listener: PushButtonListener, providedOptions?: AllLevelsCompletedNodeOptions ) {
    super();

    const options = optionize<AllLevelsCompletedNodeOptions, SelfOptions, NodeOptions>()( {

      // SelfOptions
      faceDiameter: 160,
      maxTextWidth: 300
    }, providedOptions );

    // create the smiley face
    const faceNode = new FaceNode( options.faceDiameter, {
      accessibleParagraph: VegasFluent.a11y.allLevelsCompletedNode.faceNode.accessibleParagraphStringProperty
    } );

    // create the dialog text
    const textMessage = new RichText( VegasStrings.youCompletedAllLevelsStringProperty, {
      font: new PhetFont( 25 ),
      lineWrap: 300,
      maxWidth: options.maxTextWidth,
      maxHeight: 300
    } );

    // create the button
    this.button = new RectangularPushButton( {
      content: new Text( VegasStrings.doneStringProperty, {
        font: new PhetFont( 30 ),
        maxWidth: options.maxTextWidth
      } ),
      listener: listener,
      baseColor: 'yellow',
      accessibleHelpText: VegasFluent.a11y.allLevelsCompletedNode.doneButton.accessibleHelpTextStringProperty
    } );

    // add the main background panel
    this.addChild( new Panel(
      new VBox( { children: [ faceNode, textMessage, this.button ], spacing: 20 } ),
      { xMargin: 50, yMargin: 20 }
    ) );

    this.mutate( options );

    this.visibleProperty.lazyLink( visible => {
      if ( visible ) {
        this.handleShow();
      }
    } );
  }

  /**
   * Does work that should happen whenever this node is shown. Called when visibility changes by
   * default, but if your implementation does not go through this Node's visibilityProperty, you should
   * call this method manually.
   */
  public handleShow(): void {
    this.button.focus();
    this.addAccessibleContextResponse( VegasFluent.a11y.allLevelsCompletedNode.accessibleContextResponseShowStringProperty );
  }
}

vegas.register( 'AllLevelsCompletedNode', AllLevelsCompletedNode );