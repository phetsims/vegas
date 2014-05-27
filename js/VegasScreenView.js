// Copyright 2002-2014, University of Colorado Boulder

/**
 * Main ScreenView container for Buttons portion of the UI component demo.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var OutsideBackgroundNode = require( 'SCENERY_PHET/OutsideBackgroundNode' );
  var Property = require( 'AXON/Property' );
  var HSlider = require( 'SUN/HSlider' );
  var ProgressIndicator = require( 'VEGAS/ProgressIndicator' );

  function VegasScreenView() {
    ScreenView.call( this, { renderer: 'svg' } );

    // background
    this.addChild( new OutsideBackgroundNode( this.layoutBounds.centerX, this.layoutBounds.centerY + 20, this.layoutBounds.width * 3, this.layoutBounds.height, this.layoutBounds.height ) );

    var scoreProperty = new Property( 1 );

    this.addChild( new ProgressIndicator( 4, scoreProperty, 1, { left: 20, top: 20, scale: 2 } ) );
    this.addChild( new HSlider( scoreProperty, {min: 0, max: 1} ).mutate( {left: 20, top: 80} ) );
  }

  return inherit( ScreenView, VegasScreenView, {
    step: function( timeElapsed ) {
      // Does nothing for now.
    }
  } );
} );