// Copyright 2013-2022, University of Colorado Boulder

/**
 * This node is used to display a user's results when they complete a level.
 *
 * @author John Blanco
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../axon/js/Property.js';
import optionize from '../../phet-core/js/optionize.js';
import StringUtils from '../../phetcommon/js/util/StringUtils.js';
import PhetFont from '../../scenery-phet/js/PhetFont.js';
import { Font, IColor, RichText, Text, VBox } from '../../scenery/js/imports.js';
import { PushButtonListener } from '../../sun/js/buttons/PushButtonModel.js';
import TextPushButton from '../../sun/js/buttons/TextPushButton.js';
import Panel, { PanelOptions } from '../../sun/js/Panel.js';
import Tandem from '../../tandem/js/Tandem.js';
import GameTimer from './GameTimer.js';
import ScoreDisplayStars from './ScoreDisplayStars.js';
import vegas from './vegas.js';
import vegasStrings from './vegasStrings.js';

const DEFAULT_TITLE_FONT = new PhetFont( { size: 28, weight: 'bold' } );
const DEFAULT_INFO_FONT = new PhetFont( { size: 22, weight: 'bold' } );
const DEFAULT_BUTTON_FONT = new PhetFont( 26 );

type SelfOptions = {
  levelVisible?: boolean; // whether to display the level number
  ySpacing?: number;
  titleFont?: Font;
  infoFont?: Font;
  buttonFont?: Font;
  buttonFill?: IColor;
  starDiameter?: number;
  contentMaxWidth?: number | null; // applied as maxWidth to every subcomponent individually, not Panel's content
};

export type LevelCompletedNodeOptions = SelfOptions & PanelOptions;

export default class LevelCompletedNode extends Panel {

  private readonly disposeLevelCompletedNode: () => void;

  /**
   * @param level - the game level that has been completed
   * @param score
   * @param perfectScore
   * @param numberOfStars
   * @param timerEnabled
   * @param elapsedTime (in seconds)
   * @param bestTimeAtThisLevel (in seconds), null indicates no best time
   * @param isNewBestTime
   * @param continueFunction - function to call when the user presses the 'Continue' button
   * @param providedOptions
   */
  constructor( level: number, score: number, perfectScore: number, numberOfStars: number, timerEnabled: boolean,
               elapsedTime: number, bestTimeAtThisLevel: number | null, isNewBestTime: boolean,
               continueFunction: PushButtonListener, providedOptions?: LevelCompletedNodeOptions ) {

    const options = optionize<LevelCompletedNodeOptions, SelfOptions, PanelOptions, 'tandem'>( {

      // SelfOptions
      levelVisible: true,
      ySpacing: 30,
      titleFont: DEFAULT_TITLE_FONT,
      infoFont: DEFAULT_INFO_FONT,
      buttonFont: DEFAULT_BUTTON_FONT,
      buttonFill: 'rgb( 255, 255, 0 )',
      starDiameter: 62,
      contentMaxWidth: null,

      // PanelOptions
      fill: 'rgb( 180, 205, 255 )',
      stroke: 'black',
      lineWidth: 2,
      cornerRadius: 35,
      xMargin: 20,
      yMargin: 20,
      tandem: Tandem.REQUIRED
    }, providedOptions );

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
      numberOfStars: numberOfStars,
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
    let timeRichText: RichText | null = null;
    if ( timerEnabled ) {
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

    const content = new VBox( {
      children: children,
      spacing: options.ySpacing
    } );

    super( content, options );

    this.disposeLevelCompletedNode = () => {
      timeRichText && timeRichText.dispose();
      continueButton.dispose();
      scoreDisplayStars.dispose();
    };
  }

  public override dispose(): void {
    this.disposeLevelCompletedNode();
    super.dispose();
  }
}

vegas.register( 'LevelCompletedNode', LevelCompletedNode );