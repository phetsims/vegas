// Copyright 2025, University of Colorado Boulder

/**
 * Represents the main screen for a Vegas game challenge, including accessible sections for gameplay,
 * answer submission, and progress. Handles focus management when the screen is first shown.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import { TReadOnlyProperty } from '../../axon/js/TReadOnlyProperty.js';
import PDOMSectionNode from '../../scenery-phet/js/accessibility/PDOMSectionNode.js';
import FocusableHeadingNode from '../../scenery/js/accessibility/pdom/FocusableHeadingNode.js';
import Node from '../../scenery/js/nodes/Node.js';
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
  public readonly accessibleAnswerSectionNode: PDOMSectionNode;

  // Section node for progress/status information.
  public readonly accessibleProgressSectionNode: PDOMSectionNode;

  public constructor( levelNumberProperty: TReadOnlyProperty<number>, levelCountProperty: TReadOnlyProperty<number> ) {
    super();

    // Although the logical heading of the challenge section, it is not a child of that section
    // because we expect clients to assign other UI components to the pdom order under it.
    this.accessibleFocusableHeadingNode = new FocusableHeadingNode( {
      accessibleName: new ChallengeNumberStringProperty( levelNumberProperty, levelCountProperty ),
      headingLevel: 2
    } );

    this.accessibleChallengeSectionNode = new Node( {
      tagName: 'section',

      // TODO: Right now this increment does nothing. We need all children under this to behave as though they
      //   are under an h2, even though this Node cannot have the heading. Either improve this or make it so
      //   that accessibleHeading can receive focus without FocusableHeadingNode workaround.
      //   See https://github.com/phetsims/vegas/issues/138
      accessibleHeadingIncrement: 2
    } );

    this.accessibleAnswerSectionNode = new PDOMSectionNode( VegasFluent.a11y.gameScreenNode.accessibleAnswerSectionStringProperty, {
      accessibleHeadingIncrement: 2
    } );
    this.accessibleProgressSectionNode = new PDOMSectionNode( VegasFluent.a11y.gameScreenNode.accessibleProgressSection.createProperty( {
      levelNumber: levelNumberProperty
    } ), {
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
