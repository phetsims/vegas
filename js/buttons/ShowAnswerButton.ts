// Copyright 2025, University of Colorado Boulder

/**
 * A button component for showing the answer in a game.
 *
 * This button provides default accessibility content.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import TextPushButton, { TextPushButtonOptions } from '../../../sun/js/buttons/TextPushButton.js';
import vegas from '../vegas.js';
import VegasFluent from '../VegasFluent.js';
import VegasStrings from '../VegasStrings.js';

type SelfOptions = EmptySelfOptions;
type ParentOptions = TextPushButtonOptions;
export type ShowAnswerButtonOptions = SelfOptions & ParentOptions;


export default class ShowAnswerButton extends TextPushButton {
  public constructor( providedOptions?: ShowAnswerButtonOptions ) {
    super( VegasStrings.showAnswerStringProperty, optionize<ShowAnswerButtonOptions, SelfOptions, ParentOptions>()( {
      accessibleHelpText: VegasFluent.a11y.showAnswerButton.accessibleHelpTextStringProperty,
      accessibleContextResponse: VegasFluent.a11y.showAnswerButton.accessibleContextResponseStringProperty
    }, providedOptions ) );
  }
}

vegas.register( 'ShowAnswerButton', ShowAnswerButton );
