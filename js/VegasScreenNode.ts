// Copyright 2025, University of Colorado Boulder

/**
 * Base class for Vegas game screens, providing a parent node for accessibility sections
 * and enforcing consistent heading and pdom order structure for screen reader support.
 *
 * Subclasses should organize their accessible content under the provided `pdomParentNode`
 * and should not set the pdomOrder directly.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Node, { NodeOptions } from '../../scenery/js/nodes/Node.js';
import vegas from './vegas.js';

class VegasScreenNode extends Node {

  // Parent node for accessibility sections. Subclasses should add accessible section nodes as children.
  // This ensures a consistent heading structure for screen readers.
  protected readonly pdomParentNode: Node;

  public constructor( providedOptions?: NodeOptions ) {
    super( providedOptions );

    this.pdomParentNode = new Node();
    this.addChild( this.pdomParentNode );
  }

  /**
   * Overrides setChildren to ensure the accessibility parent node is always present.
   * Prevents removal of `pdomParentNode` when setting children.
   */
  public override setChildren( children: Node[] ): this {
    Node.prototype.setChildren.call( this, children );

    // mutate may call setChildren before pdomParentNode is constructed
    if ( this.pdomParentNode && !this.hasChild( this.pdomParentNode ) ) {
      this.addChild( this.pdomParentNode );
      this.pdomParentNode.moveToBack();
    }
    return this;
  }

  /**
   * Throws an error if attempting to set the pdomOrder directly.
   * Subclasses should organize accessible content under section nodes instead.
   */
  public override setPDOMOrder( pdomOrder: Array<Node | null> | null ): void {
    throw new Error( 'Do not set the pdomOrder on a game screen Node directly. Order Nodes under the ' +
                     'accessible section Nodes provided by VegasScreenNode subclasses. ' +
                     'This ensures that game screens have a consistent heading structure and that content ' +
                     'is placed under those sections which is important for screen reader accessibility.'
    );
  }
}

export default VegasScreenNode;

vegas.register( 'VegasScreenNode', VegasScreenNode );