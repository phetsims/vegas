// Copyright 2018, University of Colorado Boulder

/**
 * Game timer display that appears in FiniteStatusBar.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var GameTimer = require( 'VEGAS/GameTimer' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var SimpleClockIcon = require( 'SCENERY_PHET/SimpleClockIcon' );
  var StatusBar = require( 'VEGAS/StatusBar' );
  var Text = require( 'SCENERY/nodes/Text' );
  var vegas = require( 'VEGAS/vegas' );

  /**
   * @param {Property.<number>} elapsedTimeProperty
   * @param {Object} [options]
   * @constructor
   */
  function ElapsedTimeNode( elapsedTimeProperty, options ) {

    options = _.extend( {
      spacing: 8,
      clockIconRadius: 15,
      font: StatusBar.DEFAULT_FONT,
      textFill: 'black'
    }, options );

    var clockIcon = new SimpleClockIcon( options.clockIconRadius );

    var timeValue = new Text( '', {
      font: options.font,
      fill: options.textFill
    } );

    assert && assert( !options.children, 'ElapsedTimeNode sets children' );
    options.children = [ clockIcon, timeValue ];

    HBox.call( this, options );

    // Update the time display
    var elapsedTimeListener = function( elapsedTime ) {
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