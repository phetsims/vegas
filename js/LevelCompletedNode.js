// Copyright 2013-2019, University of Colorado Boulder

/**
 * This node is used to display a user's results when they complete a level.
 *
 * @author John Blanco
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Color = require( 'SCENERY/util/Color' );
  const GameTimer = require( 'VEGAS/GameTimer' );
  const inherit = require( 'PHET_CORE/inherit' );
  const merge = require( 'PHET_CORE/merge' );
  const Panel = require( 'SUN/Panel' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Property = require( 'AXON/Property' );
  const RichText = require( 'SCENERY/nodes/RichText' );
  const ScoreDisplayStars = require( 'VEGAS/ScoreDisplayStars' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const Tandem = require( 'TANDEM/Tandem' );
  const Text = require( 'SCENERY/nodes/Text' );
  const TextPushButton = require( 'SUN/buttons/TextPushButton' );
  const VBox = require( 'SCENERY/nodes/VBox' );
  const vegas = require( 'VEGAS/vegas' );

  // strings
  const continueString = require( 'string!VEGAS/continue' );
  const excellentString = require( 'string!VEGAS/excellent' );
  const goodString = require( 'string!VEGAS/good' );
  const greatString = require( 'string!VEGAS/great' );
  const keepTryingString = require( 'string!VEGAS/keepTrying' );
  const labelLevelString = require( 'string!VEGAS/label.level' );
  const labelScoreMaxString = require( 'string!VEGAS/label.score.max' );
  const labelTimeString = require( 'string!VEGAS/label.time' );
  const pattern0YourBestString = require( 'string!VEGAS/pattern.0yourBest' );
  const yourNewBestString = require( 'string!VEGAS/yourNewBest' );

  /**
   * @param {number} level - numerical value representing game level completed
   * @param {number} score
   * @param {number} perfectScore
   * @param {number} numStars
   * @param {boolean} timerEnabled
   * @param {number} elapsedTime (in seconds)
   * @param {number} bestTimeAtThisLevel (in seconds), null indicates no best time
   * @param {boolean} isNewBestTime
   * @param {function} continueFunction - function to call when the user presses the 'Continue' button
   * @param {Object} [options]
   * @constructor
   */
  function LevelCompletedNode( level,
                               score,
                               perfectScore,
                               numStars,
                               timerEnabled,
                               elapsedTime,
                               bestTimeAtThisLevel,
                               isNewBestTime,
                               continueFunction,
                               options ) {

    options = merge( {
      levelVisible: true, // display the level number?
      fill: new Color( 180, 205, 255 ),
      stroke: 'black',
      lineWidth: 2,
      cornerRadius: 35,
      xMargin: 20,
      yMargin: 20,
      ySpacing: 30,
      titleFont: new PhetFont( { size: 28, weight: 'bold' } ),
      infoFont: new PhetFont( { size: 22, weight: 'bold' } ),
      buttonFont: new PhetFont( 26 ),
      buttonFill: new Color( 255, 255, 0 ),
      starDiameter: 62,
      contentMaxWidth: null, // {number|null} - Will apply as maxWidth to every interior component individually.
      tandem: Tandem.REQUIRED
    }, options );

    // nodes to be added to the panel
    const children = [];

    // Title, which changes based on how the user did.
    const proportionCorrect = score / perfectScore;
    let titleText = keepTryingString;
    if ( proportionCorrect > 0.95 ) {
      titleText = excellentString;
    }
    else if ( proportionCorrect > 0.75 ) {
      titleText = greatString;
    }
    else if ( proportionCorrect >= 0.5 ) {
      titleText = goodString;
    }
    const title = new Text( titleText, {
      font: options.titleFont,
      maxWidth: options.contentMaxWidth
    } );
    children.push( title );

    // @private {Node} Progress indicator
    this.scoreDisplayStars = new ScoreDisplayStars( new Property( score ), {
      numberOfStars: numStars,
      perfectScore: perfectScore,
      starNodeOptions: {
        innerRadius: options.starDiameter / 4,
        outerRadius: options.starDiameter / 2
      },
      maxWidth: options.contentMaxWidth
    } );
    children.push( this.scoreDisplayStars );

    // Level (optional)
    if ( options.levelVisible ) {
      children.push( new Text( StringUtils.format( labelLevelString, level ), {
        font: options.infoFont,
        maxWidth: options.contentMaxWidth
      } ) );
    }

    // Score
    children.push( new Text( StringUtils.format( labelScoreMaxString, score, perfectScore ), {
      font: options.infoFont,
      maxWidth: options.contentMaxWidth
    } ) );

    // Time (optional)
    if ( timerEnabled ) {
      // @private {Node}
      this.timeRichText = new RichText( StringUtils.format( labelTimeString, GameTimer.formatTime( elapsedTime ) ), {
        font: options.infoFont,
        align: 'center',
        maxWidth: options.contentMaxWidth
      } );
      if ( isNewBestTime ) {
        this.timeRichText.text = this.timeRichText.text + '<br>' + yourNewBestString;
      }
      else if ( bestTimeAtThisLevel !== null ) {
        this.timeRichText.text = this.timeRichText.text + '<br>' + StringUtils.format( pattern0YourBestString, GameTimer.formatTime( bestTimeAtThisLevel ) );
      }
      children.push( this.timeRichText );
    }

    // @private {Node}
    this.continueButton = new TextPushButton( continueString, {
      listener: continueFunction,
      font: options.buttonFont,
      baseColor: options.buttonFill,
      tandem: options.tandem.createTandem( 'continueButton' ),
      maxWidth: options.contentMaxWidth
    } );

    // Continue button
    children.push( this.continueButton );

    // Panel
    Panel.call( this, new VBox( { children: children, spacing: options.ySpacing } ), options );
  }

  vegas.register( 'LevelCompletedNode', LevelCompletedNode );

  return inherit( Panel, LevelCompletedNode, {
    /**
     * Releases references.
     * @public
     * @override
     */
    dispose: function() {
      this.timeRichText && this.timeRichText.dispose();
      this.continueButton.dispose();
      this.scoreDisplayStars.dispose();

      Panel.prototype.dispose.call( this );
    }
  } );
} );