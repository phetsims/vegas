// Copyright 2025, University of Colorado Boulder

/**
 * A button component for showing game information.
 *
 * This button provides default accessibility content, including an accessible name and help text.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import InfoButton, { InfoButtonOptions } from '../../../scenery-phet/js/buttons/InfoButton.js';
import vegas from '../vegas.js';
import VegasStrings from '../VegasStrings.js';


type SelfOptions = EmptySelfOptions;
type ParentOptions = InfoButtonOptions;
export type GameInfoButtonOptions = SelfOptions & ParentOptions;

export default class GameInfoButton extends InfoButton {
  public constructor( providedOptions?: GameInfoButtonOptions ) {
    super( optionize<GameInfoButtonOptions, SelfOptions, ParentOptions>()( {
      accessibleName: VegasStrings.a11y.gameInfoButton.accessibleNameStringProperty,
      accessibleHelpText: VegasStrings.a11y.gameInfoButton.accessibleHelpTextStringProperty
    }, providedOptions ) );
  }
}

vegas.register( 'GameInfoButton', GameInfoButton );
