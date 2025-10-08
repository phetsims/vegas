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
import PDOMSectionNode from '../../scenery-phet/js/accessibility/PDOMSectionNode.js';
import FocusableHeadingNode from '../../scenery/js/accessibility/pdom/FocusableHeadingNode.js';
import Node, { NodeOptions } from '../../scenery/js/nodes/Node.js';
import ChallengeNumberStringProperty from './ChallengeNumberStringProperty.js';
import vegas from './vegas.js';
import VegasFluent from './VegasFluent.js';
import VegasScreenNode from './VegasScreenNode.js';

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
  public readonly accessibleProgressSectionNode: Node;

  // NOTE: START HERE NEXT TIME
  // TODO: Is it OK for the challenge Number and challenge count to be required? Do all challenge screens have both of these? What should it be
  //  for infinite levels? See https://github.com/phetsims/vegas/issues/138
  public constructor( challengeNumberProperty: TReadOnlyProperty<number>, challengeCountProperty: TReadOnlyProperty<number>, providedOptions?: NodeOptions ) {
    super( providedOptions );

    // Although the logical heading of the challenge section, it is not a child of that section
    // because we expect clients to assign other UI components to the pdom order under it.
    this.accessibleFocusableHeadingNode = new FocusableHeadingNode( {
      accessibleName: new ChallengeNumberStringProperty( challengeNumberProperty, challengeCountProperty ),
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

    // TODO: Right now, this does NOT include the heading for "Level 2 Progress". It seems like it
    //  should be built into the status bars. Will this section ever appear if there is no
    //  progress/status information?
    //  However, it is hear so that clients can add content (including status bars) if they want for
    //  consistent ordering.
    //  See https://github.com/phetsims/vegas/issues/138
    this.accessibleProgressSectionNode = new Node( {
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
      this.accessibleProgressSectionNode
    ];
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
