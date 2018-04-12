// Copyright 2014-2018, University of Colorado Boulder

/**
 * Button for selecting a game level.
 * Also depicts the progress made on each level.
 *
 * @author John Blanco
 * @author Chris Malley
 * @author Andrea Lin
 * @deprecated use LevelSelectionButton
 */
define( function( require ) {
  'use strict';

  // modules
  var Dimension2 = require( 'DOT/Dimension2' );
  var GameTimer = require( 'VEGAS/GameTimer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var ScoreDisplayDiscreteStars = require( 'VEGAS/ScoreDisplayDiscreteStars' );
  var ScoreDisplayNumberAndStar = require( 'VEGAS/ScoreDisplayNumberAndStar' );
  var ScoreDisplayTextAndNumber = require( 'VEGAS/ScoreDisplayTextAndNumber' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var Tandem = require( 'TANDEM/Tandem' );
  var Text = require( 'SCENERY/nodes/Text' );
  var vegas = require( 'VEGAS/vegas' );

  // constants
  var SCALING_TOLERANCE = 1E-4; // Empirically chosen as something the human eye is unlikely to notice.

  /**
   * @param {Node} icon Scenery node that appears on the button above the progress indicator, scaled to fit
   * @param {number} numStars Number of stars to show in the progress indicator at the bottom of the button
   * @param {function} fireFunction Called when the button fires
   * @param {Property.<number>} scoreProperty
   * @param {number} perfectScore
   * @param {Object} [options]
   * @constructor
   */
  function LevelSelectionItemNode( icon, numStars, fireFunction, scoreProperty, perfectScore, options ) {
    // TODO: numStars and perfectScore not necessarily necessary

    assert && assert( icon instanceof Node );
    assert && assert( typeof numStars === 'number' );

    options = _.extend( {

      // score display type
      scoreDisplayType: 'discreteStars', // or 'numberAndStar' or 'textAndNumber'

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
      iconToProgressIndicatorYSpace: 10,
      // best time (optional)
      bestTimeProperty: null, // null if no best time || {Property.<number>} best time in seconds
      bestTimeVisibleProperty: null, // null || Property.<boolean>} controls visibility of best time
      bestTimeFill: 'black',
      bestTimeFont: new PhetFont( 24 ),
      bestTimeYSpacing: 10,  // vertical space between drop shadow and best time

      // Tandem
      tandem: Tandem.required
    }, options );

    Node.call( this );

    assert && assert(
      options.progressIndicatorProportion > 0 && options.progressIndicatorProportion <= 0.5,
      'progressIndicatorProportion value out of range'
    );

    var maxContentWidth = options.buttonWidth - 2 * options.buttonXMargin;

    // Progress indicator (stars), scaled to fit
    var progressIndicatorBackground = new Rectangle( 0, 0, maxContentWidth,
      options.buttonHeight * options.progressIndicatorProportion, options.cornerRadius, options.cornerRadius, {
        fill: 'white',
        stroke: 'black',
        lineWidth: 1,
        pickable: false
      } );

    var scoreDisplayOptions = { pickable: false };

    // TODO: assert options.scoreDisplayType provided is right
    //TODO memory leak, progressIndicator links to scoreProperty and is not disposed
    if ( options.scoreDisplayType === 'discreteStars' ) {
      var progressIndicator = new ScoreDisplayDiscreteStars( scoreProperty, _.extend( {}, scoreDisplayOptions, {
        numStars: numStars,
        perfectScore: perfectScore
      } ) );
    }
    else if ( options.scoreDisplayType === 'numberAndStar' ) {
      progressIndicator = new ScoreDisplayNumberAndStar( scoreProperty, scoreDisplayOptions );
    }
    else {
      progressIndicator = new ScoreDisplayTextAndNumber( scoreProperty, scoreDisplayOptions );
    }
    
    progressIndicator.scale( Math.min(
      ( progressIndicatorBackground.width - 2 * options.progressIndicatorMinXMargin ) / progressIndicator.width,
      ( progressIndicatorBackground.height - 2 * options.progressIndicatorMinYMargin ) / progressIndicator.height ) );

    // Icon, scaled and padded to fit and to make the button size correct.
    var iconSize = new Dimension2( maxContentWidth, options.buttonHeight - progressIndicatorBackground.height -
                                                    2 * options.buttonYMargin - options.iconToProgressIndicatorYSpace );
    var adjustedIcon = LevelSelectionItemNode.createSizedImageNode( icon, iconSize );
    adjustedIcon.pickable = false; // TODO: is this needed?

    // Assemble the content.
    var contentNode = new Node();
    if ( progressIndicatorBackground.width > adjustedIcon.width ) {
      adjustedIcon.centerX = progressIndicatorBackground.centerX;
    }
    else {
      progressIndicatorBackground.centerX = adjustedIcon.centerX;
    }
    progressIndicatorBackground.top = adjustedIcon.bottom + options.iconToProgressIndicatorYSpace;
    progressIndicator.center = progressIndicatorBackground.center;
    contentNode.addChild( adjustedIcon );
    contentNode.addChild( progressIndicatorBackground );
    contentNode.addChild( progressIndicator );

    // Create the button
    var buttonOptions = {
      content: contentNode,
      xMargin: options.buttonXMargin,
      yMargin: options.buttonYMargin,
      baseColor: options.baseColor,
      cornerRadius: options.cornerRadius,
      listener: fireFunction,

      // TODO: if LevelSelectionItemNode changes to inheritance, this will have to change,
      // see https://github.com/phetsims/vegas/issues/56
      tandem: options.tandem.createTandem( 'button' )
    };

    var button = new RectangularPushButton( buttonOptions );
    this.addChild( button );

    // Best time (optional), centered below the button, does not move when button is pressed
    if ( options.bestTimeProperty ) {
      var bestTimeNode = new Text( '', { font: options.bestTimeFont, fill: options.bestTimeFill } );
      this.addChild( bestTimeNode );

      //TODO memory leak, missing unlink
      options.bestTimeProperty.link( function( bestTime ) {
        bestTimeNode.text = ( bestTime ? GameTimer.formatTime( bestTime ) : '' );
        bestTimeNode.centerX = button.centerX;
        bestTimeNode.top = button.bottom + options.bestTimeYSpacing;
      } );

      if ( options.bestTimeVisibleProperty ) {
        // TODO memory leak, missing unlinkAttribute
        options.bestTimeVisibleProperty.linkAttribute( bestTimeNode, 'visible' );
      }
    }

    // Pass options to parent class
    this.mutate( options );
  }

  vegas.register( 'LevelSelectionItemNode', LevelSelectionItemNode );

  return inherit( Node, LevelSelectionItemNode, {}, {
    /**
     * Creates a new the same dimensions as size with the specified icon. The icon will be scaled to fit, and a
     * background with the specified size may be added to ensure the bounds of the returned node are correct.
     * @public
     *
     * @param {Node} icon
     * @param {Dimension2} size
     * @returns {Node}
     */
    createSizedImageNode: function( icon, size ) {
      icon.scale( Math.min( size.width / icon.bounds.width, size.height / icon.bounds.height ) );
      if ( Math.abs( icon.bounds.width - size.width ) < SCALING_TOLERANCE &&
           Math.abs( icon.bounds.height - size.height ) < SCALING_TOLERANCE ) {
        // The aspect ratio of the icon matched that of the specified size, so no padding is necessary.
        return icon;
      }
      // else padding is needed in either the horizontal or vertical direction.
      var background = Rectangle.dimension( size, { fill: null } );
      icon.center = background.center;
      background.addChild( icon );
      return background;
    }
  } );
} );