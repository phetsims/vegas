// Copyright 2002-2013, University of Colorado Boulder

/**
 * Button for initiating game levels and for depicting the progress made on each level.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
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
      cornerRadius: 10,
      // options for progress indicator (stars)
      progressIndicatorXMargin: 10,
      progressIndicatorYMargin: 5
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

    // Add the button foreground, which is the parent node for everything else that is on the button.
    var buttonForegroundNode = new Rectangle( 0, 0, options.buttonWidth, options.buttonHeight, options.cornerRadius, options.cornerRadius, {
      stroke: 'black',
      lineWidth: 1,
      fill: options.backgroundColor,
      cursor: 'pointer'
    } );
    this.addChild( buttonForegroundNode );

    //TODO add ability to specify the margins around the icon instead of hard-coding it here
    // Icon, scaled to fit.
    var iconScaleFactor = Math.min( options.buttonHeight * 0.65 / icon.height, options.buttonWidth * 0.85 / icon.width );
    icon.scale( iconScaleFactor );
    icon.centerX = options.buttonWidth / 2;
    icon.centerY = options.buttonHeight * 0.4;
    icon.pickable = false;
    buttonForegroundNode.addChild( icon );

    // Progress indicator (stars), scaled to fit
    var progressIndicatorBackground = new Rectangle( 0, 0, options.buttonWidth, options.buttonHeight * 0.2, options.cornerRadius, options.cornerRadius, {
      fill: 'white',
      stroke: 'black',
      lineWidth: 1,
      pickable: false,
      bottom: options.buttonHeight
    } );
    var progressIndicator = new ProgressIndicator( numStars, scoreProperty, perfectScore, {
      pickable: false,
      starDiameter: options.buttonWidth / ( numStars + 1 )
    } );
    progressIndicator.setScaleMagnitude( Math.min(
      ( progressIndicatorBackground.width - 2 * options.progressIndicatorXMargin ) / progressIndicator.width,
      ( progressIndicatorBackground.height - 2 * options.progressIndicatorYMargin ) / progressIndicator.height  ) );
    progressIndicator.center = progressIndicatorBackground.center;
    buttonForegroundNode.addChild( progressIndicatorBackground );
    buttonForegroundNode.addChild( progressIndicator );

    //TODO This behavior was borrowed from sun.PushButton, because sun.RectanglePushButton doesn't support the look/behavior of this button.
    // Add the listener to update the appearance and handle a click.
    var update = function( state ) {
      if ( state === 'up' ) {
        buttonForegroundNode.fill = options.backgroundColor;
        buttonForegroundNode.top = 0;
        buttonForegroundNode.left = 0;
      }
      else if ( state === 'over' ) {
        buttonForegroundNode.fill = options.highlightedBackgroundColor;
      }
      else if ( state === 'down' ) {
        buttonForegroundNode.fill = options.highlightedBackgroundColor;
        buttonForegroundNode.top = shadowOffset;
        buttonForegroundNode.left = shadowOffset;
      }
    };
    buttonForegroundNode.addInputListener( new ButtonListener( {
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