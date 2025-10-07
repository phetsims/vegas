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
import optionize from '../../phet-core/js/optionize.js';
import PDOMSectionNode from '../../scenery-phet/js/accessibility/PDOMSectionNode.js';
import Node, { NodeOptions } from '../../scenery/js/nodes/Node.js';
import vegas from './vegas.js';
import VegasFluent from './VegasFluent.js';
import VegasScreenNode from './VegasScreenNode.js';

type SelfOptions = {

  // An optional summary string that describes the game and guides the user toward what is expected.
  // The default content will include a welcome statement and a description of the Reset All button:
  //
  // Welcome to the {{NAME}} Screen. {{accessibleGameSummary}} Use reset all to clear the game and start over."
  //
  // Here is an example value:
  // "Choose a level to start earning stars. Additionally, choose game options for all levels.
  accessibleGameSummary?: TReadOnlyProperty<string> | null;
};

type ParentOptions = NodeOptions;
export type LevelSelectionScreenNodeOptions = SelfOptions & ParentOptions;

export default class LevelSelectionScreenNode extends VegasScreenNode {

  // Accessible section for level selection buttons.
  // Assign level selection buttons to this section using pdomOrder.
  public readonly accessibleLevelsSectionNode: PDOMSectionNode;

  // Accessible section for other game controls (timers, reset, info, etc.).
  // Assign control components to this section using pdomOrder.
  public readonly accessibleControlsSectionNode: PDOMSectionNode;

  public constructor( screenNameProperty: TReadOnlyProperty<string>, providedOptions?: LevelSelectionScreenNodeOptions ) {
    const options = optionize<LevelSelectionScreenNodeOptions, SelfOptions, ParentOptions>()( {
      accessibleGameSummary: null
    }, providedOptions );

    super( options );

    // The leading paragraph has a different pattern when there is a custom summary about the game.
    let leadingParagraphStringProperty: TReadOnlyProperty<string>;
    if ( options.accessibleGameSummary ) {
      leadingParagraphStringProperty = VegasFluent.a11y.levelSelectionScreenNode.screenSummary.introWithSummary.createProperty( {
        screenName: screenNameProperty,
        summary: options.accessibleGameSummary
      } );
    }
    else {
      leadingParagraphStringProperty = VegasFluent.a11y.levelSelectionScreenNode.screenSummary.intro.createProperty( {
        screenName: screenNameProperty
      } );
    }
    const leadingParagraphNode = new Node( {
      accessibleParagraph: leadingParagraphStringProperty
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
