// Copyright 2013-2022, University of Colorado Boulder

/**
 * FiniteStatusBar is the status bar for games that have a finite number of challenges per level.
 * This was adapted from and replaces ScoreboardBar. See https://github.com/phetsims/vegas/issues/66.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize from '../../phet-core/js/optionize.js';
import merge from '../../phet-core/js/merge.js';
import StringUtils from '../../phetcommon/js/util/StringUtils.js';
import PhetColorScheme from '../../scenery-phet/js/PhetColorScheme.js';
import { Font, HBox, IColor, Node, Rectangle, Text, TextOptions } from '../../scenery/js/imports.js';
import TextPushButton, { TextPushButtonOptions } from '../../sun/js/buttons/TextPushButton.js';
import Tandem from '../../tandem/js/Tandem.js';
import ElapsedTimeNode from './ElapsedTimeNode.js';
import ScoreDisplayLabeledNumber from './ScoreDisplayLabeledNumber.js';
import ScoreDisplayLabeledStars from './ScoreDisplayLabeledStars.js';
import StatusBar, { StatusBarOptions } from '../../scenery-phet/js/StatusBar.js';
import vegas from './vegas.js';
import vegasStrings from './vegasStrings.js';
import IProperty from '../../axon/js/IProperty.js';
import Bounds2 from '../../dot/js/Bounds2.js';

// Valid values for scoreDisplayConstructor. These are the types that are relevant for this status bar.
// All constructors must have the same signature!
//TODO https://github.com/phetsims/vegas/issues/102
const VALID_SCORE_DISPLAY_CONSTRUCTORS = [
  ScoreDisplayLabeledNumber, ScoreDisplayLabeledStars
];

type SelfOptions = {

  // optional Properties
  challengeIndexProperty?: IProperty<number> | null;
  numberOfChallengesProperty?: IProperty<number> | null;
  levelProperty?: IProperty<number> | null;
  elapsedTimeProperty?: IProperty<number> | null;
  timerEnabledProperty?: IProperty<boolean> | null;

  // things that can be hidden
  levelVisible?: boolean;
  challengeNumberVisible?: boolean;

  // all text
  font?: Font;
  textFill?: IColor;

  // score display
  scoreDisplayConstructor?: any; //TODO https://github.com/phetsims/vegas/issues/102
  scoreDisplayOptions?: any; //TODO https://github.com/phetsims/vegas/issues/102

  // nested options for 'Start Over' button, filled in below
  startOverButtonOptions?: TextPushButtonOptions;
  startOverButtonText?: string;

  // options for the timer node
  clockIconRadius?: number;

  // spacing and margin for things in the bar
  xSpacing?: number;
  xMargin?: number;
  yMargin?: number;

  levelTextOptions?: TextOptions; // passed to the "Level N" text
  challengeTextOptions?: TextOptions; // passed to the "Challenge N of M" text

  barFill?: IColor;
  barStroke?: IColor;
};

export type FiniteStatusBarOptions = SelfOptions & StatusBarOptions;

export default class FiniteStatusBar extends StatusBar {

  private readonly disposeFiniteStatusBar: () => void;

  /**
   * @param layoutBounds - layoutBounds of the ScreenView
   * @param visibleBoundsProperty - visible bounds of the ScreenView
   * @param scoreProperty
   * @param providedOptions
   */
  constructor( layoutBounds: Bounds2, visibleBoundsProperty: IProperty<Bounds2>, scoreProperty: IProperty<number>,
               providedOptions?: FiniteStatusBarOptions ) {

    const options = optionize<FiniteStatusBarOptions,
      Omit<SelfOptions, 'startOverButtonOptions' | 'levelTextOptions' | 'challengeTextOptions'>,
      StatusBarOptions>()( {

      // SelfOptions
      challengeIndexProperty: null,
      numberOfChallengesProperty: null,
      levelProperty: null,
      elapsedTimeProperty: null,
      timerEnabledProperty: null,
      levelVisible: true,
      challengeNumberVisible: true,
      font: StatusBar.DEFAULT_FONT,
      textFill: 'black',
      scoreDisplayConstructor: ScoreDisplayLabeledNumber,
      scoreDisplayOptions: null,
      startOverButtonText: vegasStrings.startOver,
      clockIconRadius: 15,
      xSpacing: 50,
      xMargin: 20,
      yMargin: 10,
      barFill: null,
      barStroke: null,

      // StatusBarOptions
      tandem: Tandem.REQUIRED
    }, providedOptions );

    // nested options for score display
    options.scoreDisplayOptions = merge( {
      font: options.font,
      textFill: options.textFill
    }, options.scoreDisplayOptions );

    // nested options for 'Start Over' button
    options.startOverButtonOptions = optionize<TextPushButtonOptions, {}, TextPushButtonOptions>()( {
      font: options.font,
      textFill: options.textFill,
      baseColor: PhetColorScheme.BUTTON_YELLOW,
      xMargin: 10,
      yMargin: 8,
      listener: () => {},
      tandem: options.tandem.createTandem( 'startOverButton' ),
      maxWidth: 0.2 * ( layoutBounds.width - ( 2 * options.xMargin ) ) // use 20% of available width
    }, options.startOverButtonOptions );

    assert && assert( _.includes( VALID_SCORE_DISPLAY_CONSTRUCTORS, options.scoreDisplayConstructor ),
      `invalid scoreDisplayConstructor: ${options.scoreDisplayConstructor}` );
    assert && assert( ( options.challengeIndexProperty && options.numberOfChallengesProperty ) ||
                      ( !options.challengeIndexProperty && !options.numberOfChallengesProperty ),
      'challengeIndexProperty and numberOfChallengesProperty are both or neither' );

    // nested options for 'Level N' text
    options.levelTextOptions = optionize<TextOptions, {}, TextOptions>()( {
      fill: options.textFill,
      font: options.font
    }, options.levelTextOptions );

    // nested options for 'Challenge N of M' text
    options.challengeTextOptions = optionize<TextOptions, {}, TextOptions>()( {
      fill: options.textFill,
      font: options.font
    }, options.challengeTextOptions );

    // the rectangular bar, size will be set by visibleBoundsListener
    const barNode = new Rectangle( {
      fill: options.barFill,
      stroke: options.barStroke
    } );

    // Nodes on the left end of the bar
    const leftChildren = [];

    // Level N
    let levelListener: ( ( level: number ) => void ) | null = null;
    if ( options.levelProperty && options.levelVisible ) {

      const levelText = new Text( '', optionize<TextOptions, {}, TextOptions>()( {
        tandem: options.tandem.createTandem( 'levelText' )
      }, options.levelTextOptions ) );
      leftChildren.push( levelText );

      levelListener = ( level: number ) => {
        levelText.text = StringUtils.format( vegasStrings.label.level, level );
      };
      options.levelProperty.link( levelListener );
    }

    // Challenge N of M
    let updateChallengeString: ( () => void ) | null = null;
    if ( options.challengeIndexProperty && options.numberOfChallengesProperty ) {

      const challengeNumberText = new Text( '', optionize<TextOptions, {}, TextOptions>()( {
        tandem: options.tandem.createTandem( 'challengeNumberText' )
      }, options.challengeTextOptions ) );
      leftChildren.push( challengeNumberText );

      updateChallengeString = () => {
        challengeNumberText.text = StringUtils.format( vegasStrings.pattern[ '0challenge' ][ '1max' ],
          options.challengeIndexProperty!.get() + 1, options.numberOfChallengesProperty!.get() );
      };
      options.challengeIndexProperty.link( updateChallengeString );
      options.numberOfChallengesProperty.link( updateChallengeString );
    }

    // Score
    const scoreDisplay = new options.scoreDisplayConstructor( scoreProperty, options.scoreDisplayOptions );
    leftChildren.push( scoreDisplay );

    // Timer
    let elapsedTimeNode: Node | null = null;
    let timerEnabledListener: ( ( timerEnabled: boolean ) => void ) | null = null;
    if ( options.elapsedTimeProperty && options.timerEnabledProperty ) {

      elapsedTimeNode = new ElapsedTimeNode( options.elapsedTimeProperty, {
        clockIconRadius: options.clockIconRadius,
        font: options.font,
        textFill: options.textFill
      } );
      leftChildren.push( elapsedTimeNode );

      timerEnabledListener = ( timerEnabled: boolean ) => {
        elapsedTimeNode!.visible = ( !!options.timerEnabledProperty && timerEnabled );
      };
      options.timerEnabledProperty && options.timerEnabledProperty.link( timerEnabledListener );
    }

    // Start Over button
    const startOverButton = new TextPushButton( options.startOverButtonText, options.startOverButtonOptions );

    // Nodes on the left end of the bar
    const leftNodes = new HBox( {

      // Because elapsedTimeNode needs to be considered regardless of whether it's visible,
      // see https://github.com/phetsims/vegas/issues/80
      excludeInvisibleChildrenFromBounds: false,
      resize: false,
      spacing: options.xSpacing,
      children: leftChildren,
      maxWidth: ( layoutBounds.width - ( 2 * options.xMargin ) - startOverButton.width - options.xSpacing )
    } );

    assert && assert( !options.children, 'FiniteStatusBar sets children' );
    options.children = [ barNode, leftNodes, startOverButton ];

    assert && assert( options.barHeight === undefined, 'FiniteStatusBar sets barHeight' );
    options.barHeight = Math.max( leftNodes.height, scoreDisplay.height ) + ( 2 * options.yMargin );

    super( layoutBounds, visibleBoundsProperty, options );

    // Position components on the bar.
    this.positioningBoundsProperty.link( positioningBounds => {
      leftNodes.left = positioningBounds.left;
      leftNodes.centerY = positioningBounds.centerY;
      startOverButton.right = positioningBounds.right;
      startOverButton.centerY = positioningBounds.centerY;
    } );

    this.disposeFiniteStatusBar = () => {

      scoreDisplay.dispose();
      elapsedTimeNode && elapsedTimeNode.dispose();

      if ( options.levelProperty && levelListener && options.levelProperty.hasListener( levelListener ) ) {
        options.levelProperty.unlink( levelListener );
      }

      if ( options.challengeIndexProperty && updateChallengeString && options.challengeIndexProperty.hasListener( updateChallengeString ) ) {
        options.challengeIndexProperty.unlink( updateChallengeString );
      }

      if ( options.numberOfChallengesProperty && updateChallengeString && options.numberOfChallengesProperty.hasListener( updateChallengeString ) ) {
        options.numberOfChallengesProperty.link( updateChallengeString );
      }

      if ( options.timerEnabledProperty && timerEnabledListener && options.timerEnabledProperty.hasListener( timerEnabledListener ) ) {
        options.timerEnabledProperty.unlink( timerEnabledListener );
      }
    };
  }

  public override dispose(): void {
    this.disposeFiniteStatusBar();
    super.dispose();
  }
}

vegas.register( 'FiniteStatusBar', FiniteStatusBar );