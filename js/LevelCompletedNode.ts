// Copyright 2013-2025, University of Colorado Boulder

/**
 * This node is used to display a user's results when they complete a level.
 *
 * @author John Blanco
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../axon/js/DerivedProperty.js';
import DerivedStringProperty from '../../axon/js/DerivedStringProperty.js';
import Property from '../../axon/js/Property.js';
import { TReadOnlyProperty } from '../../axon/js/TReadOnlyProperty.js';
import optionize from '../../phet-core/js/optionize.js';
import StringUtils from '../../phetcommon/js/util/StringUtils.js';
import AccessibleListNode, { AccessibleListItem } from '../../scenery-phet/js/accessibility/AccessibleListNode.js';
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
      tandem: Tandem.REQUIRED
    }, providedOptions );

    // The accessible content will be contained in an AccessibleListNode. Children will depend on
    // content included in options.
    const accessibleListItems: ( AccessibleListItem | TReadOnlyProperty<string> )[] = [];

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
      maxWidth: options.contentMaxWidth
    } );
    vBoxChildren.push( title );
    accessibleListItems.push( titleTextStringProperty );

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
      maxWidth: options.contentMaxWidth
    } );
    vBoxChildren.push( scoreDisplayStars );
    accessibleListItems.push( scoreDisplayStars.accessibleScoreStringProperty );

    // Level (optional)
    if ( options.levelVisible ) {

      const levelStringProperty = new DerivedProperty(
        [ VegasStrings.label.levelStringProperty ],
        pattern => StringUtils.format( pattern, level )
      );

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
      maxWidth: options.contentMaxWidth
    } ) );
    accessibleListItems.push( scoreStringProperty );

    // Time (optional)
    let elapsedTimeStringProperty: TReadOnlyProperty<string>;
    let timeStringProperty: TReadOnlyProperty<string>;
    let accessibleTimeStringProperty: TReadOnlyProperty<string> | null = null;
    if ( timerEnabled ) {
      const formattedTime = GameTimer.formatTime( elapsedTime );

      // Time: MM:SS
      elapsedTimeStringProperty = new DerivedStringProperty( [
          VegasStrings.label.timeStringProperty,

          // used by GameTimer.formatTime
          VegasStrings.pattern[ '0hours' ][ '1minutes' ][ '2secondsStringProperty' ],
          VegasStrings.pattern[ '0minutes' ][ '1secondsStringProperty' ]
        ],
        pattern => StringUtils.format( pattern, formattedTime )
      );

      if ( isNewBestTime ) {

        // Time: MM:SS
        // (Your New Best!)
        timeStringProperty = new DerivedStringProperty(
          [ elapsedTimeStringProperty, VegasStrings.yourNewBestStringProperty ],
          ( elapsedTime: string, yourNewBest: string ) => `${elapsedTime}<br>${yourNewBest}`
        );
        accessibleTimeStringProperty = VegasFluent.a11y.levelCompletedNode.timeItem.timeWithNewBest.createProperty( {
          time: formattedTime
        } );
      }
      else if ( bestTimeAtThisLevel !== null ) {
        const formattedBestTime = GameTimer.formatTime( bestTimeAtThisLevel );

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
            `${elapsedTime}<br>${StringUtils.format( pattern, formattedBestTime )}`
        );

        // Time: MM:SS. Your Best: MM:SS.
        accessibleTimeStringProperty = VegasFluent.a11y.levelCompletedNode.timeItem.timeWithBest.createProperty( {
          time: formattedTime,
          bestTime: formattedBestTime
        } );
      }
      else {

        // Time: MM:SS
        timeStringProperty = elapsedTimeStringProperty;
        accessibleTimeStringProperty = VegasFluent.a11y.levelCompletedNode.timeItem.time.createProperty( {
          time: formattedTime
        } );
      }

      vBoxChildren.push( new RichText( timeStringProperty, {
        font: options.infoFont,
        align: 'center',
        maxWidth: options.contentMaxWidth
      } ) );
      accessibleListItems.push( accessibleTimeStringProperty );
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

    // Assemble the accessible list content.
    const accessibleListNode = new AccessibleListNode( accessibleListItems );
    vBoxChildren.push( accessibleListNode );

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
      accessibleTimeStringProperty && accessibleTimeStringProperty.dispose();

      // All VBox children are linked to dynamic string Properties, so must be disposed.
      vBoxChildren.forEach( child => child.dispose() );
    };
  }

  /**
   * Show the LevelCompletedNode, managing focus and context responses for accessibility.
   */
  public show(): void {
    this.visibleProperty.value = true;
    this.continueButton.focus();
    this.addAccessibleContextResponse( VegasFluent.a11y.levelCompletedNode.accessibleContextResponse.format( {
      levelNumber: 1, // TODO, see #138
      stars: 'X', // TODO, see #138
      progressMessage: 'Keep Going' // TODO, see #138
    } ) );
  }

  /**
   * Hides this Node. Currently, no other work but adds symmetry with show().
   */
  public hide(): void {
    this.visibleProperty.value = false;
  }

  public override dispose(): void {
    this.disposeLevelCompletedNode();
    super.dispose();
  }
}

vegas.register( 'LevelCompletedNode', LevelCompletedNode );