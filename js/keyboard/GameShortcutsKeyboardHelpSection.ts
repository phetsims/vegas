// Copyright 2025, University of Colorado Boulder

/**
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import KeyboardHelpSection, { KeyboardHelpSectionOptions } from '../../../scenery-phet/js/keyboard/help/KeyboardHelpSection.js';
import KeyboardHelpSectionRow from '../../../scenery-phet/js/keyboard/help/KeyboardHelpSectionRow.js';
import CheckButton from '../buttons/CheckButton.js';
import vegas from '../vegas.js';
import VegasFluent from '../VegasFluent.js';

export default class GameShortcutsKeyboardHelpSection extends KeyboardHelpSection {
  public constructor( options?: KeyboardHelpSectionOptions ) {
    const additionalContent: KeyboardHelpSectionRow[] = [];

    // 'Check Answer with Alt + C'
    const checkAnswerRow = KeyboardHelpSectionRow.fromHotkeyData( CheckButton.CHECK_ANSWER_HOTKEY_DATA );

    const content = [
      checkAnswerRow,
      ...additionalContent
    ];

    // order the rows of content
    super( VegasFluent.keyboardHelpDialog.gameShortcutsStringProperty, content, options );
  }
}

vegas.register( 'GameShortcutsKeyboardHelpSection', GameShortcutsKeyboardHelpSection );