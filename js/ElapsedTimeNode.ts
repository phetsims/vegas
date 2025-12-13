// Copyright 2018-2025, University of Colorado Boulder

/**
 * ElapsedTimeNode shows the elapsed time in a game status bar (FiniteStatusBar).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ReadOnlyProperty from '../../axon/js/ReadOnlyProperty.js';
import StringProperty from '../../axon/js/StringProperty.js';
import { TReadOnlyProperty } from '../../axon/js/TReadOnlyProperty.js';
import optionize from '../../phet-core/js/optionize.js';
import StrictOmit from '../../phet-core/js/types/StrictOmit.js';
import SimpleClockIcon from '../../scenery-phet/js/SimpleClockIcon.js';
import StatusBar from '../../scenery-phet/js/StatusBar.js';
import HBox, { HBoxOptions } from '../../scenery/js/layout/nodes/HBox.js';
import Text from '../../scenery/js/nodes/Text.js';
import Font from '../../scenery/js/util/Font.js';
import TColor from '../../scenery/js/util/TColor.js';
import Tandem from '../../tandem/js/Tandem.js';
import GameTimer from './GameTimer.js';
import GameUtils from './GameUtils.js';
import vegas from './vegas.js';
import VegasFluent from './VegasFluent.js';

type SelfOptions = {
  clockIconRadius?: number;
  font?: Font;
  textFill?: TColor;
};

export type ElapsedTimeNodeOptions = SelfOptions & StrictOmit<HBoxOptions, 'children'>;

export default class ElapsedTimeNode extends HBox {

  private readonly disposeElapsedTimeNode: () => void;

  // The time value, in a readable format for display.
  private readonly _timeValueStringProperty = new StringProperty( '' );
  public readonly timeValueStringProperty: TReadOnlyProperty<string>;

  public constructor( elapsedTimeProperty: ReadOnlyProperty<number>, providedOptions?: ElapsedTimeNodeOptions ) {

    const options = optionize<ElapsedTimeNodeOptions, SelfOptions, HBoxOptions>()( {

      // SelfOptions
      clockIconRadius: 15,
      font: StatusBar.DEFAULT_FONT,
      textFill: 'black',

      // HBoxOptions
      spacing: 8,
      tandem: Tandem.OPTIONAL
    }, providedOptions );

    const clockIcon = new SimpleClockIcon( options.clockIconRadius );

    const timeValue = new Text( '', {
      font: options.font,
      fill: options.textFill
    } );

    options.children = [ clockIcon, timeValue ];

    super( options );

    this.timeValueStringProperty = VegasFluent.a11y.timeDisplayPattern.createProperty( {
      hours: elapsedTimeProperty.derived( time => GameUtils.extractHoursMinutesAndSeconds( time ).hours ),
      minutes: elapsedTimeProperty.derived( time => GameUtils.extractHoursMinutesAndSeconds( time ).minutes ),
      seconds: elapsedTimeProperty.derived( time => GameUtils.extractHoursMinutesAndSeconds( time ).seconds )
    } );

    // Update the time display.
    const elapsedTimePropertyListener = ( elapsedTime: number ) => {
      timeValue.string = GameTimer.formatTime( elapsedTime );
    };
    elapsedTimeProperty.link( elapsedTimePropertyListener );

    if ( this.isPhetioInstrumented() && elapsedTimeProperty.isPhetioInstrumented() ) {
      this.addLinkedElement( elapsedTimeProperty );
    }

    this.disposeElapsedTimeNode = () => {
      this._timeValueStringProperty.dispose();
      elapsedTimeProperty.unlink( elapsedTimePropertyListener );
    };
  }

  public override dispose(): void {
    this.disposeElapsedTimeNode();
    super.dispose();
  }
}

vegas.register( 'ElapsedTimeNode', ElapsedTimeNode );