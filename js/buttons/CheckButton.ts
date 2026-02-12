// Copyright 2025-2026, University of Colorado Boulder

/**
 * A button component for checking answers in a game.
 *
 * This button provides default accessibility content, including an accessible name and help text.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import HotkeyData from '../../../scenery/js/input/HotkeyData.js';
import KeyboardListener from '../../../scenery/js/listeners/KeyboardListener.js';
import TextPushButton, { TextPushButtonOptions } from '../../../sun/js/buttons/TextPushButton.js';
import vegas from '../vegas.js';
import VegasFluent from '../VegasFluent.js';
import VegasStrings from '../VegasStrings.js';

type SelfOptions = EmptySelfOptions;
type ParentOptions = TextPushButtonOptions;
export type CheckButtonOptions = SelfOptions & ParentOptions;

export default class CheckButton extends TextPushButton {
  private readonly disposeCheckButton: () => void;

  public constructor( providedOptions?: CheckButtonOptions ) {
    super( VegasStrings.checkStringProperty, optionize<CheckButtonOptions, SelfOptions, ParentOptions>()( {
      accessibleName: VegasStrings.a11y.checkButton.accessibleNameStringProperty
    }, providedOptions ) );

    const keyboardListener = KeyboardListener.createGlobal( this, {
      keyStringProperties: CheckButton.CHECK_ANSWER_HOTKEY_DATA.keyStringProperties,
      fire: () => this.pdomClick(),

      // fires on up because we want keys to be released upon change of focus
      fireOnDown: false
    } );

    this.disposeCheckButton = () => {
      keyboardListener.dispose();
    };
  }

  public override dispose(): void {
    this.disposeCheckButton();
    super.dispose();
  }

  public static readonly CHECK_ANSWER_HOTKEY_DATA = new HotkeyData( {
    keys: [ 'alt+c' ],

    // visual label for this Hotkey in the Keyboard Help dialog
    keyboardHelpDialogLabelStringProperty: VegasFluent.keyboardHelpDialog.checkAnswerStringProperty,

    repoName: vegas.name,
    global: true
  } );
}

vegas.register( 'CheckButton', CheckButton );
