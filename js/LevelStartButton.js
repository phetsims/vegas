// Copyright 2002-2013, University of Colorado Boulder

/**
 * A type that defines a specialized button for initiating game levels and for
 * depicting the progress made on each level.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // Imports
  var inherit = require( 'PHET_CORE/inherit' );
  var ProgressIndicator = require( 'VEGAS/ProgressIndicator' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Text = require( 'SCENERY/nodes/Text' );

  // Constants
  var WIDTH = 150; // In screen coords, which are roughly pixels.
  var HEIGHT = 150; // In screen coords, which are roughly pixels.
  var BACKGROUND_COLOR = 'rgb( 242, 255, 204 )';
  var HIGHLIGHTED_BACKGROUND_COLOR = 'rgb( 250, 255, 230 )';
  var DROP_SHADOW_OFFSET = WIDTH * 0.02;
  var CORNER_ROUNDING = 10;

  /**
   * @param {Image} icon Scenery image that appears on the button, scaled to fit
   * @param {number} numStars Number of stars to show in the progress indicator at the bottom of the button
   * @param {function} onFireFunction
   * @param {Property} scoreProperty
   * @param {number} maxPossibleScore
   * @constructor
   */
  function LevelStartButton( icon, numStars, onFireFunction, scoreProperty, maxPossibleScore ) {

    Node.call( this ); // Call super constructor.
    var thisNode = this;

    // Add the drop shadow.
    this.addChild( new Rectangle( 0, 0, WIDTH, HEIGHT, CORNER_ROUNDING, CORNER_ROUNDING,
      {
        stroke: 'black',
        lineWidth: 1,
        fill: 'black',
        top: DROP_SHADOW_OFFSET,
        left: DROP_SHADOW_OFFSET
      }
    ) );

    // Add the button outline, which is also the root node for everything else
    // that is on the button.
    var buttonOutline = new Rectangle( 0, 0, WIDTH, HEIGHT, CORNER_ROUNDING, CORNER_ROUNDING,
      {
        stroke: 'black',
        lineWidth: 1,
        fill: BACKGROUND_COLOR,
        cursor: 'pointer'
      } );
    thisNode.addChild( buttonOutline );

    // Add the icon, scaling as needed.
    var iconScaleFactor = Math.min( HEIGHT * 0.65 / icon.height, WIDTH * 0.85 / icon.width );
    icon.scale( iconScaleFactor );
    icon.centerX = WIDTH / 2;
    icon.centerY = HEIGHT * 0.4;
    buttonOutline.addChild( icon );

    // Add the progress indicator to the button.
    var progressIndicatorBackground = new Rectangle( 0, 0, WIDTH, HEIGHT * 0.2, CORNER_ROUNDING, CORNER_ROUNDING,
      {
        fill: 'white',
        stroke: 'black', lineWidth: 1
      } ).mutate( { bottom: HEIGHT } );
    progressIndicatorBackground.addChild( new ProgressIndicator( numStars, WIDTH / 6, scoreProperty, maxPossibleScore ).mutate(
      { centerX: buttonOutline.width / 2, centerY: progressIndicatorBackground.height / 2 } ) );
    buttonOutline.addChild( progressIndicatorBackground );

    // Add the listener to update the appearance and handle a click.
    thisNode._armed = false;
    buttonOutline.addInputListener(
      {
        down: function() {
          buttonOutline.fill = HIGHLIGHTED_BACKGROUND_COLOR;
          buttonOutline.top = DROP_SHADOW_OFFSET;
          buttonOutline.left = DROP_SHADOW_OFFSET;
          thisNode._armed = true;
        },
        over: function() {
          buttonOutline.fill = HIGHLIGHTED_BACKGROUND_COLOR;
        },
        out: function() {
          buttonOutline.fill = BACKGROUND_COLOR;
        },
        up: function() {
          buttonOutline.fill = BACKGROUND_COLOR;
          buttonOutline.top = 0;
          buttonOutline.left = 0;
          if ( thisNode._armed ) {
            onFireFunction();
          }
        }
      } );
  };

  return inherit( Node, LevelStartButton );
} );
