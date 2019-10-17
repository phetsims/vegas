// Copyright 2018-2019, University of Colorado Boulder

/**
 * Game timer display that appears in FiniteStatusBar.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const GameTimer = require( 'VEGAS/GameTimer' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const inherit = require( 'PHET_CORE/inherit' );
  const merge = require( 'PHET_CORE/merge' );
  const SimpleClockIcon = require( 'SCENERY_PHET/SimpleClockIcon' );
  const StatusBar = require( 'VEGAS/StatusBar' );
  const Text = require( 'SCENERY/nodes/Text' );
  const vegas = require( 'VEGAS/vegas' );

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

  return inherit( HBox, ElapsedTimeNode, {

    /**
     * @public
     * @override
     */
    dispose: function() {
      this.disposeElapsedTimeNode();
      HBox.prototype.dispose.call( this );
    }
  } );

} );