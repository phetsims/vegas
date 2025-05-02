// Copyright 2013-2025, University of Colorado Boulder

/**
 * FiniteStatusBar is the status bar for games that have a finite number of challenges per level.
 * This was adapted from and replaces ScoreboardBar. See https://github.com/phetsims/vegas/issues/66.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Multilink from '../../axon/js/Multilink.js';
import TReadOnlyProperty from '../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../dot/js/Bounds2.js';
import optionize, { combineOptions } from '../../phet-core/js/optionize.js';
import StrictOmit from '../../phet-core/js/types/StrictOmit.js';
import StringUtils from '../../phetcommon/js/util/StringUtils.js';
import PhetColorScheme from '../../scenery-phet/js/PhetColorScheme.js';
import StatusBar, { StatusBarOptions } from '../../scenery-phet/js/StatusBar.js';
import HBox from '../../scenery/js/layout/nodes/HBox.js';
import Node from '../../scenery/js/nodes/Node.js';
import Rectangle from '../../scenery/js/nodes/Rectangle.js';
import Text, { TextOptions } from '../../scenery/js/nodes/Text.js';
import Font from '../../scenery/js/util/Font.js';
import TColor from '../../scenery/js/util/TColor.js';
import TextPushButton, { TextPushButtonOptions } from '../../sun/js/buttons/TextPushButton.js';
import ElapsedTimeNode from './ElapsedTimeNode.js';
import ScoreDisplayLabeledNumber from './ScoreDisplayLabeledNumber.js';
import vegas from './vegas.js';
import VegasStrings from './VegasStrings.js';
import VStrut from '../../scenery/js/nodes/VStrut.js';
import Tandem from '../../tandem/js/Tandem.js';
import DerivedStringProperty from '../../axon/js/DerivedStringProperty.js';
import ReadOnlyProperty from '../../axon/js/ReadOnlyProperty.js';

type SelfOptions = {

  // optional Properties
  challengeNumberProperty?: ReadOnlyProperty<number> | null;
  numberOfChallengesProperty?: ReadOnlyProperty<number> | null;
  levelNumberProperty?: ReadOnlyProperty<number> | null;
  elapsedTimeProperty?: ReadOnlyProperty<number> | null;
  timerEnabledProperty?: TReadOnlyProperty<boolean> | null;

  // things that can be hidden
  levelNumberVisible?: boolean;
  challengeNumberVisible?: boolean;

  // all text
  font?: Font;
  textFill?: TColor;

  // score display
  createScoreDisplay?: ( scoreProperty: ReadOnlyProperty<number>, tandem?: Tandem ) => Node;

  // nested options for 'Start Over' button, filled in below
  startOverButtonOptions?: StrictOmit<TextPushButtonOptions, 'tandem'>;
  startOverButtonText?: string | TReadOnlyProperty<string>;

  // options for the timer node
  clockIconRadius?: number;

  // spacing and margin for things in the bar
  xSpacing?: number;
  xMargin?: number;
  yMargin?: number;

  levelTextOptions?: StrictOmit<TextOptions, 'tandem'>; // passed to the "Level N" text
  challengeTextOptions?: StrictOmit<TextOptions, 'tandem'>; // passed to the "Challenge N of M" text

  barFill?: TColor;
  barStroke?: TColor;
};

export type FiniteStatusBarOptions = SelfOptions & StrictOmit<StatusBarOptions, 'children' | 'barHeight'>;

export default class FiniteStatusBar extends StatusBar {

  private readonly disposeFiniteStatusBar: () => void;

  /**
   * @param layoutBounds - layoutBounds of the ScreenView
   * @param visibleBoundsProperty - visible bounds of the ScreenView
   * @param scoreProperty
   * @param providedOptions
   */
  public constructor( layoutBounds: Bounds2,
                      visibleBoundsProperty: TReadOnlyProperty<Bounds2>,
                      scoreProperty: ReadOnlyProperty<number>,
                      providedOptions?: FiniteStatusBarOptions ) {

    const options = optionize<FiniteStatusBarOptions,
      StrictOmit<SelfOptions, 'startOverButtonOptions' | 'levelTextOptions' | 'challengeTextOptions'>,
      StatusBarOptions>()( {

      // SelfOptions
      challengeNumberProperty: null,
      numberOfChallengesProperty: null,
      levelNumberProperty: null,
      elapsedTimeProperty: null,
      timerEnabledProperty: null,
      levelNumberVisible: true,
      challengeNumberVisible: true,
      font: StatusBar.DEFAULT_FONT,
      textFill: StatusBar.DEFAULT_TEXT_FILL,
      createScoreDisplay: ( scoreProperty, tandem ) => new ScoreDisplayLabeledNumber( scoreProperty, {
        font: providedOptions && providedOptions.font ? providedOptions.font : StatusBar.DEFAULT_FONT,
        textFill: providedOptions && providedOptions.textFill ? providedOptions.textFill : StatusBar.DEFAULT_TEXT_FILL,
        tandem: tandem ? tandem : Tandem.OPT_OUT
      } ),
      startOverButtonText: VegasStrings.startOverStringProperty,
      clockIconRadius: 15,
      xSpacing: 50,
      xMargin: 20,
      yMargin: 10,
      barFill: null,
      barStroke: null,
      tandem: Tandem.OPTIONAL
    }, providedOptions );

    assert && assert( ( options.challengeNumberProperty && options.numberOfChallengesProperty ) ||
                      ( !options.challengeNumberProperty && !options.numberOfChallengesProperty ),
      'challengeNumberProperty and numberOfChallengesProperty are both or neither' );

    // the rectangular bar, size will be set by visibleBoundsListener
    const barNode = new Rectangle( {
      fill: options.barFill,
      stroke: options.barStroke
    } );

    // Nodes on the left end of the bar
    const leftChildren = [];

    // Level N
    let levelNumberText: Node;
    if ( options.levelNumberProperty && options.levelNumberVisible ) {

      const levelStringProperty = new DerivedStringProperty(
        [ VegasStrings.label.levelStringProperty, options.levelNumberProperty ],
        ( pattern: string, level: number ) => StringUtils.format( pattern, level )
      );

      levelNumberText = new Text( levelStringProperty, combineOptions<TextOptions>( {
        fill: options.textFill,
        font: options.font,
        tandem: options.tandem.createTandem( 'levelNumberText' ),
        phetioVisiblePropertyInstrumented: true,
        phetioFeatured: true
      }, options.levelTextOptions ) );

      leftChildren.push( levelNumberText );

      if ( levelNumberText.isPhetioInstrumented() && options.levelNumberProperty.isPhetioInstrumented() ) {
        levelNumberText.addLinkedElement( options.levelNumberProperty );
      }
    }

    // Challenge N of M
    let challengeNumberText: Node;
    if ( options.challengeNumberProperty && options.numberOfChallengesProperty ) {

      const challengeNumberStringProperty = new DerivedStringProperty(
        [ VegasStrings.pattern[ '0challenge' ][ '1maxStringProperty' ], options.challengeNumberProperty, options.numberOfChallengesProperty ],
        ( pattern: string, challengeNumber: number, numberOfChallenges: number ) =>
          StringUtils.format( pattern, challengeNumber, numberOfChallenges )
      );

      challengeNumberText = new Text( challengeNumberStringProperty, combineOptions<TextOptions>( {
        fill: options.textFill,
        font: options.font,
        tandem: options.tandem.createTandem( 'challengeNumberText' ),
        phetioVisiblePropertyInstrumented: true,
        phetioFeatured: true
      }, options.challengeTextOptions ) );

      leftChildren.push( challengeNumberText );

      if ( challengeNumberText.isPhetioInstrumented() && options.challengeNumberProperty.isPhetioInstrumented() ) {
        challengeNumberText.addLinkedElement( options.challengeNumberProperty );
      }

      if ( challengeNumberText.isPhetioInstrumented() && options.numberOfChallengesProperty.isPhetioInstrumented() ) {
        challengeNumberText.addLinkedElement( options.numberOfChallengesProperty );
      }
    }

    // Score
    const scoreDisplay = options.createScoreDisplay( scoreProperty, options.tandem.createTandem( 'scoreDisplay' ) );
    leftChildren.push( scoreDisplay );

    // Timer (optional)
    let elapsedTimeNode: Node;
    if ( options.elapsedTimeProperty && options.timerEnabledProperty ) {
      elapsedTimeNode = new ElapsedTimeNode( options.elapsedTimeProperty, {
        visibleProperty: options.timerEnabledProperty,
        clockIconRadius: options.clockIconRadius,
        font: options.font,
        textFill: options.textFill,
        tandem: options.tandem.createTandem( 'elapsedTimeNode' )
      } );
      leftChildren.push( elapsedTimeNode );
    }

    // Start Over button
    const startOverButton = new TextPushButton( options.startOverButtonText, combineOptions<TextPushButtonOptions>( {
      font: options.font,
      textFill: options.textFill,
      baseColor: PhetColorScheme.BUTTON_YELLOW,
      xMargin: 10,
      yMargin: 8,
      listener: _.noop,
      maxWidth: 0.2 * ( layoutBounds.width - ( 2 * options.xMargin ) ), // use 20% of available width
      tandem: options.tandem.createTandem( 'startOverButton' )
    }, options.startOverButtonOptions ) );

    // Add a vertical strut so that barNode will be the correct height when we show/hide the timer.
    // See https://github.com/phetsims/vegas/issues/80
    const maxHeightLeftChildren = _.maxBy( leftChildren, child => child.height )!.height;
    leftChildren.push( new VStrut( maxHeightLeftChildren ) );

    // Nodes on the left end of the bar
    const leftNodes = new HBox( {
      spacing: options.xSpacing,
      children: leftChildren
    } );

    options.children = [
      barNode,
      leftNodes,
      startOverButton
    ];

    options.barHeight = Math.max( leftNodes.height, scoreDisplay.height ) + ( 2 * options.yMargin );

    super( layoutBounds, visibleBoundsProperty, options );

    // Dynamically position components on the bar.
    Multilink.multilink( [ this.positioningBoundsProperty, leftNodes.boundsProperty, startOverButton.boundsProperty ],
      ( positioningBounds: Bounds2, leftNodeBounds: Bounds2, startOverButtonBounds: Bounds2 ) => {
        leftNodes.maxWidth = ( layoutBounds.width - ( 2 * options.xMargin ) - startOverButtonBounds.width - options.xSpacing );
        leftNodes.left = positioningBounds.left;
        leftNodes.centerY = positioningBounds.centerY;
        startOverButton.right = positioningBounds.right;
        startOverButton.centerY = positioningBounds.centerY;
      } );

    this.disposeFiniteStatusBar = () => {
      levelNumberText.dispose();
      challengeNumberText.dispose();
      scoreDisplay.dispose();
      elapsedTimeNode && elapsedTimeNode.dispose();
      startOverButton.dispose();
      elapsedTimeNode && elapsedTimeNode.dispose();
    };
  }

  public override dispose(): void {
    this.disposeFiniteStatusBar();
    super.dispose();
  }
}

vegas.register( 'FiniteStatusBar', FiniteStatusBar );