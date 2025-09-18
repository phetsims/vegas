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

import DerivedProperty from '../../../axon/js/DerivedProperty.js';
import NumberProperty from '../../../axon/js/NumberProperty.js';
import Property from '../../../axon/js/Property.js';
import { TReadOnlyProperty } from '../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../dot/js/Bounds2.js';
import Range from '../../../dot/js/Range.js';
import ScreenView from '../../../joist/js/ScreenView.js';
import ResetAllButton from '../../../scenery-phet/js/buttons/ResetAllButton.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import FocusStack from '../../../scenery/js/accessibility/FocusStack.js';
import FocusableHeadingNode from '../../../scenery/js/accessibility/pdom/FocusableHeadingNode.js';
import VBox from '../../../scenery/js/layout/nodes/VBox.js';
import Node from '../../../scenery/js/nodes/Node.js';
import Text from '../../../scenery/js/nodes/Text.js';
import TextPushButton from '../../../sun/js/buttons/TextPushButton.js';
import Tandem from '../../../tandem/js/Tandem.js';
import FiniteStatusBar from '../FiniteStatusBar.js';
import GameTimer from '../GameTimer.js';
import LevelSelectionButtonGroup, { LevelSelectionButtonGroupItem } from '../LevelSelectionButtonGroup.js';
import ScoreDisplayStars from '../ScoreDisplayStars.js';
import vegas from '../vegas.js';

// Testing a global structure for managing focus between screens.
const focusStack = new FocusStack();

const NUMBER_OF_LEVELS = 5;
const FONT = new PhetFont( 25 );

export default class LevelsScreenView extends ScreenView {
  public constructor() {
    super( {
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

    // Even levels will put focus on the accessible heading when the level is shown, odd levels will put focus on
    // a game button.
    const focusHeadingWhenVisible = ( levelNumber: number ) => {
      return levelNumber % 2 === 0;
    };

    //-------------------- Create level screens -------------------
    const levelNodes: GameScreenNode[] = [];
    for ( let level = 0; level < NUMBER_OF_LEVELS; level++ ) {
      const levelNode = new MyGameScreenNode(
        level,
        this.layoutBounds,
        this.visibleBoundsProperty,
        scoreProperty,
        gameOverProperty,
        gameTimer,
        selectedLevelIndexProperty,
        focusHeadingWhenVisible( level )
      );

      levelNodes.push( levelNode );
    }

    //------------------- Add to scene graph -------------------
    const levelSelectionNode = new LevelSelectionScreenNode(
      scoreProperty,
      selectedLevelIndexProperty,
      this.layoutBounds,
      focusHeadingWhenVisible
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
    selectedLevelIndexProperty: Property<number | null>,
    focusHeadingWhenVisible: boolean
  ) {
    super();

    const statusBar = new FiniteStatusBar( layoutBounds, visibleBoundsProperty, scoreProperty, {
      elapsedTimeProperty: gameTimer.elapsedTimeProperty,
      timerEnabledProperty: new Property( true ),
      startOverButtonOptions: {
        listener: () => {
          selectedLevelIndexProperty.value = null;
        }
      }
    } );

    const accessibleHeadingString = `This is level ${level + 1} 😎`;
    const accessibleHeadingNode = new FocusableHeadingNode( {
      accessibleName: accessibleHeadingString
    } );

    const levelText = new Text( accessibleHeadingString, {
      font: FONT
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

    const winnerNode = new Text( '😲 😀 ☺️ 😀 😲', {
      font: new PhetFont( 50 ),
      visibleProperty: gameOverProperty,
      accessibleParagraph: 'You are a winner! Congratulations!'
    } );

    // layout - status bar manages layout at the top
    levelText.center = layoutBounds.center;
    addPointButton.centerTop = levelText.centerBottom.plusXY( 0, 20 );
    winnerNode.centerTop = addPointButton.centerBottom.plusXY( 0, 20 );

    this.addChild( accessibleHeadingNode );
    this.addChild( levelText );
    this.addChild( winnerNode );
    this.addChild( addPointButton );
    this.addChild( statusBar );

    this.pdomOrder = [
      accessibleHeadingNode,
      addPointButton,
      winnerNode,
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

  public constructor(
    scoreProperty: NumberProperty,
    selectedLevelIndexProperty: Property<number | null>,
    layoutBounds: Bounds2,
    focusHeadingWhenVisible: ( levelNumber: number ) => boolean
  ) {
    super();
    this.layoutBounds = layoutBounds;

    //-------------------- Level selection buttons -------------------
    const levelButtonsItems: LevelSelectionButtonGroupItem[] = [];
    for ( let level = 0; level < NUMBER_OF_LEVELS; level++ ) {

      levelButtonsItems.push( {
        icon: new Text( `Level ${level + 1}`, { font: FONT } ),
        scoreProperty: scoreProperty,
        options: {
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

    const resetButton = new ResetAllButton( {
      listener: () => {
        scoreProperty.value = 0;
        selectedLevelIndexProperty.value = null;
      }
    } );

    //------------------- Add to scene graph -------------------
    this.children = [
      levelSelectionButtonGroup,
      resetButton
    ];

    this.pdomOrder = [
      levelSelectionButtonGroup,
      null,
      resetButton
    ];

    //------------------- Layout -------------------
    levelSelectionButtonGroup.center = layoutBounds.center;
    resetButton.rightBottom = layoutBounds.rightBottom.minusXY( 20, 20 );
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

vegas.register( 'LevelsScreenView', LevelsScreenView );