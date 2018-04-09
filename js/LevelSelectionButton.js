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
  var VALID_SCORE_DISPLAY_CONSTRUCTORS = [
    // all constructors must have the same signature!
    ScoreDisplayDiscreteStars, ScoreDisplayNumberAndStar, ScoreDisplayTextAndNumber
  ];

  /**
   * @param {Node} icon - appears on the button above the score display, scaled to fit
   * @param {Node} scoreDisplay - displays the score
   * @param {Object} [options]
   * @constructor
   */
  function LevelSelectionButton( icon, scoreDisplay, options ) {

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

      // layout of scoreDisplay
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
      tandem: Tandem.required
    }, options );

    Node.call( this );

    assert && assert(
    options.scoreDisplayProportion > 0 && options.scoreDisplayProportion <= 0.5,
      'scoreDisplayProportion value out of range'
    );

    var maxContentWidth = options.buttonWidth - 2 * options.buttonXMargin;

    // Background behind scoreDisplay
    var scoreDisplayBackgroundHeight = options.buttonHeight * options.scoreDisplayProportion;
    var scoreDisplayBackground = new Rectangle( 0, 0, maxContentWidth, scoreDisplayBackgroundHeight, {
      cornerRadius: options.cornerRadius,
      fill: 'white',
      stroke: 'black',
      lineWidth: 1,
      pickable: false
    } );

    // constrain scoreDisplay to fit in scoreDisplayBackground
    scoreDisplay.maxWidth = scoreDisplayBackground.width - ( 2 * options.scoreDisplayMinXMargin );
    scoreDisplay.maxHeight = scoreDisplayBackground.height - ( 2 * options.scoreDisplayMinYMargin );

    // Icon, scaled and padded to fit and to make the button size correct.
    var iconHeight = options.buttonHeight - scoreDisplayBackground.height - 2 * options.buttonYMargin - options.iconToScoreDisplayYSpace;
    var iconSize = new Dimension2( maxContentWidth, iconHeight );
    var adjustedIcon = LevelSelectionButton.createSizedImageNode( icon, iconSize );
    adjustedIcon.centerX = scoreDisplayBackground.centerX;
    adjustedIcon.bottom = scoreDisplayBackground.top - options.iconToScoreDisplayYSpace;

    // Keep scoreDisplay centered in its background when its bounds change
    var scoreDisplayUpdateLayout = function() {
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

      var bestTimeNode = new Text( '', { font: options.bestTimeFont, fill: options.bestTimeFill } );
      var centerX = this.centerX;
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

      if ( scoreDisplay.hasListener( 'bounds', scoreDisplayUpdateLayout ) ) {
        scoreDisplay.off( 'bounds', scoreDisplayUpdateLayout );
      }

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
      var background = Rectangle.dimension( size, { fill: null } );
      icon.center = background.center;
      background.addChild( icon );
      return background;
    }
  } );

  /**
   * Convenience type for creating a LevelSelectionButton with a specific type of scoreDisplay.
   * Instantiation and disposal of the scoreDisplay instance is opaque to the client.
   * @param {Node} icon - appears on the button above the score display, scaled to fit
   * @param {Property.<number>} scoreProperty
   * @param {Object} [options]
   * @constructor
   */
  function ScoreDisplayCreator( icon, scoreProperty, options ) {

    options = _.extend( {
      listener: null, // {function|null} called when the button is pressed
      scoreDisplayConstructor: ScoreDisplayDiscreteStars, // {constructor} for creating scoreDisplay
      scoreDisplayOptions: null // see scoreDisplay's constructor
    }, options );

    assert && assert( _.includes( VALID_SCORE_DISPLAY_CONSTRUCTORS, options.scoreDisplayConstructor,
      'invalid ScoreDisplayConstructor: ' + options.ScoreDisplayConstructor ) );

    // @private all constructors must have the same signature!
    this.scoreDisplay = new options.scoreDisplayConstructor( scoreProperty, options.scoreDisplayOptions );

    LevelSelectionButton.call( this, icon, this.scoreDisplay, _.omit( options, [ 'scoreDisplayOptions' ] ) );
  }

  vegas.register( 'LevelSelectionButton.ScoreDisplayCreator', ScoreDisplayCreator );

  inherit( LevelSelectionButton, ScoreDisplayCreator, {

    // @public
    dispose: function() {
      this.scoreDisplay.dispose();
      LevelSelectionButton.prototype.dispose.call( this );
    }
  } );

  LevelSelectionButton.ScoreDisplayCreator = ScoreDisplayCreator;

  return LevelSelectionButton;
} );