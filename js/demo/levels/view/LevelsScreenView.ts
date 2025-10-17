// Copyright 2025, University of Colorado Boulder

/**
 * Demonstrates management of level scenes within a game screen. The scenes are built using basic
 * scenery Nodes.
 *
 * Testing some building blocks for focus management and PDOM content.
 * - FocusableHeadingNode for accessible headings.
 * - ChallengeScreenNode as a base class for game screens, with show/hide callbacks for focus management.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../../axon/js/DerivedProperty.js';
import Multilink from '../../../../../axon/js/Multilink.js';
import NumberProperty from '../../../../../axon/js/NumberProperty.js';
import Property from '../../../../../axon/js/Property.js';
import ReadOnlyProperty from '../../../../../axon/js/ReadOnlyProperty.js';
import StringProperty from '../../../../../axon/js/StringProperty.js';
import { TReadOnlyProperty } from '../../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../../dot/js/Bounds2.js';
import ScreenView from '../../../../../joist/js/ScreenView.js';
import ResetAllButton from '../../../../../scenery-phet/js/buttons/ResetAllButton.js';
import PhetFont from '../../../../../scenery-phet/js/PhetFont.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import Text from '../../../../../scenery/js/nodes/Text.js';
import TextPushButton from '../../../../../sun/js/buttons/TextPushButton.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import CheckButton from '../../../buttons/CheckButton.js';
import GameInfoButton from '../../../buttons/GameInfoButton.js';
import GameTimerToggleButton from '../../../buttons/GameTimerToggleButton.js';
import ShowAnswerButton from '../../../buttons/ShowAnswerButton.js';
import TryAgainButton from '../../../buttons/TryAgainButton.js';
import FiniteStatusBar from '../../../FiniteStatusBar.js';
import ChallengeScreenNode from '../../../ChallengeScreenNode.js';
import GameTimer from '../../../GameTimer.js';
import LevelCompletedNode from '../../../LevelCompletedNode.js';
import LevelSelectionButtonGroup, { LevelSelectionButtonGroupItem } from '../../../LevelSelectionButtonGroup.js';
import LevelSelectionScreenNode from '../../../LevelSelectionScreenNode.js';
import RewardScreenNode from '../../../RewardScreenNode.js';
import ScoreDisplayStars from '../../../ScoreDisplayStars.js';
import vegas from '../../../vegas.js';
import VegasScreenNode from '../../../VegasScreenNode.js';
import LevelsModel, { GameState } from '../model/LevelsModel.js';

const NUMBER_OF_LEVELS = 5;
const FONT = new PhetFont( 25 );


export default class LevelsScreenView extends ScreenView {
  public constructor( levelsModel: LevelsModel ) {
    super( {

      // Game screens will not have the usual "play area" and "control area" content.
      includeAccessibleSectionNodes: false,

      tandem: Tandem.OPT_OUT
    } );

    //-------------------- Create level screens -------------------
    const levelNodes: ChallengeScreenNode[] = [];
    for ( let level = 0; level < NUMBER_OF_LEVELS; level++ ) {
      const challengeNumberProperty = new Property( level + 1 );

      const levelNode = new MyChallengeScreenNode(
        levelsModel.levelNumberProperty,
        this.layoutBounds,
        this.visibleBoundsProperty,
        levelsModel.scoreProperty,
        levelsModel.gameOverProperty,
        levelsModel.gameTimer,
        levelsModel.timerEnabledProperty,
        levelsModel.gameStateProperty,
        challengeNumberProperty,
        levelsModel.challengesPerLevelProperty
      );

      levelNodes.push( levelNode );
    }

    const rewardScreenNode = new MyRewardScreenNode( levelsModel.levelNumberProperty );

    let oldCompletedNode: Node | null;

    levelsModel.scoreProperty.link( score => {
      if ( score === levelsModel.scoreProperty.range.max ) {

        if ( oldCompletedNode ) {
          oldCompletedNode.dispose();
          oldCompletedNode = null;
        }

        // create a level completed node to show the level completion dialog
        const levelCompletedNode = new LevelCompletedNode(
          levelsModel.levelNumberProperty.value,
          levelsModel.scoreProperty.value,
          levelsModel.scoreProperty.range.max,
          5,
          levelsModel.timerEnabledProperty.value,
          levelsModel.gameTimer.elapsedTimeProperty.value,
          null,
          true,
          () => {
            levelsModel.gameStateProperty.value = 'levelSelection';

            levelCompletedNode.dispose();
            oldCompletedNode = null;
          }
        );
        this.addChild( levelCompletedNode );

        levelCompletedNode.center = this.layoutBounds.center;

        rewardScreenNode.accessibleRewardSectionNode.pdomOrder = [ levelCompletedNode ];
        levelsModel.gameStateProperty.value = 'reward';

        levelCompletedNode.visible = true;

        oldCompletedNode = levelCompletedNode;
      }
    } );

    //------------------- Add to scene graph -------------------
    const levelSelectionNode = new TestLevelSelectionScreenNode(
      levelsModel.levelNumberProperty,
      levelsModel.scoreProperty,
      levelsModel.gameStateProperty,
      this.layoutBounds,
      levelsModel.challengesPerLevelProperty,
      levelsModel.timerEnabledProperty
    );
    const levelNodesParent = new Node(); // parent for all level scenes
    levelNodesParent.children = [ ...levelNodes ];
    this.addChild( levelSelectionNode );
    this.addChild( levelNodesParent );
    this.addChild( rewardScreenNode );


    //------------------- Visibility management -------------------
    Multilink.multilink( [
      levelsModel.gameStateProperty,
      levelsModel.levelNumberProperty
    ], ( gameState, levelNumber ) => {
      this.updateVisibility( gameState, levelNumber, levelSelectionNode, levelNodesParent, levelNodes, rewardScreenNode, levelsModel.gameTimer );
    } );
  }

  /**
   * Update which nodes are visible based on the selected level index.
   *
   * @param gameState - state of gameplay
   * @param levelNumber - 1-based level number
   * @param levelSelectionNode - node containing level selection UI
   * @param levelNodesParent - parent for all level nodes, to hide everything for level selection
   * @param levelNodes - all level nodes, to individually set level visibility
   * @param rewardScreenNode - node containing reward screen UI
   * @param gameTimer - to reset game time when switching levels
   */
  private updateVisibility(
    gameState: GameState,
    levelNumber: number,
    levelSelectionNode: VegasScreenNode,
    levelNodesParent: Node,
    levelNodes: ChallengeScreenNode[],
    rewardScreenNode: VegasScreenNode,
    gameTimer: GameTimer
  ): void {

    gameTimer.reset();

    // Show level selection
    if ( gameState === 'levelSelection' ) {
      this.hideChallenges( levelNodesParent, levelNodes );
      rewardScreenNode.visibleProperty.value = false;
      levelSelectionNode.visibleProperty.value = true;
    }
    else if ( gameState === 'reward' ) {
      this.hideChallenges( levelNodesParent, levelNodes );
      levelSelectionNode.visibleProperty.value = false;
      rewardScreenNode.visibleProperty.value = true;
    }
    else {
      levelSelectionNode.visibleProperty.value = false;
      rewardScreenNode.visibleProperty.value = false;
      this.showChallenges( levelNodesParent, levelNodes, levelNumber, gameTimer );
    }
  }

  private showChallenges( levelNodesParent: Node, levelNodes: ChallengeScreenNode[], levelNumber: number, gameTimer: GameTimer ): void {
    levelNodesParent.visible = true;
    levelNodes.forEach( ( levelNode, index ) => {
      if ( index === levelNumber - 1 ) {
        levelNode.visibleProperty.value = true;
      }
      else {
        levelNode.visibleProperty.value = false;
      }
    } );

    gameTimer.start();
  }

  private hideChallenges( levelNodesParent: Node, levelNodes: ChallengeScreenNode[] ): void {
    levelNodesParent.visible = false;
    levelNodes.forEach( levelNode => {
      levelNode.visibleProperty.value = false;
    } );
  }
}

class MyRewardScreenNode extends RewardScreenNode {
  public constructor( levelNumberProperty: TReadOnlyProperty<number> ) {
    super( levelNumberProperty );
  }
}

class MyChallengeScreenNode extends ChallengeScreenNode {
  private readonly addPointButton: Node;
  private readonly levelNumberProperty: ReadOnlyProperty<number>;

  public constructor(
    levelNumberProperty: ReadOnlyProperty<number>,
    layoutBounds: Bounds2,
    visibleBoundsProperty: Property<Bounds2>,
    scoreProperty: NumberProperty,
    gameOverProperty: TReadOnlyProperty<boolean>,
    gameTimer: GameTimer,
    timerEnabledProperty: Property<boolean>,
    gameStateProperty: Property<GameState>,
    challengeNumberProperty: Property<number>,
    numberOfChallengesProperty: Property<number>
  ) {
    super( {
      challengeNumberProperty: challengeNumberProperty,
      challengeCountProperty: numberOfChallengesProperty,

      accessibleChallengePrompt: 'This is the challenge prompt. Try to get 5 stars to complete the level.',
      accessibleAnswerSummary: 'This is the answer summary after pressing Show Answer.'
    } );

    const statusBar = new FiniteStatusBar( layoutBounds, visibleBoundsProperty, scoreProperty, {
      levelNumberProperty: levelNumberProperty,
      challengeNumberProperty: challengeNumberProperty,
      numberOfChallengesProperty: numberOfChallengesProperty,
      elapsedTimeProperty: gameTimer.elapsedTimeProperty,
      timerEnabledProperty: timerEnabledProperty,
      startOverButtonOptions: {
        listener: () => {
          gameStateProperty.value = 'levelSelection';
        }
      }
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
    const showAnswerButton = new ShowAnswerButton( {
      listener: () => {
        this.setAnswerSummaryVisible( true );
      }
    } );

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

    this.addChild( winnerNode );
    this.addChild( checkAnswerButton );
    this.addChild( tryAgainButton );
    this.addChild( showAnswerButton );
    this.addChild( addPointButton );
    this.addChild( statusBar );

    this.accessibleChallengeSectionNode.pdomOrder = [
      addPointButton
    ];

    this.accessibleAnswerSectionNode.pdomOrder = [
      winnerNode,
      checkAnswerButton,
      tryAgainButton,
      showAnswerButton
    ];

    this.accessibleStatusSectionNode.pdomOrder = [
      statusBar
    ];

    this.addPointButton = addPointButton;
    this.levelNumberProperty = levelNumberProperty;
  }
}

class TestLevelSelectionScreenNode extends LevelSelectionScreenNode {
  private transientButton: Node | null = null;
  private readonly layoutBounds: Bounds2;

  public constructor(
    levelNumberProperty: NumberProperty,
    scoreProperty: NumberProperty,
    gameStateProperty: Property<GameState>,
    layoutBounds: Bounds2,
    numberOfChallengesProperty: Property<number>,
    timerEnabledProperty: Property<boolean>
  ) {

    //-------------------- Level selection buttons -------------------
    const levelButtonsItems: LevelSelectionButtonGroupItem[] = [];
    for ( let level = 0; level < NUMBER_OF_LEVELS; level++ ) {


      levelButtonsItems.push( {
        icon: new Text( `Level ${level + 1}`, { font: FONT } ),
        scoreProperty: scoreProperty,

        buttonListener: () => {
          levelNumberProperty.value = level + 1;
          gameStateProperty.value = 'challenge';
        },

        // Example of customizing a custom brief accessible name for the button.
        options: {
          accessibleHelpText: 'Identify number of reactants needed to create the products and leftovers.',

          scoreDisplayProportion: 0.5,
          createScoreDisplay: () => {
            return new ScoreDisplayStars( scoreProperty, {
              perfectScore: scoreProperty.range.max,
              numberOfStars: 5
            } );
          }
        }
      } );
    }
    const levelSelectionButtonGroup = new LevelSelectionButtonGroup( levelButtonsItems );

    super( new StringProperty( 'Levels' ), levelSelectionButtonGroup );
    this.layoutBounds = layoutBounds;

    const gameInfoButton = new GameInfoButton();
    const timerButton = new GameTimerToggleButton( timerEnabledProperty );

    const resetButton = new ResetAllButton( {
      listener: () => {
        scoreProperty.value = 0;
        levelNumberProperty.value = 1;
        gameStateProperty.value = 'levelSelection';
      }
    } );

    //------------------- Add to scene graph -------------------
    this.children = [
      levelSelectionButtonGroup,
      gameInfoButton,
      timerButton,
      resetButton
    ];

    // This is what clients might do in their LevelsScreenView.
    this.accessibleLevelsSectionNode.pdomOrder = [
      levelSelectionButtonGroup
    ];

    this.accessibleOptionsSectionNode.pdomOrder = [
      gameInfoButton,
      timerButton,
      resetButton
    ];

    //------------------- Layout -------------------
    levelSelectionButtonGroup.center = layoutBounds.center;
    resetButton.rightBottom = layoutBounds.rightBottom.minusXY( 20, 20 );
    gameInfoButton.rightCenter = resetButton.leftCenter.minusXY( 20, 0 );
    timerButton.rightCenter = gameInfoButton.leftCenter.minusXY( 20, 0 );
  }
}

vegas.register( 'LevelsScreenView', LevelsScreenView );