// Copyright 2025, University of Colorado Boulder

/**
 * Demonstrates management of level scenes within a game screen. The scenes are built using basic
 * scenery Nodes.
 *
 * Testing some building blocks for focus management and PDOM content.
 * - FocusStack for managing focus between screens.
 * - FocusableHeadingNode for accessible headings.
 * - GameScreenNode as a base class for game screens, with show/hide callbacks for focus management.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import DerivedProperty, { DerivedProperty3 } from '../../../axon/js/DerivedProperty.js';
import NumberProperty from '../../../axon/js/NumberProperty.js';
import Property from '../../../axon/js/Property.js';
import StringProperty from '../../../axon/js/StringProperty.js';
import { TReadOnlyProperty } from '../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../dot/js/Bounds2.js';
import Range from '../../../dot/js/Range.js';
import ScreenView from '../../../joist/js/ScreenView.js';
import StringUtils from '../../../phetcommon/js/util/StringUtils.js';
import PDOMSectionNode from '../../../scenery-phet/js/accessibility/PDOMSectionNode.js';
import ResetAllButton from '../../../scenery-phet/js/buttons/ResetAllButton.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import FocusStack from '../../../scenery/js/accessibility/FocusStack.js';
import FocusableHeadingNode from '../../../scenery/js/accessibility/pdom/FocusableHeadingNode.js';
import VBox from '../../../scenery/js/layout/nodes/VBox.js';
import Node from '../../../scenery/js/nodes/Node.js';
import Text from '../../../scenery/js/nodes/Text.js';
import TextPushButton from '../../../sun/js/buttons/TextPushButton.js';
import Tandem from '../../../tandem/js/Tandem.js';
import CheckButton from '../buttons/CheckButton.js';
import GameInfoButton from '../buttons/GameInfoButton.js';
import GameTimerToggleButton from '../buttons/GameTimerToggleButton.js';
import ShowAnswerButton from '../buttons/ShowAnswerButton.js';
import TryAgainButton from '../buttons/TryAgainButton.js';
import FiniteStatusBar from '../FiniteStatusBar.js';
import GameTimer from '../GameTimer.js';
import LevelSelectionButtonGroup, { LevelSelectionButtonGroupItem } from '../LevelSelectionButtonGroup.js';
import ScoreDisplayStars from '../ScoreDisplayStars.js';
import vegas from '../vegas.js';
import VegasStrings from '../VegasStrings.js';

// Testing a global structure for managing focus between screens.
const focusStack = new FocusStack();

const NUMBER_OF_LEVELS = 5;
const FONT = new PhetFont( 25 );

export default class LevelsScreenView extends ScreenView {
  public constructor() {
    super( {

      // Game screens will not have the usual "play area" and "control area" content.
      includeAccessibleSectionNodes: false,

      tandem: Tandem.OPT_OUT
    } );

    //-------------------- "Model" components -------------------
    const selectedLevelIndexProperty = new Property<null | number>( null, {} );
    const scoreProperty = new NumberProperty( 0, {
      range: new Range( 0, 50 )
    } );
    const gameOverProperty = new DerivedProperty( [
      scoreProperty
    ], ( score: number ) => {
      return score === scoreProperty.range.max;
    } );
    const gameTimer = new GameTimer();
    const timerEnabledProperty = new Property( true );

    const numberOfChallengesProperty = new Property( NUMBER_OF_LEVELS );

    // Even levels will put focus on the accessible heading when the level is shown, odd levels will put focus on
    // a game button.
    const focusHeadingWhenVisible = ( levelNumber: number ) => {
      return levelNumber % 2 === 0;
    };

    //-------------------- Create level screens -------------------
    const levelNodes: GameScreenNode[] = [];
    for ( let level = 0; level < NUMBER_OF_LEVELS; level++ ) {
      const challengeNumberProperty = new Property( level + 1 );

      const levelNode = new MyGameScreenNode(
        level,
        this.layoutBounds,
        this.visibleBoundsProperty,
        scoreProperty,
        gameOverProperty,
        gameTimer,
        timerEnabledProperty,
        selectedLevelIndexProperty,
        challengeNumberProperty,
        numberOfChallengesProperty,
        focusHeadingWhenVisible( level )
      );

      levelNodes.push( levelNode );
    }

    //------------------- Add to scene graph -------------------
    const levelSelectionNode = new LevelSelectionScreenNode(
      scoreProperty,
      selectedLevelIndexProperty,
      this.layoutBounds,
      focusHeadingWhenVisible,
      numberOfChallengesProperty,
      timerEnabledProperty
    );
    const levelNodesParent = new Node(); // parent for all level scenes
    levelNodesParent.children = [ ...levelNodes ];
    this.addChild( levelSelectionNode );
    this.addChild( levelNodesParent );


    //------------------- Visibility management -------------------
    selectedLevelIndexProperty.link( selectedLevelIndex => {
      this.updateVisibility( selectedLevelIndex, levelSelectionNode, levelNodesParent, levelNodes, gameTimer );
    } );
  }

  /**
   * Update which nodes are visible based on the selected level index.
   *
   * @param selectedLevelIndex - the selected level, or null for level selection
   * @param levelSelectionNode - node containing level selection UI
   * @param levelNodesParent - parent for all level nodes, to hide everything for level selection
   * @param levelNodes - all level nodes, to individually set level visibility
   * @param gameTimer - to reset game time when switching levels
   */
  private updateVisibility(
    selectedLevelIndex: number | null,
    levelSelectionNode: GameScreenNode,
    levelNodesParent: Node,
    levelNodes: GameScreenNode[],
    gameTimer: GameTimer
  ): void {

    gameTimer.reset();

    // Show level selection
    if ( selectedLevelIndex === null ) {
      levelSelectionNode.show();
      levelNodesParent.visible = false;
      levelNodes.forEach( levelNode => {
        levelNode.hide();
      } );
    }
    else {

      // Show selected level
      levelSelectionNode.hide();
      levelNodesParent.visible = true;
      levelNodes.forEach( ( levelNode, index ) => {
        if ( index === selectedLevelIndex ) {
          levelNode.show();
        }
        else {
          levelNode.hide();
        }
      } );

      gameTimer.start();
    }
  }
}

class GameScreenNode extends Node {
  public constructor() {
    super();
  }

  public show(): void {
    this.visible = true;
  }

  public hide(): void {
    this.visible = false;
  }
}

class MyGameScreenNode extends GameScreenNode {
  private readonly accessibleHeadingNode: Node;
  private readonly addPointButton: Node;
  private readonly focusHeadingWhenVisible: boolean;
  private readonly level: number;

  public constructor(
    level: number,
    layoutBounds: Bounds2,
    visibleBoundsProperty: Property<Bounds2>,
    scoreProperty: NumberProperty,
    gameOverProperty: TReadOnlyProperty<boolean>,
    gameTimer: GameTimer,
    timerEnabledProperty: Property<boolean>,
    selectedLevelIndexProperty: Property<number | null>,
    challengeNumberProperty: Property<number>,
    numberOfChallengesProperty: Property<number>,
    focusHeadingWhenVisible: boolean
  ) {
    super();

    const statusBar = new FiniteStatusBar( layoutBounds, visibleBoundsProperty, scoreProperty, {
      challengeNumberProperty: challengeNumberProperty,
      numberOfChallengesProperty: numberOfChallengesProperty,
      elapsedTimeProperty: gameTimer.elapsedTimeProperty,
      timerEnabledProperty: timerEnabledProperty,
      startOverButtonOptions: {
        listener: () => {
          selectedLevelIndexProperty.value = null;
        }
      }
    } );

    const accessibleHeadingNode = new FocusableHeadingNode( {
      accessibleName: new ChallengeNumberStringProperty( challengeNumberProperty, numberOfChallengesProperty )
    } );

    const accessibleParagraphForChallenge = new Node( {
      accessibleParagraph: 'Given the button, how many times can you press it?'
    } );

    const addPointButton = new TextPushButton( 'You are a ★', {
      listener: () => {
        scoreProperty.value = Math.min( scoreProperty.value + 1, scoreProperty.range.max );
      },
      enabledProperty: DerivedProperty.not( gameOverProperty ),
      fireOnHold: true,
      fireOnHoldInterval: 25,
      font: FONT
    } );

    const checkAnswerButton = new CheckButton();
    const tryAgainButton = new TryAgainButton();
    const showAnswerButton = new ShowAnswerButton();

    const winnerNode = new Text( '😲 😀 ☺️ 😀 😲', {
      font: new PhetFont( 50 ),
      visibleProperty: gameOverProperty,
      accessibleParagraph: 'You are a winner! Congratulations!'
    } );

    // layout - status bar manages layout at the top
    addPointButton.center = layoutBounds.center;
    winnerNode.centerTop = addPointButton.centerBottom.plusXY( 0, 20 );
    checkAnswerButton.centerTop = winnerNode.centerBottom.plusXY( 0, 20 );
    tryAgainButton.centerTop = checkAnswerButton.centerBottom.plusXY( 0, 20 );
    showAnswerButton.centerTop = tryAgainButton.centerBottom.plusXY( 0, 20 );

    this.addChild( accessibleHeadingNode );
    this.addChild( accessibleParagraphForChallenge );
    this.addChild( winnerNode );
    this.addChild( checkAnswerButton );
    this.addChild( tryAgainButton );
    this.addChild( showAnswerButton );
    this.addChild( addPointButton );
    this.addChild( statusBar );

    this.pdomOrder = [
      accessibleHeadingNode,
      accessibleParagraphForChallenge,
      addPointButton,
      winnerNode,
      checkAnswerButton,
      tryAgainButton,
      showAnswerButton,
      statusBar
    ];

    this.accessibleHeadingNode = accessibleHeadingNode;
    this.addPointButton = addPointButton;
    this.level = level;
    this.focusHeadingWhenVisible = focusHeadingWhenVisible;
  }

  public override show(): void {
    super.show();

    if ( this.focusHeadingWhenVisible ) {

      // Focus the heading when this level is shown
      this.accessibleHeadingNode.focus();
    }
    else {
      // Focus the button when this level is shown
      this.addPointButton.focus();
    }
  }

  public override hide(): void {
    super.hide();
  }
}

class LevelSelectionScreenNode extends GameScreenNode {
  private transientButton: Node | null = null;
  private readonly layoutBounds: Bounds2;
  protected readonly pdomLevelsSectionNode: PDOMSectionNode;
  protected readonly pdomControlsSectionNode: PDOMSectionNode;

  public constructor(
    scoreProperty: NumberProperty,
    selectedLevelIndexProperty: Property<number | null>,
    layoutBounds: Bounds2,
    focusHeadingWhenVisible: ( levelNumber: number ) => boolean,
    numberOfChallengesProperty: Property<number>,
    timerEnabledProperty: Property<boolean>
  ) {
    super();
    this.layoutBounds = layoutBounds;

    const leadingParagraphNode = new Node( {

      // The "Levels" would be the name of the screen.
      accessibleParagraph: 'Welcome to the Levels Screen. Choose a level to start earning stars. Additionally, choose game options for all levels. Use reset all to clear the game and start over.'
    } );

    // Accessibility sections. Content should be placed into these using pdomOrder.
    const levelsSection = new PDOMSectionNode( new StringProperty( 'Choose Your Level' ), {
      accessibleHeadingIncrement: 2
    } );

    const controlsSection = new PDOMSectionNode( new StringProperty( 'Choose Game Options' ), {
      accessibleHeadingIncrement: 2
    } );

    //-------------------- Level selection buttons -------------------
    const levelButtonsItems: LevelSelectionButtonGroupItem[] = [];
    for ( let level = 0; level < NUMBER_OF_LEVELS; level++ ) {


      levelButtonsItems.push( {
        icon: new Text( `Level ${level + 1}`, { font: FONT } ),
        scoreProperty: scoreProperty,

        // Example of customizing a custom brief accessible name for the button.
        options: {
          accessibleHelpText: 'Identify number of reactants needed to create the products and leftovers.',
          listener: () => {

            // The last level screen returns focus to a transient button. Note that the transient button
            // is created/destroyed every time the level selection screen is shown. So the reference
            // is correct in the callback, but would be stale if assigned in this listener.
            focusStack.push( () => {
              return level === 4 ? this.transientButton! : levelSelectionButtonGroup.buttons[ level ];
            } );

            selectedLevelIndexProperty.value = level;
          },
          scoreDisplayProportion: 0.5,
          createScoreDisplay: () => {

            return new VBox( {
              spacing: 25,
              children: [
                new ScoreDisplayStars( scoreProperty, {
                  perfectScore: scoreProperty.range.max,
                  numberOfStars: 5
                } ),
                new Text( focusHeadingWhenVisible( level ) ? 'Focus heading...' : 'Focus button...', { font: FONT } )
              ]
            } );
          }
        }
      } );
    }
    const levelSelectionButtonGroup = new LevelSelectionButtonGroup( levelButtonsItems );

    const gameInfoButton = new GameInfoButton();
    const timerButton = new GameTimerToggleButton( timerEnabledProperty );

    const resetButton = new ResetAllButton( {
      listener: () => {
        scoreProperty.value = 0;
        selectedLevelIndexProperty.value = null;
      }
    } );

    //------------------- Add to scene graph -------------------
    this.children = [
      leadingParagraphNode,
      levelsSection,
      controlsSection,
      levelSelectionButtonGroup,
      gameInfoButton,
      timerButton,
      resetButton
    ];

    this.pdomLevelsSectionNode = levelsSection;
    this.pdomControlsSectionNode = controlsSection;

    // This is what clients might do in their LevelsScreenView.
    this.pdomLevelsSectionNode.pdomOrder = [
      levelSelectionButtonGroup
    ];

    this.pdomControlsSectionNode.pdomOrder = [
      gameInfoButton,
      timerButton,
      resetButton
    ];

    this.pdomOrder = [
      leadingParagraphNode,
      this.pdomLevelsSectionNode,
      this.pdomControlsSectionNode
    ];

    //------------------- Layout -------------------
    levelSelectionButtonGroup.center = layoutBounds.center;
    resetButton.rightBottom = layoutBounds.rightBottom.minusXY( 20, 20 );
    gameInfoButton.rightCenter = resetButton.leftCenter.minusXY( 20, 0 );
    timerButton.rightCenter = gameInfoButton.leftCenter.minusXY( 20, 0 );
  }

  public override show(): void {
    super.show();

    if ( this.transientButton ) {
      this.transientButton.dispose();
    }

    this.transientButton = new TextPushButton( 'Transient Button', {
      font: FONT,
      listener: () => {

        // Don't alert when fuzz testing because it halts everything.
        if ( !phet.chipper.isFuzzEnabled() ) {
          alert(
            'This button is re-created every time the level selection screen is shown. ' +
            'It is here to test focus management. Focus should land here after screen 5.'
          );
        }
      },
      leftBottom: this.layoutBounds.leftBottom.plusXY( 20, -20 )
    } );
    this.addChild( this.transientButton );

    // Restore focus to the last focused button on the level selection screen, or the transient button
    // depending on the focusStack callback.
    focusStack.popFocus();
  }

  public override hide(): void {
    super.hide();
  }
}

class ChallengeNumberStringProperty extends DerivedProperty3<string, string, number, number> {
  public constructor( challengeNumberProperty: TReadOnlyProperty<number>, challengeCountProperty: TReadOnlyProperty<number> ) {
    super( [ VegasStrings.pattern[ '0challenge' ][ '1maxStringProperty' ], challengeNumberProperty, challengeCountProperty ],
      ( pattern: string, challengeNumber: number, challengeCount: number ) => {
        return StringUtils.format( pattern, challengeNumber, challengeCount );
      }, {
        tandem: Tandem.OPT_OUT
      } );
  }
}

vegas.register( 'LevelsScreenView', LevelsScreenView );