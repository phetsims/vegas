// Copyright 2018-2020, University of Colorado Boulder

/**
 * Game timer display that appears in FiniteStatusBar.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import inherit from '../../phet-core/js/inherit.js';
import merge from '../../phet-core/js/merge.js';
import SimpleClockIcon from '../../scenery-phet/js/SimpleClockIcon.js';
import HBox from '../../scenery/js/nodes/HBox.js';
import Text from '../../scenery/js/nodes/Text.js';
import GameTimer from './GameTimer.js';
import StatusBar from './StatusBar.js';
import vegas from './vegas.js';

/**
 * @param {Property.<number>} elapsedTimeProperty
 * @param {Object} [options]
 * @constructor
 */
function ElapsedTimeNode( elapsedTimeProperty, options ) {

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

  HBox.call( this, options );

  // Update the time display
  const elapsedTimeListener = function( elapsedTime ) {
    timeValue.text = GameTimer.formatTime( elapsedTime );
  };
  elapsedTimeProperty.link( elapsedTimeListener );

  // @private
  this.disposeElapsedTimeNode = function() {
    if ( elapsedTimeProperty.hasListener( elapsedTimeListener ) ) {
      elapsedTimeProperty.unlink( elapsedTimeListener );
    }
  };
}

vegas.register( 'ElapsedTimeNode', ElapsedTimeNode );

inherit( HBox, ElapsedTimeNode, {

  /**
   * @public
   * @override
   */
  dispose: function() {
    this.disposeElapsedTimeNode();
    HBox.prototype.dispose.call( this );
  }
} );

export default ElapsedTimeNode;