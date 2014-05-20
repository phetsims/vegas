// Copyright 2002-2013, University of Colorado Boulder

/**
 * Button for initiating game levels and for depicting the progress made on each level.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // Imports
  var ButtonListener = require( 'SCENERY/input/ButtonListener' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ProgressIndicator = require( 'VEGAS/ProgressIndicator' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  /**
   * @param {Image} icon Scenery node that appears on the button, scaled to fit
   * @param {number} numStars Number of stars to show in the progress indicator at the bottom of the button
   * @param {function} fireFunction Called when the button fires
   * @param {Property<number>} scoreProperty
   * @param {number} perfectScore
   * @param {*} options
   * @constructor
   */
  function LevelStartButton( icon, numStars, fireFunction, scoreProperty, perfectScore, options ) {

    options = _.extend( {
      buttonWidth: 150,
      buttonHeight: 150,
      backgroundColor: 'rgb( 242, 255, 204 )',
      highlightedBackgroundColor: 'rgb( 250, 255, 230 )',
      shadowColor: 'black',
      cornerRadius: 10
    }, options );
    var shadowOffset = 0.026 * options.buttonWidth;

    Node.call( this ); // Call super constructor.

    // Add the drop shadow.
    this.addChild( new Rectangle( 0, 0, options.buttonWidth, options.buttonHeight, options.cornerRadius, options.cornerRadius, {
        fill: options.shadowColor,
        top: shadowOffset,
        left: shadowOffset
      }
    ) );

    // Add the button outline, which is also the parent node for everything else that is on the button.
    var buttonOutline = new Rectangle( 0, 0, options.buttonWidth, options.buttonHeight, options.cornerRadius, options.cornerRadius, {
      stroke: 'black',
      lineWidth: 1,
      fill: options.backgroundColor,
      cursor: 'pointer'
    } );
    this.addChild( buttonOutline );

    // Icon, scaled to fit.
    var iconScaleFactor = Math.min( options.buttonHeight * 0.65 / icon.height, options.buttonWidth * 0.85 / icon.width );
    icon.scale( iconScaleFactor );
    icon.centerX = options.buttonWidth / 2;
    icon.centerY = options.buttonHeight * 0.4;
    icon.pickable = false;
    buttonOutline.addChild( icon );

    // Progress indicator (stars), scaled to fit
    var progressIndicatorBackground = new Rectangle( 0, 0, options.buttonWidth, options.buttonHeight * 0.2, options.cornerRadius, options.cornerRadius, {
      fill: 'white',
      stroke: 'black',
      lineWidth: 1,
      pickable: false,
      bottom: options.buttonHeight
    } );
    progressIndicatorBackground.addChild( new ProgressIndicator( numStars, options.buttonWidth / ( numStars + 1 ), scoreProperty, perfectScore, {
      centerX: progressIndicatorBackground.centerX,
      centerY: progressIndicatorBackground.height / 2,
      pickable: false
    } ) );
    buttonOutline.addChild( progressIndicatorBackground );

    //TODO This behavior was borrowed from sun.PushButton, because sun.RectanglePushButton doesn't support the look/behavior of this button.
    // Add the listener to update the appearance and handle a click.
    var update = function( state ) {
      if ( state === 'up' ) {
        buttonOutline.fill = options.backgroundColor;
        buttonOutline.top = 0;
        buttonOutline.left = 0;
      }
      else if ( state === 'over' ) {
        buttonOutline.fill = options.highlightedBackgroundColor;
      }
      else if ( state === 'down' ) {
        buttonOutline.fill = options.highlightedBackgroundColor;
        buttonOutline.top = shadowOffset;
        buttonOutline.left = shadowOffset;
      }
    };
    buttonOutline.addInputListener( new ButtonListener( {
      up: function() { update( 'up' ); },
      over: function() { update( 'over' ); },
      down: function() { update( 'down' ); },
      out: function() { update( 'up' ); }, // 'out' state looks the same as 'up'
      fire: fireFunction
    } ) );

    // Update for initial state
    update( 'up' );

    // Pass options to parent class
    this.mutate( options );
  }

  return inherit( Node, LevelStartButton );
} );
