// Copyright 2025, University of Colorado Boulder

/**
 * Represents the level selection screen for the Vegas game.
 * Provides accessible sections for level selection buttons and game controls,
 * ensuring a clear structure for screen readers.
 *
 * Place level selection buttons in `accessibleLevelsSectionNode` and other controls
 * (timers, reset, info, etc.) in `accessibleControlsSectionNode` using pdomOrder.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */
import StringProperty from '../../axon/js/StringProperty.js';
import { TReadOnlyProperty } from '../../axon/js/TReadOnlyProperty.js';
import PDOMSectionNode from '../../scenery-phet/js/accessibility/PDOMSectionNode.js';
import Node from '../../scenery/js/nodes/Node.js';
import vegas from './vegas.js';
import VegasScreenNode from './VegasScreenNode.js';

export default class LevelSelectionScreenNode extends VegasScreenNode {

  // Accessible section for level selection buttons.
  // Assign level selection buttons to this section using pdomOrder.
  public readonly accessibleLevelsSectionNode: PDOMSectionNode;

  // Accessible section for other game controls (timers, reset, info, etc.).
  // Assign control components to this section using pdomOrder.
  public readonly accessibleControlsSectionNode: PDOMSectionNode;

  public constructor( screenNameProperty: TReadOnlyProperty<string> ) {
    super();

    const leadingParagraphNode = new Node( {

      // The "Levels" would be the name of the screen.
      accessibleParagraph: `Welcome to the ${screenNameProperty.value} Screen. Choose a level to start earning stars. Additionally, choose game options for all levels. Use reset all to clear the game and start over.`
    } );

    const sectionOptions = { accessibleHeadingIncrement: 2 };
    const levelsSection = new PDOMSectionNode( new StringProperty( 'Choose Your Level' ), sectionOptions );
    const controlsSection = new PDOMSectionNode( new StringProperty( 'Choose Game Options' ), sectionOptions );

    this.pdomParentNode.children = [
      leadingParagraphNode,
      levelsSection,
      controlsSection
    ];

    this.accessibleLevelsSectionNode = levelsSection;
    this.accessibleControlsSectionNode = controlsSection;
  }

  public override show(): void {
    super.show();
  }

  public override hide(): void {
    super.hide();
  }
}

vegas.register( 'LevelSelectionScreenNode', LevelSelectionScreenNode );
