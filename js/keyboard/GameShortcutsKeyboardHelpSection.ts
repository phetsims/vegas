// Copyright 2025, University of Colorado Boulder

/**
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import optionize from '../../../phet-core/js/optionize.js';
import KeyboardHelpSection, { KeyboardHelpSectionOptions } from '../../../scenery-phet/js/keyboard/help/KeyboardHelpSection.js';
import KeyboardHelpSectionRow from '../../../scenery-phet/js/keyboard/help/KeyboardHelpSectionRow.js';
import CheckButton from '../buttons/CheckButton.js';
import vegas from '../vegas.js';
import VegasFluent from '../VegasFluent.js';

type SelfOptions = {

  // optional additional content rows to be included in this section
  additionalContent?: KeyboardHelpSectionRow[];
};

type ParentOptions = KeyboardHelpSectionOptions;
export type GameShortcutsKeyboardHelpSectionOptions = SelfOptions & ParentOptions;

export default class GameShortcutsKeyboardHelpSection extends KeyboardHelpSection {
  public constructor( providedOptions?: GameShortcutsKeyboardHelpSectionOptions ) {
    const options = optionize<GameShortcutsKeyboardHelpSectionOptions, SelfOptions, ParentOptions>()( {
      additionalContent: []
    }, providedOptions );

    // 'Check Answer with Alt + C'
    const checkAnswerRow = KeyboardHelpSectionRow.fromHotkeyData( CheckButton.CHECK_ANSWER_HOTKEY_DATA );

    const content = [
      checkAnswerRow,
      ...options.additionalContent
    ];

    // order the rows of content
    super( VegasFluent.keyboardHelpDialog.gameShortcutsStringProperty, content, options );
  }
}

vegas.register( 'GameShortcutsKeyboardHelpSection', GameShortcutsKeyboardHelpSection );