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
import { TReadOnlyProperty } from '../../axon/js/TReadOnlyProperty.js';
import optionize from '../../phet-core/js/optionize.js';
import PDOMSectionNode from '../../scenery-phet/js/accessibility/PDOMSectionNode.js';
import Node, { NodeOptions } from '../../scenery/js/nodes/Node.js';
import LevelSelectionButtonGroup from './LevelSelectionButtonGroup.js';
import vegas from './vegas.js';
import VegasFluent from './VegasFluent.js';
import VegasScreenNode from './VegasScreenNode.js';

type SelfOptions = {

  // Determines which summary string pattern to use for the game introduction.
  // If true, uses a pattern that includes a description of game options.
  // If false, uses a simpler pattern without the description.
  accessibleIncludeOptionsDescription?: boolean;
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

  // Reference to the level selection button group, enabling automatic restoration of focus to the previously selected button when this screen is displayed.
  // Note: It is the developer's responsibility to add these buttons to the scene graph and configure their pdomOrder.
  // The buttons should be placed within the `accessibleLevelsSectionNode`.
  private readonly levelSelectionButtonGroup: LevelSelectionButtonGroup;

  public constructor(
    screenNameProperty: TReadOnlyProperty<string>,
    levelSelectionButtonGroup: LevelSelectionButtonGroup,
    providedOptions?: LevelSelectionScreenNodeOptions
  ) {
    const options = optionize<LevelSelectionScreenNodeOptions, SelfOptions, ParentOptions>()( {
      accessibleIncludeOptionsDescription: false
    }, providedOptions );

    super( options );

    // The leading paragraph has a different pattern when there is a custom summary about the game.
    const leadingParagraphStringProperty = options.accessibleIncludeOptionsDescription ?
                                           VegasFluent.a11y.levelSelectionScreenNode.screenSummary.introWithOptions.createProperty( { screenName: screenNameProperty } ) :
                                           VegasFluent.a11y.levelSelectionScreenNode.screenSummary.intro.createProperty( { screenName: screenNameProperty } );
    const leadingParagraphNode = new Node( {
      accessibleParagraph: leadingParagraphStringProperty
    } );

    const sectionOptions = { accessibleHeadingIncrement: 2 };

    const levelsSection = new PDOMSectionNode( VegasFluent.a11y.levelSelectionScreenNode.accessibleHeadingChooseLevelStringProperty, sectionOptions );
    const controlsSection = new PDOMSectionNode( VegasFluent.a11y.levelSelectionScreenNode.accessibleHeadingOptionsStringProperty, sectionOptions );

    this.pdomParentNode.children = [
      leadingParagraphNode,
      levelsSection,
      controlsSection
    ];

    this.accessibleLevelsSectionNode = levelsSection;
    this.accessibleControlsSectionNode = controlsSection;
    this.levelSelectionButtonGroup = levelSelectionButtonGroup;
  }

  public override show(): void {
    super.show();
    this.levelSelectionButtonGroup.focusPressedButton();
    this.addAccessibleContextResponse( VegasFluent.a11y.levelSelectionScreenNode.accessibleContextResponseShowStringProperty );
  }

  public override hide(): void {
    super.hide();
  }
}

vegas.register( 'LevelSelectionScreenNode', LevelSelectionScreenNode );
