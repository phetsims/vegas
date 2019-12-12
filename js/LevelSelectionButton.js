// Copyright 2014-2019, University of Colorado Boulder

/**
 * Button for selecting a game level.
 * Includes an icon, score display, and (optional) 'best time' display.
 * See specification in https://github.com/phetsims/vegas/issues/59.
 * Originally named LevelSelectionItemNode, renamed to LevelSelectionButton on 4/10/2018.
 *
 * @author John Blanco
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Andrea Lin
 */
define( require => {
  'use strict';

  // modules
  const Dimension2 = require( 'DOT/Dimension2' );
  const GameTimer = require( 'VEGAS/GameTimer' );
  const inherit = require( 'PHET_CORE/inherit' );
  const merge = require( 'PHET_CORE/merge' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  const ScoreDisplayLabeledNumber = require( 'VEGAS/ScoreDisplayLabeledNumber' );
  const ScoreDisplayLabeledStars = require( 'VEGAS/ScoreDisplayLabeledStars' );
  const ScoreDisplayNumberAndStar = require( 'VEGAS/ScoreDisplayNumberAndStar' );
  const ScoreDisplayStars = require( 'VEGAS/ScoreDisplayStars' );
  const Tandem = require( 'TANDEM/Tandem' );
  const Text = require( 'SCENERY/nodes/Text' );
  const vegas = require( 'VEGAS/vegas' );

  // constants
  const SCALING_TOLERANCE = 1E-4; // Empirically chosen as something the human eye is unlikely to notice.
  const VALID_SCORE_DISPLAY_CONSTRUCTORS = [
    // all constructors must have the same signature!
    ScoreDisplayLabeledNumber, ScoreDisplayLabeledStars, ScoreDisplayStars, ScoreDisplayNumberAndStar
  ];

  /**
   * @param {Node} icon - appears on the button above the score display, scaled to fit
   * @param {Property.<number>} scoreProperty
   * @param {Object} [options]
   * @constructor
   */
  function LevelSelectionButton( icon, scoreProperty, options ) {

    assert && assert( icon instanceof Node );

    options = merge( {

      listener: null, // {function}

      // button size and appearance
      buttonWidth: 150,
      buttonHeight: 150,
      cornerRadius: 10,
      baseColor: 'rgb( 242, 255, 204 )',
      buttonXMargin: 10,
      buttonYMargin: 10,

      // score display
      scoreDisplayConstructor: ScoreDisplayStars,
      scoreDisplayOptions: null, // passed to scoreDisplayConstructor
      scoreDisplayProportion: 0.2, // percentage of the button height occupied by scoreDisplay, (0,0.5]
      scoreDisplayMinXMargin: 10, // horizontal margin between scoreDisplay and its background
      scoreDisplayMinYMargin: 5,  // vertical margin between scoreDisplay and its background
      iconToScoreDisplayYSpace: 10, // vertical space between icon and score display

      // best time (optional)
      bestTimeProperty: null, // null if no best time || {Property.<number>} best time in seconds
      bestTimeVisibleProperty: null, // null || Property.<boolean>} controls visibility of best time
      bestTimeFill: 'black',
      bestTimeFont: new PhetFont( 24 ),
      bestTimeYSpacing: 10,  // vertical space between drop shadow and best time

      // Tandem
      tandem: Tandem.REQUIRED
    }, options );

    Node.call( this );

    assert && assert( _.includes( VALID_SCORE_DISPLAY_CONSTRUCTORS, options.scoreDisplayConstructor,
      'invalid scoreDisplayConstructor: ' + options.scoreDisplayConstructor ) );
    assert && assert( options.scoreDisplayProportion > 0 && options.scoreDisplayProportion <= 0.5,
      'scoreDisplayProportion value out of range'
    );

    const maxContentWidth = options.buttonWidth - 2 * options.buttonXMargin;

    const scoreDisplay = new options.scoreDisplayConstructor( scoreProperty, options.scoreDisplayOptions );

    // Background behind scoreDisplay
    const scoreDisplayBackgroundHeight = options.buttonHeight * options.scoreDisplayProportion;
    const scoreDisplayBackground = new Rectangle( 0, 0, maxContentWidth, scoreDisplayBackgroundHeight, {
      cornerRadius: options.cornerRadius,
      fill: 'white',
      stroke: 'black',
      pickable: false
    } );

    // constrain scoreDisplay to fit in scoreDisplayBackground
    scoreDisplay.maxWidth = scoreDisplayBackground.width - ( 2 * options.scoreDisplayMinXMargin );
    scoreDisplay.maxHeight = scoreDisplayBackground.height - ( 2 * options.scoreDisplayMinYMargin );

    // Icon, scaled and padded to fit and to make the button size correct.
    const iconHeight = options.buttonHeight - scoreDisplayBackground.height - 2 * options.buttonYMargin - options.iconToScoreDisplayYSpace;
    const iconSize = new Dimension2( maxContentWidth, iconHeight );
    const adjustedIcon = LevelSelectionButton.createSizedImageNode( icon, iconSize );
    adjustedIcon.centerX = scoreDisplayBackground.centerX;
    adjustedIcon.bottom = scoreDisplayBackground.top - options.iconToScoreDisplayYSpace;

    // Keep scoreDisplay centered in its background when its bounds change
    const scoreDisplayUpdateLayout = function() {
      scoreDisplay.center = scoreDisplayBackground.center;
    };
    scoreDisplay.on( 'bounds', scoreDisplayUpdateLayout );
    scoreDisplayUpdateLayout();

    RectangularPushButton.call( this, {
      content: new Node( { children: [ adjustedIcon, scoreDisplayBackground, scoreDisplay ] } ),
      xMargin: options.buttonXMargin,
      yMargin: options.buttonYMargin,
      baseColor: options.baseColor,
      cornerRadius: options.cornerRadius,
      listener: options.listener,

      // TODO: if LevelSelectionButton changes to inheritance, this will have to change,
      // see https://github.com/phetsims/vegas/issues/56
      tandem: options.tandem.createTandem( 'button' )
    } );

    // Best time decoration (optional), centered below the button, does not move when button is pressed
    if ( options.bestTimeProperty ) {

      const bestTimeNode = new Text( '', {
        font: options.bestTimeFont,
        fill: options.bestTimeFill,
        maxWidth: this.width // constrain to width of the push button
      } );
      const centerX = this.centerX;
      bestTimeNode.top = this.bottom + options.bestTimeYSpacing;
      this.addChild( bestTimeNode );

      var bestTimeListener = function( bestTime ) {
        bestTimeNode.text = ( bestTime ? GameTimer.formatTime( bestTime ) : '' );
        bestTimeNode.centerX = centerX;
      };
      options.bestTimeProperty.link( bestTimeListener );

      if ( options.bestTimeVisibleProperty ) {
        var bestTimeVisibleListener = function( visible ) {
          bestTimeNode.visible = visible;
        };
        options.bestTimeVisibleProperty.link( bestTimeVisibleListener );
      }
    }

    // @private
    this.disposeLevelSelectionButton = function() {

      scoreDisplay.dispose();

      if ( bestTimeListener && options.bestTimeProperty.hasListener( bestTimeListener ) ) {
        options.bestTimeProperty.unlink( bestTimeListener );
      }

      if ( bestTimeVisibleListener && options.bestTimeVisibleProperty.hasListener( bestTimeVisibleListener ) ) {
        options.bestTimeVisibleProperty.unlink( bestTimeVisibleListener );
      }
    };
  }

  vegas.register( 'LevelSelectionButton', LevelSelectionButton );

  inherit( RectangularPushButton, LevelSelectionButton, {

    // @public
    dispose: function() {
      this.disposeLevelSelectionButton();
      Node.prototype.dispose.call( this );
    }
  }, {
    /**
     * Creates a new icon with the same dimensions as the specified icon. The new icon will be scaled to fit,
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
      const background = Rectangle.dimension( size );
      icon.center = background.center;
      background.addChild( icon );
      return background;
    }
  } );

  return LevelSelectionButton;
} );