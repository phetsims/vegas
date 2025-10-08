// Copyright 2025, University of Colorado Boulder

/**
 * A button component for showing the answer in a game.
 *
 * This button provides default accessibility content, including an accessible name.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import TextPushButton, { TextPushButtonOptions } from '../../../sun/js/buttons/TextPushButton.js';
import vegas from '../vegas.js';
import VegasStrings from '../VegasStrings.js';

export type ShowAnswerButtonOptions = TextPushButtonOptions;

export default class ShowAnswerButton extends TextPushButton {
  public constructor( providedOptions?: ShowAnswerButtonOptions ) {

    // TODO: Is this an alternative accessible name? "Show answer to move on."
    //   See https://github.com/phetsims/vegas/issues/138
    //   Discussion: Here is the content:
    //   Accessible Name: "Show Answer"
    //   Accessible Help Text: "Review answer to move on."
    //   Accessible Context Response: "Answer displayed. Review and move on."
    super( VegasStrings.showAnswerStringProperty, providedOptions );
  }
}

vegas.register( 'ShowAnswerButton', ShowAnswerButton );
