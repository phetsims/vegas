// Copyright 2025, University of Colorado Boulder

/**
 * Represents a screen for a vegas game that shows reward content. Includes an accessible section
 * for reward dialogs and content.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import { TReadOnlyProperty } from '../../axon/js/TReadOnlyProperty.js';
import PDOMSectionNode from '../../scenery-phet/js/accessibility/PDOMSectionNode.js';
import { NodeOptions } from '../../scenery/js/nodes/Node.js';
import vegas from './vegas.js';
import VegasFluent from './VegasFluent.js';
import VegasScreenNode from './VegasScreenNode.js';

export default class RewardScreenNode extends VegasScreenNode {
  public readonly accessibleRewardSectionNode: PDOMSectionNode;
  private readonly disposeRewardScreenNode: () => void;

  public constructor( levelNumberProperty: TReadOnlyProperty<number>, providedOptions?: NodeOptions ) {
    super( providedOptions );

    const accessibleHeadingContentProperty = VegasFluent.a11y.rewardScreenNode.accessibleHeading.createProperty( {
      levelNumber: levelNumberProperty
    } );
    this.accessibleRewardSectionNode = new PDOMSectionNode( accessibleHeadingContentProperty, {
      accessibleHeadingIncrement: 2
    } );

    this.pdomParentNode.children = [
      this.accessibleRewardSectionNode
    ];

    this.disposeRewardScreenNode = () => {
      accessibleHeadingContentProperty.dispose();
      this.accessibleRewardSectionNode.dispose();
    };
  }

  public override dispose(): void {
    this.disposeRewardScreenNode();
    super.dispose();
  }
}

vegas.register( 'RewardScreenNode', RewardScreenNode );