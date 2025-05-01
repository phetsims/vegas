// Copyright 2018-2025, University of Colorado Boulder

/**
 * ElapsedTimeNode shows the elapsed time in a game status bar (FiniteStatusBar).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Multilink from '../../axon/js/Multilink.js';
import optionize from '../../phet-core/js/optionize.js';
import StrictOmit from '../../phet-core/js/types/StrictOmit.js';
import SimpleClockIcon from '../../scenery-phet/js/SimpleClockIcon.js';
import StatusBar from '../../scenery-phet/js/StatusBar.js';
import HBox, { HBoxOptions } from '../../scenery/js/layout/nodes/HBox.js';
import Text from '../../scenery/js/nodes/Text.js';
import Font from '../../scenery/js/util/Font.js';
import TColor from '../../scenery/js/util/TColor.js';
import GameTimer from './GameTimer.js';
import vegas from './vegas.js';
import VegasStrings from './VegasStrings.js';
import ReadOnlyProperty from '../../axon/js/ReadOnlyProperty.js';
import Tandem from '../../tandem/js/Tandem.js';

type SelfOptions = {
  clockIconRadius?: number;
  font?: Font;
  textFill?: TColor;
};

export type ElapsedTimeNodeOptions = SelfOptions & StrictOmit<HBoxOptions, 'children'>;

export default class ElapsedTimeNode extends HBox {

  private readonly disposeElapsedTimeNode: () => void;

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

    // Update the time display.
    const multilink = new Multilink( [
      elapsedTimeProperty,

      // Dynamic strings used by GameTimer.formatTime
      VegasStrings.pattern[ '0hours' ][ '1minutes' ][ '2secondsStringProperty' ],
      VegasStrings.pattern[ '0minutes' ][ '1secondsStringProperty' ]
    ], ( elapsedTime, pattern1, pattern2 ) => {
      timeValue.string = GameTimer.formatTime( elapsedTime );
    } );

    if ( this.isPhetioInstrumented() && elapsedTimeProperty.isPhetioInstrumented() ) {
      this.addLinkedElement( elapsedTimeProperty );
    }

    this.disposeElapsedTimeNode = () => {
      multilink.dispose();
    };
  }

  public override dispose(): void {
    this.disposeElapsedTimeNode();
    super.dispose();
  }
}

vegas.register( 'ElapsedTimeNode', ElapsedTimeNode );