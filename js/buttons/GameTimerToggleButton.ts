// Copyright 2025, University of Colorado Boulder

/**
 * A button component for toggling the game timer.
 *
 * This button provides default accessibility content, including accessible context responses for on and off states.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Property from '../../../axon/js/Property.js';
import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import TimerToggleButton, { TimerToggleButtonOptions } from '../../../scenery-phet/js/buttons/TimerToggleButton.js';
import vegas from '../vegas.js';
import VegasFluent from '../VegasFluent.js';

type SelfOptions = EmptySelfOptions;
type ParentOptions = TimerToggleButtonOptions;
export type GameTimerToggleButtonOptions = SelfOptions & ParentOptions;

export default class GameTimerToggleButton extends TimerToggleButton {
  public constructor( timerRunningProperty: Property<boolean>, providedOptions?: GameTimerToggleButtonOptions ) {
    super( timerRunningProperty, optionize<GameTimerToggleButtonOptions, SelfOptions, ParentOptions>()( {
      accessibleContextResponseOn: VegasFluent.a11y.gameTimerToggleButton.accessibleContextResponseOnStringProperty,
      accessibleContextResponseOff: VegasFluent.a11y.gameTimerToggleButton.accessibleContextResponseOffStringProperty
    }, providedOptions ) );
  }
}

vegas.register( 'GameTimerToggleButton', GameTimerToggleButton );
