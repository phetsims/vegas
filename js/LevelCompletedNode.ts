// Copyright 2013-2025, University of Colorado Boulder

/**
 * This node is used to display a user's results when they complete a level.
 *
 * @author John Blanco
 * @author Chris Malley (PixelZoom, Inc.)
 */

// TODO: This needs to be put into a its own game screen. Like a sibling of LevelSelectionScreenNode and GameScreenNode. See https://github.com/phetsims/vegas/issues/138
//  It needs to have its own heading for its content like "Level 1 Summary".

import DerivedProperty from '../../axon/js/DerivedProperty.js';
import DerivedStringProperty from '../../axon/js/DerivedStringProperty.js';
import Property from '../../axon/js/Property.js';
import { TReadOnlyProperty } from '../../axon/js/TReadOnlyProperty.js';
import optionize from '../../phet-core/js/optionize.js';
import StringUtils from '../../phetcommon/js/util/StringUtils.js';
import PhetColorScheme from '../../scenery-phet/js/PhetColorScheme.js';
import PhetFont from '../../scenery-phet/js/PhetFont.js';
import VBox from '../../scenery/js/layout/nodes/VBox.js';
import Node from '../../scenery/js/nodes/Node.js';
import RichText from '../../scenery/js/nodes/RichText.js';
import Text from '../../scenery/js/nodes/Text.js';
import Font from '../../scenery/js/util/Font.js';
import TColor from '../../scenery/js/util/TColor.js';
import { PushButtonListener } from '../../sun/js/buttons/PushButtonModel.js';
import TextPushButton from '../../sun/js/buttons/TextPushButton.js';
import Panel, { PanelOptions } from '../../sun/js/Panel.js';
import Tandem from '../../tandem/js/Tandem.js';
import GameTimer from './GameTimer.js';
import ScoreDisplayStars from './ScoreDisplayStars.js';
import vegas from './vegas.js';
import VegasFluent from './VegasFluent.js';
import VegasStrings from './VegasStrings.js';

const DEFAULT_TITLE_FONT = new PhetFont( { size: 28, weight: 'bold' } );
const DEFAULT_INFO_FONT = new PhetFont( { size: 22, weight: 'bold' } );
const DEFAULT_BUTTON_FONT = new PhetFont( 26 );

type SelfOptions = {
  levelVisible?: boolean; // whether to display the level number
  ySpacing?: number;
  titleFont?: Font;
  infoFont?: Font;
  buttonFont?: Font;
  buttonFill?: TColor;
  starDiameter?: number;
  contentMaxWidth?: number | null; // applied as maxWidth to every subcomponent individually, not Panel's content
};

export type LevelCompletedNodeOptions = SelfOptions & PanelOptions;

export default class LevelCompletedNode extends Panel {

  private readonly disposeLevelCompletedNode: () => void;
  private readonly continueButton: Node;

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
  public constructor( level: number, score: number, perfectScore: number, numberOfStars: number, timerEnabled: boolean,
                      elapsedTime: number, bestTimeAtThisLevel: number | null, isNewBestTime: boolean,
                      continueFunction: PushButtonListener, providedOptions?: LevelCompletedNodeOptions ) {

    const options = optionize<LevelCompletedNodeOptions, SelfOptions, PanelOptions>()( {

      // SelfOptions
      levelVisible: true,
      ySpacing: 30,
      titleFont: DEFAULT_TITLE_FONT,
      infoFont: DEFAULT_INFO_FONT,
      buttonFont: DEFAULT_BUTTON_FONT,
      buttonFill: PhetColorScheme.BUTTON_YELLOW,
      starDiameter: 62,
      contentMaxWidth: 400,

      // PanelOptions
      fill: 'rgb( 180, 205, 255 )',
      stroke: 'black',
      lineWidth: 2,
      cornerRadius: 35,
      xMargin: 20,
      yMargin: 20,
      tandem: Tandem.REQUIRED,

      // pdom - the information in this dialog is contained in a list
      tagName: 'ul'
    }, providedOptions );

    const vBoxChildren: Node[] = [];

    // Title, which changes based on how the user did.
    const proportionCorrect = score / perfectScore;
    let titleTextStringProperty = VegasStrings.keepTryingStringProperty;
    if ( proportionCorrect > 0.95 ) {
      titleTextStringProperty = VegasStrings.excellentStringProperty;
    }
    else if ( proportionCorrect > 0.75 ) {
      titleTextStringProperty = VegasStrings.greatStringProperty;
    }
    else if ( proportionCorrect >= 0.5 ) {
      titleTextStringProperty = VegasStrings.goodStringProperty;
    }
    const title = new Text( titleTextStringProperty, {
      font: options.titleFont,
      maxWidth: options.contentMaxWidth,

      tagName: 'li',
      innerContent: titleTextStringProperty
    } );
    vBoxChildren.push( title );

    // Progress indicator
    const scoreDisplayStars = new ScoreDisplayStars( new Property( score ), {
      numberOfStars: numberOfStars,
      perfectScore: perfectScore,
      starNodeOptions: {
        starShapeOptions: {
          innerRadius: options.starDiameter / 4,
          outerRadius: options.starDiameter / 2
        }
      },
      maxWidth: options.contentMaxWidth,
      tagName: 'li'
    } );
    vBoxChildren.push( scoreDisplayStars );
    scoreDisplayStars.innerContent = scoreDisplayStars.accessibleScoreStringProperty;

    // Level (optional)
    if ( options.levelVisible ) {

      const levelStringProperty = new DerivedProperty(
        [ VegasStrings.label.levelStringProperty ],
        pattern => StringUtils.format( pattern, level )
      );

      // TODO: The level is not included in the list, is that correct? See https://github.com/phetsims/vegas/issues/138
      //  The level number will be in the accessible heading for this node (or section?) And it will also be included in a context response.
      vBoxChildren.push( new Text( levelStringProperty, {
        font: options.infoFont,
        maxWidth: options.contentMaxWidth
      } ) );
    }

    // Score
    const scoreStringProperty = new DerivedStringProperty(
      [ VegasStrings.label.score.maxStringProperty ],
      pattern => StringUtils.format( pattern, score, perfectScore )
    );
    vBoxChildren.push( new Text( scoreStringProperty, {
      font: options.infoFont,
      maxWidth: options.contentMaxWidth,

      tagName: 'li',
      innerContent: scoreStringProperty
    } ) );

    // Time (optional)
    let elapsedTimeStringProperty: TReadOnlyProperty<string>;
    let timeStringProperty: TReadOnlyProperty<string>;
    if ( timerEnabled ) {

      // Time: MM:SS
      elapsedTimeStringProperty = new DerivedStringProperty( [
          VegasStrings.label.timeStringProperty,

          // used by GameTimer.formatTime
          VegasStrings.pattern[ '0hours' ][ '1minutes' ][ '2secondsStringProperty' ],
          VegasStrings.pattern[ '0minutes' ][ '1secondsStringProperty' ]
        ],
        pattern => StringUtils.format( pattern, GameTimer.formatTime( elapsedTime ) )
      );

      if ( isNewBestTime ) {

        // Time: MM:SS
        // (Your New Best!)
        // TODO: Create a new string pattern for the accessible content that removes breaks and parens, see https://github.com/phetsims/vegas/issues/138
        // Your new best: MM:SS (if new best)
        // Time: MM:SS (if not new best)
        timeStringProperty = new DerivedStringProperty(
          [ elapsedTimeStringProperty, VegasStrings.yourNewBestStringProperty ],
          ( elapsedTime: string, yourNewBest: string ) => `${elapsedTime}<br>${yourNewBest}`
        );
      }
      else if ( bestTimeAtThisLevel !== null ) {

        // Time: MM:SS
        // (Your Best: MM:SS)
        timeStringProperty = new DerivedStringProperty(
          [ elapsedTimeStringProperty,
            VegasStrings.pattern[ '0yourBestStringProperty' ],

            // used by GameTimer.formatTime
            VegasStrings.pattern[ '0hours' ][ '1minutes' ][ '2secondsStringProperty' ],
            VegasStrings.pattern[ '0minutes' ][ '1secondsStringProperty' ]
          ],
          ( elapsedTime: string, pattern: string ) =>
            `${elapsedTime}<br>${StringUtils.format( pattern, GameTimer.formatTime( bestTimeAtThisLevel ) )}`
        );
      }
      else {

        // Time: MM:SS
        timeStringProperty = elapsedTimeStringProperty;
      }

      vBoxChildren.push( new RichText( timeStringProperty, {
        font: options.infoFont,
        align: 'center',
        maxWidth: options.contentMaxWidth,
        tagName: 'li',
        innerContent: timeStringProperty
      } ) );
    }

    // Continue button
    const continueButton = new TextPushButton( VegasStrings.continueStringProperty, {
      listener: continueFunction,
      font: options.buttonFont,
      baseColor: options.buttonFill,
      tandem: options.tandem.createTandem( 'continueButton' ),
      maxWidth: options.contentMaxWidth,
      accessibleHelpText: VegasFluent.a11y.levelCompletedNode.continueButton.accessibleHelpTextStringProperty
    } );
    vBoxChildren.push( continueButton );

    const content = new VBox( {
      children: vBoxChildren,
      spacing: options.ySpacing
    } );

    super( content, options );

    this.continueButton = continueButton;

    this.disposeLevelCompletedNode = () => {

      // DerivedStringProperty instances
      scoreStringProperty.dispose();
      elapsedTimeStringProperty && elapsedTimeStringProperty.dispose();
      if ( timeStringProperty && timeStringProperty !== elapsedTimeStringProperty ) {
        timeStringProperty.dispose();
      }

      // All VBox children are linked to dynamic string Properties, so must be disposed.
      vBoxChildren.forEach( child => child.dispose() );
    };
  }

  public focusContinueButton(): void {
    this.continueButton.focus();
  }

  public override dispose(): void {
    this.disposeLevelCompletedNode();
    super.dispose();
  }
}

vegas.register( 'LevelCompletedNode', LevelCompletedNode );