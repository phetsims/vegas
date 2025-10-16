// Copyright 2025, University of Colorado Boulder

/**
 * Represents the main screen for a Vegas game challenge, including accessible sections for gameplay,
 * answer submission, and progress. Handles focus management when the screen is first shown.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

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

  // Property for the current level. If provided, this level number will be included in the accessible
  // heading for the "status" section.
  levelNumberProperty?: TReadOnlyProperty<number> | null;

  // A prompt that introduces the challenge. It appears near the top of the screen, just below the top-most
  // heading. If provided, it is always shown.
  accessibleChallengePrompt?: string | TReadOnlyProperty<string> | null;

  // A description of the challenge answer. This appears near the top of the screen, just below the accessible
  // challenge prompt. It is usually invisible and should only be shown in games where there is a "show answer" mode.
  // If your game has a "show answer" button/mode, call setAnswerSummaryVisible( true ) when the answer summary should be visible.
  accessibleAnswerSummary?: string | TReadOnlyProperty<string> | null;
};
type ParentOptions = NodeOptions;
export type ChallengeScreenNodeOptions = SelfOptions & ParentOptions;

export default class ChallengeScreenNode extends VegasScreenNode {

  // Focusable heading node for the challenge. Whenever this screen is shown,
  // focus is moved to this Node.
  public readonly accessibleFocusableHeadingNode: FocusableHeadingNode;

  // Main gameplay area section node.
  public readonly accessibleChallengeSectionNode: PDOMSectionNode;

  // Section node for answer submission and results components.
  public readonly accessibleAnswerSectionNode: PDOMSectionNode;

  // Section node for progress/status information.
  public readonly accessibleStatusSectionNode: Node;

  // Reference to the "answer summary" Node, so that it can be shown/hidden as needed.
  private readonly accessibleAnswerSummaryNode: Node;

  private readonly disposeChallengeScreenNode: () => void;

  public constructor( providedOptions?: ChallengeScreenNodeOptions ) {

    const options = optionize<ChallengeScreenNodeOptions, SelfOptions, ParentOptions>()( {
      challengeNumberProperty: null,
      challengeCountProperty: null,
      levelNumberProperty: null,
      accessibleChallengePrompt: null,
      accessibleAnswerSummary: null
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
      accessibleHeadingContentProperty = VegasFluent.a11y.challengeScreenNode.accessibleHeadingChallengeStringProperty;
    }

    // Although the logical heading of the challenge section, it is not a child of that section
    // because we expect clients to assign other UI components to the pdom order under it.
    this.accessibleFocusableHeadingNode = new FocusableHeadingNode( {
      accessibleName: accessibleHeadingContentProperty,
      headingLevel: 2
    } );

    const accessibleChallengePromptNode = new Node( {
      accessibleParagraph: options.accessibleChallengePrompt
    } );

    this.accessibleAnswerSummaryNode = new Node( {
      accessibleParagraph: options.accessibleAnswerSummary,
      visible: false
    } );

    this.accessibleChallengeSectionNode = new Node( {
      tagName: 'section',

      // This section does not include an accessible heading, as the heading is provided by the focusable heading node above.
      // Headings within this section should be incremented to reflect their logical nesting under the h2 "Challenge" heading.
      // The intended accessible heading structure is as follows:
      // h1 - Title
      //   h2 - Focusable Challenge Heading
      //     h3 - Content within this section
      // Therefore, `accessibleHeadingIncrement` is set to 3 to maintain this hierarchy.
      accessibleHeadingIncrement: 3
    } );

    this.accessibleAnswerSectionNode = new PDOMSectionNode( VegasFluent.a11y.challengeScreenNode.accessibleAnswerSectionStringProperty, {
      accessibleHeadingIncrement: 2
    } );

    // Compute the accessible heading for the "status" section, possibly including the level number. If a Property
    // is created from a pattern, it must be disposed.
    let statusHeadingProperty: TReadOnlyProperty<string>;
    let disposableStatusHeadingProperty: TReadOnlyProperty<string> | null = null;
    if ( options.levelNumberProperty ) {
      statusHeadingProperty = VegasFluent.a11y.statusBar.accessibleHeadingWithLevelNumber.createProperty( {
        levelNumber: options.levelNumberProperty
      } );
      disposableStatusHeadingProperty = statusHeadingProperty;
    }
    else {
      statusHeadingProperty = VegasFluent.a11y.statusBar.accessibleHeadingStringProperty;
    }

    this.accessibleStatusSectionNode = new PDOMSectionNode( statusHeadingProperty, {
      accessibleHeadingIncrement: 2
    } );

    // Add the sections to the scene graph so that their content will be in the
    // correct place in the pdom order.
    this.pdomParentNode.children = [
      this.accessibleFocusableHeadingNode,
      accessibleChallengePromptNode,
      this.accessibleAnswerSummaryNode,
      this.accessibleChallengeSectionNode,
      this.accessibleAnswerSectionNode,
      this.accessibleStatusSectionNode
    ];

    this.disposeChallengeScreenNode = () => {
      challengeStringProperty && challengeStringProperty.dispose();
      this.accessibleFocusableHeadingNode.dispose();
      accessibleChallengePromptNode.dispose();
      this.accessibleAnswerSummaryNode.dispose();
      this.accessibleChallengeSectionNode.dispose();
      this.accessibleAnswerSectionNode.dispose();
      this.accessibleStatusSectionNode.dispose();
      statusHeadingProperty.dispose();
      disposableStatusHeadingProperty && disposableStatusHeadingProperty.dispose();
    };
  }

  /**
   * Free for garbage collection.
   */
  public override dispose(): void {
    this.disposeChallengeScreenNode();
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

  public setAnswerSummaryVisible( visible: boolean ): void {
    this.accessibleAnswerSummaryNode.visible = visible;
  }
}

vegas.register( 'ChallengeScreenNode', ChallengeScreenNode );
