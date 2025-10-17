// Copyright 2025, University of Colorado Boulder

/**
 * Demonstration of a ChallengeScreenNode in vegas. Creates game components for a challenge,
 * then assigns them to the appropriate accessible sections.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../../axon/js/DerivedProperty.js';
import { TReadOnlyProperty } from '../../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../../dot/js/Bounds2.js';
import PhetFont from '../../../../../scenery-phet/js/PhetFont.js';
import Text from '../../../../../scenery/js/nodes/Text.js';
import TextPushButton from '../../../../../sun/js/buttons/TextPushButton.js';
import ShowAnswerButton from '../../../buttons/ShowAnswerButton.js';
import ChallengeScreenNode from '../../../ChallengeScreenNode.js';
import FiniteStatusBar from '../../../FiniteStatusBar.js';
import vegas from '../../../vegas.js';
import LevelsModel from '../model/LevelsModel.js';

const FONT = new PhetFont( 25 );

export default class LevelsChallengeScreenNode extends ChallengeScreenNode {
  public constructor(
    levelsModel: LevelsModel,
    layoutBounds: Bounds2,
    visibleBoundsProperty: TReadOnlyProperty<Bounds2>
  ) {

    super( {
      challengeNumberProperty: levelsModel.challengeNumberProperty,
      challengeCountProperty: levelsModel.challengesPerLevelProperty,

      accessibleChallengePrompt: 'This is the challenge prompt. Try to get 5 stars to complete the challenge.',
      accessibleAnswerSummary: 'This is the answer summary after pressing Show Answer.'
    } );

    const statusBar = new FiniteStatusBar( layoutBounds, visibleBoundsProperty, levelsModel.scoreProperty, {
      levelNumberProperty: levelsModel.levelNumberProperty,
      challengeNumberProperty: levelsModel.challengeNumberProperty,
      numberOfChallengesProperty: levelsModel.challengesPerLevelProperty,
      elapsedTimeProperty: levelsModel.gameTimer.elapsedTimeProperty,
      timerEnabledProperty: levelsModel.timerEnabledProperty,
      startOverButtonOptions: {
        listener: () => {
          levelsModel.gameStateProperty.value = 'levelSelection';
        }
      }
    } );

    const scoreProperty = levelsModel.scoreProperty;
    const addPointButton = new TextPushButton( 'You are a ★', {
      listener: () => {
        scoreProperty.value = Math.min( scoreProperty.value + 1, scoreProperty.range.max );
      },
      enabledProperty: DerivedProperty.not( levelsModel.gameOverProperty ),
      fireOnHold: true,
      fireOnHoldInterval: 25,
      font: FONT
    } );

    const showAnswerButton = new ShowAnswerButton( {
      font: FONT,
      listener: () => {
        this.setAnswerSummaryVisible( true );
      }
    } );

    const winnerNode = new Text( '😲 😀 ☺️ 😀 😲', {
      font: new PhetFont( 50 ),
      visibleProperty: levelsModel.gameOverProperty,
      accessibleParagraph: 'You are a winner! Congratulations!'
    } );

    // layout - status bar manages layout at the top
    addPointButton.center = layoutBounds.center;
    winnerNode.centerTop = addPointButton.centerBottom.plusXY( 0, 20 );
    showAnswerButton.centerTop = winnerNode.centerBottom.plusXY( 0, 20 );

    this.children = [
      winnerNode,
      showAnswerButton,
      addPointButton,
      statusBar
    ];

    this.accessibleChallengeSectionNode.pdomOrder = [
      addPointButton
    ];

    this.accessibleAnswerSectionNode.pdomOrder = [
      winnerNode,
      showAnswerButton
    ];

    this.accessibleStatusSectionNode.pdomOrder = [
      statusBar
    ];
  }
}

vegas.register( 'LevelsChallengeScreenNode', LevelsChallengeScreenNode );