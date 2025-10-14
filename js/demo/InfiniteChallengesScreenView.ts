// Copyright 2014-2025, University of Colorado Boulder

/**
 * Demonstrates UI components that typically appear in a game level that has an infinite number of challenges.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../axon/js/NumberProperty.js';
import Range from '../../../dot/js/Range.js';
import ScreenView from '../../../joist/js/ScreenView.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import StatusBar from '../../../scenery-phet/js/StatusBar.js';
import HBox from '../../../scenery/js/layout/nodes/HBox.js';
import Text from '../../../scenery/js/nodes/Text.js';
import RectangularPushButton from '../../../sun/js/buttons/RectangularPushButton.js';
import HSlider from '../../../sun/js/HSlider.js';
import Tandem from '../../../tandem/js/Tandem.js';
import ChallengeScreenNode from '../ChallengeScreenNode.js';
import InfiniteStatusBar from '../InfiniteStatusBar.js';
import RewardDialog from '../RewardDialog.js';
import vegas from '../vegas.js';

export default class InfiniteChallengesScreenView extends ScreenView {

  public constructor() {

    super( {
      tandem: Tandem.OPT_OUT,
      includeAccessibleSectionNodes: false
    } );

    const challengeScreenNode = new ChallengeScreenNode();

    const scoreProperty = new NumberProperty( 0, {
      range: new Range( 0, 1000 )
    } );

    // bar across the top
    const messageNode = new Text( 'Your message goes here', {
      font: StatusBar.DEFAULT_FONT
    } );
    const statusBar = new InfiniteStatusBar( this.layoutBounds, this.visibleBoundsProperty, messageNode, scoreProperty, {
      backButtonListener: () => console.log( 'back' ),
      tandem: Tandem.OPT_OUT
    } );

    // slider for testing score changes
    const scoreSlider = new HBox( {
      right: this.layoutBounds.right - 20,
      top: statusBar.bottom + 30,
      children: [
        new Text( 'Score: ', { font: new PhetFont( 20 ) } ),
        new HSlider( scoreProperty, scoreProperty.range )
      ]
    } );

    const openButton = new RectangularPushButton( {
      content: new Text( 'open RewardDialog', { font: new PhetFont( 20 ) } ),
      listener: function() {
        const rewardDialog = new RewardDialog( 1, 10, {
          keepGoingButtonListener: () => {
            console.log( 'Keep Going button' );
            rewardDialog.dispose();
          },
          newLevelButtonListener: () => {
            console.log( 'New Level button' );
            rewardDialog.dispose();
          }
        } );
        rewardDialog.show();
      },
      center: this.layoutBounds.center
    } );

    this.children = [
      challengeScreenNode,
      statusBar,
      scoreSlider,
      openButton
    ];

    // pdom order - assign components into sections
    challengeScreenNode.accessibleChallengeSectionNode.pdomOrder = [
      scoreSlider
    ];

    challengeScreenNode.accessibleAnswerSectionNode.pdomOrder = [
      openButton
    ];

    challengeScreenNode.accessibleStatusSectionNode.pdomOrder = [
      statusBar
    ];
  }
}

vegas.register( 'InfiniteChallengesScreenView', InfiniteChallengesScreenView );