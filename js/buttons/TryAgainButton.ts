// Copyright 2025, University of Colorado Boulder

/**
 * A button component for trying the current challenge again in a game.
 *
 * This button provides default accessibility content, including an accessible name.
 *
 * NOTE: When this button is pressed, focus should move to the first interactive element
 * of the current challenge.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import TextPushButton, { TextPushButtonOptions } from '../../../sun/js/buttons/TextPushButton.js';
import vegas from '../vegas.js';
import VegasStrings from '../VegasStrings.js';

export type TryAgainButtonOptions = TextPushButtonOptions;

export default class TryAgainButton extends TextPushButton {
  public constructor( providedOptions?: TryAgainButtonOptions ) {
    super( VegasStrings.tryAgainStringProperty, providedOptions );
  }
}

vegas.register( 'TryAgainButton', TryAgainButton );
