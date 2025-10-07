// Copyright 2025, University of Colorado Boulder

/**
 * Type alias for a score display node.
 *
 * Represents a Node with a property containing an accessible string
 * representation of the score.
 *
 * This string may be used to describe the score in other context. For example, if the string is
 * "Score: 3 Stars", it might appear in patterns such as
 *
 * "Level 1, Score: 3 Stars"
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import { TReadOnlyProperty } from '../../axon/js/TReadOnlyProperty.js';
import Node from '../../scenery/js/nodes/Node.js';

export type TScoreDisplayNode = Node & {
  readonly accessibleScoreStringProperty: TReadOnlyProperty<string>;
};