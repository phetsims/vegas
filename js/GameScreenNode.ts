// Copyright 2025, University of Colorado Boulder

/**
 * Represents the main screen for a Vegas game challenge, including accessible sections for gameplay,
 * answer submission, and progress. Handles focus management when the screen is first shown.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

// TODO: The LevelSelectionScreenNode should manage restoring focus to whatever had focus before switching
//  to the challenge screen. See https://github.com/phetsims/vegas/issues/138

import { TReadOnlyProperty } from '../../axon/js/TReadOnlyProperty.js';
import optionize from '../../phet-core/js/optionize.js';
import PDOMSectionNode from '../../scenery-phet/js/accessibility/PDOMSectionNode.js';
import FocusableHeadingNode from '../../scenery/js/accessibility/pdom/FocusableHeadingNode.js';
import Node, { NodeOptions } from '../../scenery/js/nodes/Node.js';
import ChallengeNumberStringProperty from './ChallengeNumberStringProperty.js';
import vegas from './vegas.js';
import VegasFluent from './VegasFluent.js';
import VegasScreenNode from './VegasScreenNode.js';

type SelfOptions = {

  // Property for the current challenge number. If provided, is used in the accessible heading
  // for the challenge section. If provided, the challengeCountProperty must also be provided.
  challengeNumberProperty?: TReadOnlyProperty<number> | null;

  // Property for the total number of challenges. If provided, is used in the accessible heading
  // for the challenge section. If provided, the challengeNumberProperty must also be provided.
  challengeCountProperty?: TReadOnlyProperty<number> | null;
};
type ParentOptions = NodeOptions;
export type GameScreenNodeOptions = SelfOptions & ParentOptions;

export default class GameScreenNode extends VegasScreenNode {

  // Focusable heading node for the challenge. Whenever this screen is shown,
  // focus is moved to this Node.
  public readonly accessibleFocusableHeadingNode: FocusableHeadingNode;

  // Main gameplay area section node.
  public readonly accessibleChallengeSectionNode: PDOMSectionNode;

  // Section node for answer submission and results components.
  // TODO: This needs to be added/hidden based on whether there are answer components.
  //   I can't think of a way to automate that. It will likely be a manual instrumentation to show/hide this.
  //   See https://github.com/phetsims/vegas/issues/138
  //   Discussed - this is rare and it is OK to set visibility on these manually when we need to.
  public readonly accessibleAnswerSectionNode: PDOMSectionNode;

  // Section node for progress/status information.
  public readonly accessibleStatusSectionNode: Node;

  private readonly disposeGameScreenNode: () => void;

  public constructor( providedOptions?: GameScreenNodeOptions ) {

    const options = optionize<GameScreenNodeOptions, SelfOptions, ParentOptions>()( {
      challengeNumberProperty: null,
      challengeCountProperty: null
    }, providedOptions );

    // Affirm that if one is provided, both are provided.
    assert && assert( ( options.challengeNumberProperty === null ) === ( options.challengeCountProperty === null ),
      'If one of challengeNumberProperty or challengeCountProperty are provided, both must be provided' );

    super( options );

    // Use a local variable to track if we need to dispose challengeStringProperty
    let challengeStringProperty: TReadOnlyProperty<string> | null = null;
    let accessibleHeadingContentProperty: TReadOnlyProperty<string>;

    if ( options.challengeNumberProperty && options.challengeCountProperty ) {

      // Both properties are provided, so use them to create a ChallengeNumberStringProperty. The challengeStringProperty
      // itself must be disposed.
      challengeStringProperty = new ChallengeNumberStringProperty( options.challengeNumberProperty, options.challengeCountProperty );
      accessibleHeadingContentProperty = challengeStringProperty;
    }
    else {

      // Use the default property from VegasFluent
      accessibleHeadingContentProperty = VegasFluent.a11y.gameScreenNode.accessibleHeadingChallengeStringProperty;
    }

    // Although the logical heading of the challenge section, it is not a child of that section
    // because we expect clients to assign other UI components to the pdom order under it.
    this.accessibleFocusableHeadingNode = new FocusableHeadingNode( {
      accessibleName: accessibleHeadingContentProperty,
      headingLevel: 2
    } );

    this.accessibleChallengeSectionNode = new Node( {
      tagName: 'section',

      // This section does not have an accessibleHeading because the heading is provided as the focusable one.
      // However, headings below this section should be incremented as if they are below the h2 for the "Challenge" section.
      accessibleHeadingIncrement: 2
    } );

    this.accessibleAnswerSectionNode = new PDOMSectionNode( VegasFluent.a11y.gameScreenNode.accessibleAnswerSectionStringProperty, {
      accessibleHeadingIncrement: 2
    } );

    // This section does not have an accessible heading. It is only used to contain the status bars. Keeping it here allows the status bars
    // to be placed in a section and has symmetry with the other sections.
    this.accessibleStatusSectionNode = new Node( {
      tagName: 'section',

      // This section does not have an accessibleHeading because we expect the heading to be set on the status bar.
      // However, headings below this section should be incremented as if they are below the h2 for the "Progress" section.
      accessibleHeadingIncrement: 2
    } );

    // Add the sections to the scene graph so that their content will be in the
    // correct place in the pdom order.
    this.pdomParentNode.children = [
      this.accessibleFocusableHeadingNode,
      this.accessibleChallengeSectionNode,
      this.accessibleAnswerSectionNode,
      this.accessibleStatusSectionNode
    ];

    this.disposeGameScreenNode = () => {
      challengeStringProperty && challengeStringProperty.dispose();
      this.accessibleFocusableHeadingNode.dispose();
      this.accessibleChallengeSectionNode.dispose();
      this.accessibleAnswerSectionNode.dispose();
      this.accessibleStatusSectionNode.dispose();
    };
  }

  /**
   * Free for garbage collection.
   */
  public override dispose(): void {
    this.disposeGameScreenNode();
    super.dispose();
  }

  /**
   * Shows the screen and moves focus to the heading node for accessibility.
   */
  public override show(): void {
    super.show();
    this.accessibleFocusableHeadingNode.focus();
  }

  /**
   * Hides the screen.
   */
  public override hide(): void {
    super.hide();
  }
}

vegas.register( 'GameScreenNode', GameScreenNode );
