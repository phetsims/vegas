// Copyright 2013-2020, University of Colorado Boulder

/**
 * This node is used to display a user's results when they complete a level.
 *
 * @author John Blanco
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../axon/js/Property.js';
import inherit from '../../phet-core/js/inherit.js';
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
import vegasStrings from './vegasStrings.js';
import vegas from './vegas.js';

const continueString = vegasStrings.continue;
const excellentString = vegasStrings.excellent;
const goodString = vegasStrings.good;
const greatString = vegasStrings.great;
const keepTryingString = vegasStrings.keepTrying;
const labelLevelString = vegasStrings.label.level;
const labelScoreMaxString = vegasStrings.label.score.max;
const labelTimeString = vegasStrings.label.time;
const pattern0YourBestString = vegasStrings.pattern[ '0yourBest' ];
const yourNewBestString = vegasStrings.yourNewBest;

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

export default inherit( Panel, LevelCompletedNode, {
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