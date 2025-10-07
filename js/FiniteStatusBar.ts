// Copyright 2013-2025, University of Colorado Boulder

/**
 * FiniteStatusBar is the status bar for games that have a finite number of challenges per level.
 * This was adapted from and replaces ScoreboardBar. See https://github.com/phetsims/vegas/issues/66.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedStringProperty from '../../axon/js/DerivedStringProperty.js';
import Multilink from '../../axon/js/Multilink.js';
import ReadOnlyProperty from '../../axon/js/ReadOnlyProperty.js';
import { TReadOnlyProperty } from '../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../dot/js/Bounds2.js';
import optionize, { combineOptions } from '../../phet-core/js/optionize.js';
import StrictOmit from '../../phet-core/js/types/StrictOmit.js';
import StringUtils from '../../phetcommon/js/util/StringUtils.js';
import PhetColorScheme from '../../scenery-phet/js/PhetColorScheme.js';
import StatusBar, { StatusBarOptions } from '../../scenery-phet/js/StatusBar.js';
import { findStringProperty } from '../../scenery/js/accessibility/pdom/findStringProperty.js';
import { PDOMValueType } from '../../scenery/js/accessibility/pdom/ParallelDOM.js';
import HBox from '../../scenery/js/layout/nodes/HBox.js';
import Node from '../../scenery/js/nodes/Node.js';
import Rectangle from '../../scenery/js/nodes/Rectangle.js';
import Text, { TextOptions } from '../../scenery/js/nodes/Text.js';
import VStrut from '../../scenery/js/nodes/VStrut.js';
import Font from '../../scenery/js/util/Font.js';
import TColor from '../../scenery/js/util/TColor.js';
import TextPushButton, { TextPushButtonOptions } from '../../sun/js/buttons/TextPushButton.js';
import sharedSoundPlayers from '../../tambo/js/sharedSoundPlayers.js';
import Tandem from '../../tandem/js/Tandem.js';
import ElapsedTimeNode from './ElapsedTimeNode.js';
import ScoreDisplayLabeledNumber from './ScoreDisplayLabeledNumber.js';
import { TScoreDisplayNode } from './TScoreDisplayNode.js';
import vegas from './vegas.js';
import VegasFluent from './VegasFluent.js';
import VegasStrings from './VegasStrings.js';

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
  createScoreDisplay?: ( scoreProperty: ReadOnlyProperty<number>, tandem?: Tandem ) => TScoreDisplayNode;

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

  levelVisible?: boolean;

  // String for the level label, if null the default will be used (if levelVisible is true)
  levelLabelStringProperty?: TReadOnlyProperty<string> | null;
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
      levelLabelStringProperty: null,
      challengeNumberVisible: true,
      font: StatusBar.DEFAULT_FONT,
      textFill: StatusBar.DEFAULT_TEXT_FILL,

      // TODO: This score display needs to be responsible for creating a formatted accessible string representing its content.
      //  See https://github.com/phetsims/vegas/issues/138.
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
      tandem: Tandem.OPTIONAL,
      levelVisible: true,
      visiblePropertyOptions: {
        phetioFeatured: true // See https://github.com/phetsims/balancing-chemical-equations/issues/201
      },

      // pdom - this content is usually a sibling of the accessible h1 of the simulation but
      // accessible headings should start from the next level
      accessibleHeadingIncrement: 2
    }, providedOptions );

    assert && assert( ( options.challengeNumberProperty && options.numberOfChallengesProperty ) ||
                      ( !options.challengeNumberProperty && !options.numberOfChallengesProperty ),
      'challengeNumberProperty and numberOfChallengesProperty are both or neither' );

    // the rectangular bar, size will be set by visibleBoundsListener
    const barNode = new Rectangle( {
      fill: options.barFill,
      stroke: options.barStroke
    } );

    // The accessible heading will be built dynamically as the pattern depends on provided options.
    let accessibleHeading: PDOMValueType;

    // Nodes on the left end of the bar
    const leftChildren = [];

    // Level N
    let levelNumberText: Node;
    if ( options.levelNumberProperty && options.levelNumberVisible ) {

      const labelStringProperty = options.levelLabelStringProperty || VegasStrings.label.levelStringProperty;
      const levelStringProperty = new DerivedStringProperty(
        [ labelStringProperty, options.levelNumberProperty ],
        ( pattern: string, level: number ) => StringUtils.format( pattern, level )
      );

      levelNumberText = new Text( levelStringProperty, combineOptions<TextOptions>( {
        fill: options.textFill,
        font: options.font,
        tandem: options.tandem.createTandem( 'levelNumberText' ),
        phetioFeatured: true,
        phetioVisiblePropertyInstrumented: true,
        visiblePropertyOptions: {
          phetioFeatured: true // See https://github.com/phetsims/balancing-chemical-equations/issues/201
        }
      }, options.levelTextOptions ) );

      leftChildren.push( levelNumberText );

      if ( levelNumberText.isPhetioInstrumented() && options.levelNumberProperty.isPhetioInstrumented() ) {
        levelNumberText.addLinkedElement( options.levelNumberProperty );
      }

      accessibleHeading = VegasFluent.a11y.statusBar.accessibleHeadingWithLevelNumber.createProperty( {
        levelNumber: options.levelNumberProperty
      } );
    }
    else {
      accessibleHeading = VegasFluent.a11y.statusBar.accessibleHeadingStringProperty;
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
        phetioFeatured: true,
        phetioVisiblePropertyInstrumented: true,
        visiblePropertyOptions: {
          phetioFeatured: true // See https://github.com/phetsims/balancing-chemical-equations/issues/201
        },

        // pdom - the challenge number is a list item in the list of left items
        tagName: 'li',
        innerContent: challengeNumberStringProperty
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

    // TODO: The scoreDisplay be responsible for creating a formatted accessible string representing its content?
    //  See https://github.com/phetsims/vegas/issues/138
    scoreDisplay.tagName = 'li';
    scoreDisplay.innerContent = findStringProperty( scoreDisplay );

    leftChildren.push( scoreDisplay );

    // Timer (optional)
    let elapsedTimeNode: Node;
    if ( options.elapsedTimeProperty && options.timerEnabledProperty ) {
      elapsedTimeNode = new ElapsedTimeNode( options.elapsedTimeProperty, {
        visibleProperty: options.timerEnabledProperty,
        clockIconRadius: options.clockIconRadius,
        font: options.font,
        textFill: options.textFill,
        tandem: options.tandem.createTandem( 'elapsedTimeNode' ),

        // The elapsed time is a list item in the list of left items.
        tagName: 'li'
      } );
      leftChildren.push( elapsedTimeNode );
    }

    // Start Over button
    // TODO: Is it true that all start over buttons go back to the level selection screen?
    //  Just making sure  "Choose Your Level!" is general enough.
    //  See https://github.com/phetsims/vegas/issues/138
    const startOverButton = new TextPushButton( options.startOverButtonText, combineOptions<TextPushButtonOptions>( {
      font: options.font,
      textFill: options.textFill,
      baseColor: PhetColorScheme.BUTTON_YELLOW,
      xMargin: 10,
      yMargin: 8,
      listener: _.noop,
      maxWidth: 0.2 * ( layoutBounds.width - ( 2 * options.xMargin ) ), // use 20% of available width
      soundPlayer: sharedSoundPlayers.get( 'goBack' ),
      tandem: options.tandem.createTandem( 'startOverButton' )
    }, options.startOverButtonOptions ) );

    // Add a vertical strut so that barNode will be the correct height when we show/hide the timer.
    // See https://github.com/phetsims/vegas/issues/80
    const maxHeightLeftChildren = _.maxBy( leftChildren, child => child.height )!.height;
    leftChildren.push( new VStrut( maxHeightLeftChildren ) );

    // Nodes on the left end of the bar
    const leftNodes = new HBox( {
      spacing: options.xSpacing,
      children: leftChildren,

      // pdom - the information on the left side of the bar is contained in a list
      tagName: 'ul'
    } );

    options.children = [
      barNode,
      leftNodes,
      startOverButton
    ];

    options.barHeight = Math.max( leftNodes.height, scoreDisplay.height ) + ( 2 * options.yMargin );

    super( layoutBounds, visibleBoundsProperty, options );

    // Apply computed content
    this.accessibleHeading = accessibleHeading;

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
      accessibleHeading.dispose();
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