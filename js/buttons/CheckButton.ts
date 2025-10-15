// Copyright 2025, University of Colorado Boulder

/**
 * A button component for checking answers in a game.
 *
 * This button provides default accessibility content, including an accessible name and help text.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import TextPushButton, { TextPushButtonOptions } from '../../../sun/js/buttons/TextPushButton.js';
import vegas from '../vegas.js';
import VegasStrings from '../VegasStrings.js';

type SelfOptions = EmptySelfOptions;
type ParentOptions = TextPushButtonOptions;
export type CheckButtonOptions = SelfOptions & ParentOptions;

export default class CheckButton extends TextPushButton {
  public constructor( providedOptions?: CheckButtonOptions ) {
    super( VegasStrings.checkStringProperty, optionize<CheckButtonOptions, SelfOptions, ParentOptions>()( {
      accessibleName: VegasStrings.a11y.checkButton.accessibleNameStringProperty
    }, providedOptions ) );
  }
}

vegas.register( 'CheckButton', CheckButton );
