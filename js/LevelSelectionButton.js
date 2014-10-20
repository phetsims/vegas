// Copyright 2002-2014, University of Colorado Boulder

/**
 * Button for selecting a game level.
 * Also depicts the progress made on each level.
 *
 * @author John Blanco
 * @author Chris Malley
 */
define( function( require ) {
  'use strict';

  // modules
  var ButtonListener = require( 'SCENERY/input/ButtonListener' );
  var GameTimer = require( 'VEGAS/GameTimer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var ProgressIndicator = require( 'VEGAS/ProgressIndicator' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var Text = require( 'SCENERY/nodes/Text' );

  /**
   * @param {Node} icon Scenery node that appears on the button above the progress indicator, scaled to fit
   * @param {number} numStars Number of stars to show in the progress indicator at the bottom of the button
   * @param {function} fireFunction Called when the button fires
   * @param {Property.<number>} scoreProperty
   * @param {number} perfectScore
   * @param {Object} [options]
   * @constructor
   */
  function LevelSelectionButton( icon, numStars, fireFunction, scoreProperty, perfectScore, options ) {

    Node.call( this );

    options = _.extend( {
      // button size and appearance
      buttonWidth: 150,
      buttonHeight: 150,
      cornerRadius: 10,
      baseColor: 'rgb( 242, 255, 204 )',
      buttonXMargin: 10,
      buttonYMargin: 10,
      // progress indicator (stars)
      progressIndicatorProportion: 0.2, // percentage of the button height occupied by the progress indicator, (0,0.5]
      progressIndicatorMinXMargin: 10,
      progressIndicatorMinYMargin: 5,
      iconToProgressIndicatorYSpace: 5,
      // best time (optional)
      bestTimeProperty: null, // null if no best time || {Property.<number>} best time in seconds
      bestTimeVisibleProperty: null, // null || Property.<boolean>} controls visibility of best time
      bestTimeFill: 'black',
      bestTimeFont: new PhetFont( 24 ),
      bestTimeYSpacing: 10  // vertical space between drop shadow and best time
    }, options );

    assert && assert( options.progressIndicatorProportion > 0 && options.progressIndicatorProportion <= 0.5, 'progressIndicatorProportion value out of range' );

    var maxContentWidth = options.buttonWidth - 2 * options.buttonXMargin;

    // Progress indicator (stars), scaled to fit
    var progressIndicatorBackground = new Rectangle( 0, 0, maxContentWidth,
        options.buttonHeight * options.progressIndicatorProportion, options.cornerRadius, options.cornerRadius, {
        fill: 'white',
        stroke: 'black',
        lineWidth: 1,
        pickable: false
      } );
    var progressIndicator = new ProgressIndicator( numStars, scoreProperty, perfectScore, {
      pickable: false,
      starDiameter: options.buttonWidth / ( numStars + 1 )
    } );
    progressIndicator.scale( Math.min(
        ( progressIndicatorBackground.width - 2 * options.progressIndicatorMinXMargin ) / progressIndicator.width,
        ( progressIndicatorBackground.height - 2 * options.progressIndicatorMinYMargin ) / progressIndicator.height ) );

    // Icon, scaled to fit.
    var iconYSpace = options.buttonHeight - progressIndicatorBackground.height - 2 * options.buttonYMargin; // vertical space available for icon
    var iconScaleFactor = Math.min( maxContentWidth / icon.width, iconYSpace / icon.height );
    icon.scale( iconScaleFactor );
    icon.pickable = false;

    // Assemble the content.
    var contentNode = new Node();
    if ( progressIndicatorBackground.width > icon.width ) {
      icon.centerX = progressIndicatorBackground.centerX;
    }
    else {
      progressIndicatorBackground.centerX = icon.centerX;
    }
    progressIndicatorBackground.top = icon.bottom + options.iconToProgressIndicatorYSpace;
    progressIndicator.center = progressIndicatorBackground.center;
    contentNode.addChild( icon );
    contentNode.addChild( progressIndicatorBackground );
    contentNode.addChild( progressIndicator );

    // Create the button
    var buttonOptions = {
      content: contentNode,
      xMargin: options.buttonXMargin,
      yMargin: options.buttonYMargin,
      baseColor: options.baseColor,
      cornerRadius: options.cornerRadius,
      listener: fireFunction
    };
    var button = new RectangularPushButton( buttonOptions );
    this.addChild( button );

    // Best time (optional), centered below the button, does not move when button is pressed
    if ( options.bestTimeProperty ) {
      var bestTimeNode = new Text( '', { font: options.bestTimeFont, fill: options.bestTimeFill } );
      this.addChild( bestTimeNode );
      options.bestTimeProperty.link( function( bestTime ) {
        bestTimeNode.text = ( bestTime ? GameTimer.formatTime( bestTime ) : '' );
        bestTimeNode.centerX = button.centerX;
        bestTimeNode.top = button.bottom + options.bestTimeYSpacing;
      } );
      if ( options.bestTimeVisibleProperty ) {
        options.bestTimeVisibleProperty.linkAttribute( bestTimeNode, 'visible' );
      }
    }

    // Pass options to parent class
    this.mutate( options );
  }

  return inherit( Node, LevelSelectionButton );
} );