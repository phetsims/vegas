// Copyright 2025, University of Colorado Boulder

/**
 * A button component for moving to the next challenge in a game.
 *
 * This button provides default accessibility content, including an accessible name.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

// QUESTION: Are these classes redundant? They are all just buttons with different labels.

import TextPushButton, { TextPushButtonOptions } from '../../../sun/js/buttons/TextPushButton.js';
import vegas from '../vegas.js';
import VegasStrings from '../VegasStrings.js';

export type NextButtonOptions = TextPushButtonOptions;

export default class NextButton extends TextPushButton {
  public constructor( providedOptions?: NextButtonOptions ) {
    super( VegasStrings.nextStringProperty, providedOptions );
  }
}

vegas.register( 'NextButton', NextButton );
