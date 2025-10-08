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

  public constructor( screenNameProperty: TReadOnlyProperty<string>, providedOptions?: LevelSelectionScreenNodeOptions ) {
    const options = optionize<LevelSelectionScreenNodeOptions, SelfOptions, ParentOptions>()( {

      // TODO: What should the default be? See https://github.com/phetsims/vegas/issues/138
      accessibleIncludeOptionsDescription: true
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

    // TODO: Move to yaml, see https://github.com/phetsims/vegas/issues/138
    const levelsSection = new PDOMSectionNode( new StringProperty( 'Choose Your Level' ), sectionOptions );
    const controlsSection = new PDOMSectionNode( new StringProperty( 'Game Options' ), sectionOptions );

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
