// Copyright 2013-2020, University of Colorado Boulder

/**
 * This node is used to display a user's results when they complete a level.
 *
 * @author John Blanco
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../axon/js/Property.js';
import merge from '../../phet-core/js/merge.js';
import StringUtils from '../../phetcommon/js/util/StringUtils.js';
import PhetFont from '../../scenery-phet/js/PhetFont.js';
import RichText from '../../scenery/js/nodes/RichText.js';
import Text from '../../scenery/js/nodes/Text.js';
import VBox from '../../scenery/js/nodes/VBox.js';
import Color from '../../scenery/js/util/Color.js';
import TextPushButton from '../../sun/js/buttons/TextPushButton.js';
import Panel from '../../sun/js/Panel.js';
import Tandem from '../../tandem/js/Tandem.js';
import GameTimer from './GameTimer.js';
import ScoreDisplayStars from './ScoreDisplayStars.js';
import vegas from './vegas.js';
import vegasStrings from './vegasStrings.js';

class LevelCompletedNode extends Panel {
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
   */
  constructor( level, score, perfectScore, numStars, timerEnabled, elapsedTime, bestTimeAtThisLevel, isNewBestTime,
               continueFunction, options ) {

    options = merge( {
      levelVisible: true, // whether to display the level number
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
    let titleText = vegasStrings.keepTrying;
    if ( proportionCorrect > 0.95 ) {
      titleText = vegasStrings.excellent;
    }
    else if ( proportionCorrect > 0.75 ) {
      titleText = vegasStrings.great;
    }
    else if ( proportionCorrect >= 0.5 ) {
      titleText = vegasStrings.good;
    }
    const title = new Text( titleText, {
      font: options.titleFont,
      maxWidth: options.contentMaxWidth
    } );
    children.push( title );

    // Progress indicator
    const scoreDisplayStars = new ScoreDisplayStars( new Property( score ), {
      numberOfStars: numStars,
      perfectScore: perfectScore,
      starNodeOptions: {
        innerRadius: options.starDiameter / 4,
        outerRadius: options.starDiameter / 2
      },
      maxWidth: options.contentMaxWidth
    } );
    children.push( scoreDisplayStars );

    // Level (optional)
    if ( options.levelVisible ) {
      children.push( new Text( StringUtils.format( vegasStrings.label.level, level ), {
        font: options.infoFont,
        maxWidth: options.contentMaxWidth
      } ) );
    }

    // Score
    children.push( new Text( StringUtils.format( vegasStrings.label.score.max, score, perfectScore ), {
      font: options.infoFont,
      maxWidth: options.contentMaxWidth
    } ) );

    // Time (optional)
    let timeRichText = null;
    if ( timerEnabled ) {
      // @private {Node}
      timeRichText = new RichText( StringUtils.format( vegasStrings.label.time, GameTimer.formatTime( elapsedTime ) ), {
        font: options.infoFont,
        align: 'center',
        maxWidth: options.contentMaxWidth
      } );
      if ( isNewBestTime ) {
        timeRichText.text = `${timeRichText.text}<br>${vegasStrings.yourNewBest}`;
      }
      else if ( bestTimeAtThisLevel !== null ) {
        timeRichText.text = `${timeRichText.text}<br>${
                            StringUtils.format( vegasStrings.pattern[ '0yourBest' ], GameTimer.formatTime( bestTimeAtThisLevel ) )}`;
      }
      children.push( timeRichText );
    }

    // Continue button
    const continueButton = new TextPushButton( vegasStrings.continue, {
      listener: continueFunction,
      font: options.buttonFont,
      baseColor: options.buttonFill,
      tandem: options.tandem.createTandem( 'continueButton' ),
      maxWidth: options.contentMaxWidth
    } );
    children.push( continueButton );

    // Panel
    super( new VBox( { children: children, spacing: options.ySpacing } ), options );

    // @private
    this.disposeLevelCompletedNode = () => {
      timeRichText && timeRichText.dispose();
      continueButton.dispose();
      scoreDisplayStars.dispose();
    };
  }

  /**
   * Releases references.
   * @public
   * @override
   */
  dispose() {
    this.disposeLevelCompletedNode();
    super.dispose();
  }
}

vegas.register( 'LevelCompletedNode', LevelCompletedNode );
export default LevelCompletedNode;