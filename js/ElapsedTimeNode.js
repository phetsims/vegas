// Copyright 2018-2020, University of Colorado Boulder

/**
 * ElapsedTimeNode shows the elapsed time in a game status bar (FiniteStatusBar).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../phet-core/js/merge.js';
import SimpleClockIcon from '../../scenery-phet/js/SimpleClockIcon.js';
import { HBox } from '../../scenery/js/imports.js';
import { Text } from '../../scenery/js/imports.js';
import GameTimer from './GameTimer.js';
import StatusBar from './StatusBar.js';
import vegas from './vegas.js';

class ElapsedTimeNode extends HBox {

  /**
   * @param {Property.<number>} elapsedTimeProperty
   * @param {Object} [options]
   */
  constructor( elapsedTimeProperty, options ) {

    options = merge( {
      spacing: 8,
      clockIconRadius: 15,
      font: StatusBar.DEFAULT_FONT,
      textFill: 'black'
    }, options );

    const clockIcon = new SimpleClockIcon( options.clockIconRadius );

    const timeValue = new Text( '', {
      font: options.font,
      fill: options.textFill
    } );

    assert && assert( !options.children, 'ElapsedTimeNode sets children' );
    options.children = [ clockIcon, timeValue ];

    super( options );

    // Update the time display
    const elapsedTimeListener = elapsedTime => {
      timeValue.text = GameTimer.formatTime( elapsedTime );
    };
    elapsedTimeProperty.link( elapsedTimeListener );

    // @private
    this.disposeElapsedTimeNode = () => {
      if ( elapsedTimeProperty.hasListener( elapsedTimeListener ) ) {
        elapsedTimeProperty.unlink( elapsedTimeListener );
      }
    };
  }

  /**
   * @public
   * @override
   */
  dispose() {
    this.disposeElapsedTimeNode();
    super.dispose();
  }
}

vegas.register( 'ElapsedTimeNode', ElapsedTimeNode );
export default ElapsedTimeNode;