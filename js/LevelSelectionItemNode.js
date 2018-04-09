// Copyright 2014-2018, University of Colorado Boulder

/**
 * Button for selecting a game level.
 * Also depicts the progress made on each level.
 * See specification in https://github.com/phetsims/vegas/issues/59.
 *
 * @author John Blanco
 * @author Chris Malley
 * @author Andrea Lin
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
   * @param {Node} icon Scenery node that appears on the button above the score display, scaled to fit
   * @param {Node} scoreDisplay - displays the score
   * @param {Object} [options]
   * @constructor
   */
  function LevelSelectionItemNode( icon, scoreDisplay, options ) {

    assert && assert( icon instanceof Node );

    options = _.extend( {

      // score display type
      numStars: 1,

      listener: null, // {function}

      // button size and appearance
      buttonWidth: 150,
      buttonHeight: 150,
      cornerRadius: 10,
      baseColor: 'rgb( 242, 255, 204 )',
      buttonXMargin: 10,
      buttonYMargin: 10,

      // scoreDisplay  (stars)
      scoreDisplayProportion: 0.2, // percentage of the button height occupied by the score display, (0,0.5]
      scoreDisplayMinXMargin: 10,
      scoreDisplayMinYMargin: 5,
      iconToScoreDisplayYSpace: 10,

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
    options.scoreDisplayProportion > 0 && options.scoreDisplayProportion <= 0.5,
      'scoreDisplayProportion value out of range'
    );

    var maxContentWidth = options.buttonWidth - 2 * options.buttonXMargin;

    // score display (stars), scaled to fit
    var scoreDisplayBackground = new Rectangle( 0, 0, maxContentWidth,
      options.buttonHeight * options.scoreDisplayProportion, options.cornerRadius, options.cornerRadius, {
        fill: 'white',
        stroke: 'black',
        lineWidth: 1,
        pickable: false
      } );

    // Icon, scaled and padded to fit and to make the button size correct.
    var iconSize = new Dimension2( maxContentWidth, options.buttonHeight - scoreDisplayBackground.height -
                                                    2 * options.buttonYMargin - options.iconToScoreDisplayYSpace );
    var adjustedIcon = LevelSelectionItemNode.createSizedImageNode( icon, iconSize );
    adjustedIcon.pickable = false; // TODO: is this needed?

    // Assemble the content.
    var contentNode = new Node();
    if ( scoreDisplayBackground.width > adjustedIcon.width ) {
      adjustedIcon.centerX = scoreDisplayBackground.centerX;
    }
    else {
      scoreDisplayBackground.centerX = adjustedIcon.centerX;
    }
    scoreDisplayBackground.top = adjustedIcon.bottom + options.iconToScoreDisplayYSpace;
    contentNode.addChild( adjustedIcon );
    contentNode.addChild( scoreDisplayBackground );
    contentNode.addChild( scoreDisplay );

    // Keep the score display centered when its bounds change
    var scoreDisplayUpdateLayout = function() {
      scoreDisplay.center = scoreDisplayBackground.center;
    };
    scoreDisplay.on( 'bounds', scoreDisplayUpdateLayout );
    scoreDisplayUpdateLayout();

    // Create the button
    var buttonOptions = {
      content: contentNode,
      xMargin: options.buttonXMargin,
      yMargin: options.buttonYMargin,
      baseColor: options.baseColor,
      cornerRadius: options.cornerRadius,
      listener: options.listener,

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

    // @private
    this.disposeLevelSelectionItemNode = function() {
      if ( scoreDisplay.hasListener( 'bounds', scoreDisplayUpdateLayout ) ) {
        scoreDisplay.off( 'bounds', scoreDisplayUpdateLayout );
      }
    };
  }

  vegas.register( 'LevelSelectionItemNode', LevelSelectionItemNode );

  return inherit( Node, LevelSelectionItemNode, {

    // @public
    dispose: function() {
      this.disposeLevelSelectionItemNode();
      Node.prototype.dispose.call( this );
    }
  }, {
    /**
     * Creates a new icon with the same dimensions as size with the specified icon. The new icon will be scaled to fit,
     * and a background with the specified size may be added to ensure that the bounds of the returned node are correct.
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
    },

    /**
     * Convenience function to create a LevelSelectionItemNode with a ScoreDisplayDiscreteStars.
     * @param {Node} icon
     * @param {Property.<number>} scoreProperty
     * @param {Object} [options] - see LevelSelectionItemNode and ScoreDisplayDiscreteStars
     * @public
     * @static
     */
    createWithScoreDisplayDiscreteStars: function( icon, scoreProperty, options ) {

      options = _.extend( {
        listener: null, // {function|null} called when the button is pressed
        scoreDisplayOptions: null // see ScoreDisplayDiscreteStars options
      }, options );

      var scoreDisplay = new ScoreDisplayDiscreteStars( scoreProperty, options.scoreDisplayOptions );

      return new LevelSelectionItemNode( icon, scoreDisplay, _.omit( options, [ 'scoreDisplayOptions' ] ) );
    },

    /**
     * Convenience function to create a LevelSelectionItemNode with a ScoreDisplayNumberAndStar.
     * @param {Node} icon
     * @param {Property.<number>} scoreProperty
     * @param {Object} [options] - see LevelSelectionItemNode and ScoreDisplayNumberAndStar
     * @public
     * @static
     */
    createWithScoreDisplayNumberAndStar: function( icon, scoreProperty, options ) {

      options = _.extend( {
        listener: null, // {function|null} called when the button is pressed
        scoreDisplayOptions: null // see ScoreDisplayNumberAndStar options
      }, options );

      var scoreDisplay = new ScoreDisplayNumberAndStar( scoreProperty, options.scoreDisplayOptions );

      return new LevelSelectionItemNode( icon, scoreDisplay, _.omit( options, [ 'scoreDisplayOptions' ] ) );
    },

    /**
     * Convenience function to create a LevelSelectionItemNode with a ScoreDisplayTextAndNumber.
     * @param {Node} icon
     * @param {Property.<number>} scoreProperty
     * @param {Object} [options] - see LevelSelectionItemNode and ScoreDisplayTextAndNumber
     * @public
     * @static
     */
    createWithScoreDisplayTextAndNumber: function( icon, scoreProperty, options ) {

      options = _.extend( {
        listener: null, // {function|null} called when the button is pressed
        scoreDisplayOptions: null // see ScoreDisplayTextAndNumber options
      }, options );

      var scoreDisplay = new ScoreDisplayTextAndNumber( scoreProperty, options.scoreDisplayOptions );

      return new LevelSelectionItemNode( icon, scoreDisplay, _.omit( options, [ 'scoreDisplayOptions' ] ) );
    }
  } );
} );