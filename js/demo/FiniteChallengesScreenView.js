// Copyright 2018-2020, University of Colorado Boulder

/**
 * Demonstrates vegas UI components.
 *
 * @author Sam Reid
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../axon/js/BooleanProperty.js';
import Property from '../../../axon/js/Property.js';
import Range from '../../../dot/js/Range.js';
import Utils from '../../../dot/js/Utils.js';
import ScreenView from '../../../joist/js/ScreenView.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import HBox from '../../../scenery/js/nodes/HBox.js';
import Text from '../../../scenery/js/nodes/Text.js';
import VBox from '../../../scenery/js/nodes/VBox.js';
import RectangularPushButton from '../../../sun/js/buttons/RectangularPushButton.js';
import Checkbox from '../../../sun/js/Checkbox.js';
import HSlider from '../../../sun/js/HSlider.js';
import FiniteStatusBar from '../FiniteStatusBar.js';
import LevelCompletedNode from '../LevelCompletedNode.js';
import vegas from '../vegas.js';

// constants
const PERFECT_SCORE = 10;
const NUMBER_OF_CHALLENGES = 10;
const DEFAULT_FONT = new PhetFont( 20 );

class FiniteChallengesScreenView extends ScreenView {

  constructor() {

    super();

    const levelProperty = new Property( 1 ); // 1-based
    const challengeIndexProperty = new Property( 0 );
    const numberOfChallengesProperty = new Property( NUMBER_OF_CHALLENGES );
    const scoreProperty = new Property( 0 );
    const elapsedTimeProperty = new Property( 0 );
    const timerEnabledProperty = new BooleanProperty( true );

    // status bar across the top
    const statusBar = new FiniteStatusBar( this.layoutBounds, this.visibleBoundsProperty, scoreProperty, {
      font: new PhetFont( 20 ),
      levelProperty: levelProperty,
      challengeIndexProperty: challengeIndexProperty,
      numberOfChallengesProperty: numberOfChallengesProperty,
      elapsedTimeProperty: elapsedTimeProperty,
      timerEnabledProperty: timerEnabledProperty,
      startOverButtonOptions: {
        listener: () => { console.log( 'Start Over' ); }
      }
    } );
    this.addChild( statusBar );

    // Controls for changing Properties
    const levelSlider = new HBox( {
      children: [
        new Text( 'Level: ', { font: DEFAULT_FONT } ),
        new HSlider( levelProperty, new Range( 1, 5 ), {
          constrainValue: value => Utils.roundSymmetric( value )
        } )
      ]
    } );

    const challengeIndexSlider = new HBox( {
      children: [
        new Text( 'Challenge: ', { font: DEFAULT_FONT } ),
        new HSlider( challengeIndexProperty, new Range( 0, NUMBER_OF_CHALLENGES - 1 ), {
          constrainValue: value => Utils.roundSymmetric( value )
        } )
      ]
    } );

    const numberOfChallengesSlider = new HBox( {
      children: [
        new Text( 'Number of challenges: ', { font: DEFAULT_FONT } ),
        new HSlider( numberOfChallengesProperty, new Range( 1, NUMBER_OF_CHALLENGES ), {
          constrainValue: value => Utils.roundSymmetric( value )
        } )
      ]
    } );

    const scoreSlider = new HBox( {
      left: this.layoutBounds.left + 20,
      top: statusBar.bottom + 30,
      children: [
        new Text( 'Score: ', { font: DEFAULT_FONT } ),
        new HSlider( scoreProperty, new Range( 0, PERFECT_SCORE ) )
      ]
    } );

    const elapsedTimeSlider = new HBox( {
      children: [
        new Text( 'Elapsed time: ', { font: DEFAULT_FONT } ),
        new HSlider( elapsedTimeProperty, new Range( 0, 1000 ), {
          constrainValue: value => Utils.roundSymmetric( value )
        } )
      ]
    } );

    const timerEnabledCheckbox = new Checkbox(
      new Text( 'Timer enabled', { font: DEFAULT_FONT } ),
      timerEnabledProperty );

    const controls = new VBox( {
      align: 'left',
      spacing: 15,
      left: this.layoutBounds.left + 20,
      top: statusBar.bottom + 30,
      children: [ levelSlider, challengeIndexSlider, numberOfChallengesSlider, scoreSlider, elapsedTimeSlider, timerEnabledCheckbox ]
    } );
    this.addChild( controls );

    // button to open LevelCompleteNode
    const levelCompletedButton = new RectangularPushButton( {
      content: new Text( 'show LevelCompletedNode', { font: new PhetFont( 20 ) } ),
      centerX: this.layoutBounds.centerX,
      bottom: this.layoutBounds.bottom - 20,
      listener: () => {
        const levelCompletedNode = new LevelCompletedNode(
          levelProperty.get(), // level
          scoreProperty.value, // score
          PERFECT_SCORE, // maxScore
          4, // numberOfStars
          true, // timerEnabled
          77, // elapsedTime
          74, // bestTimeAtThisLevel
          true, // isNewBestTime
          () => { levelCompletedNode.detach(); }, // Continue button callback
          { center: this.layoutBounds.center }
        );
        this.addChild( levelCompletedNode );
      }
    } );
    this.addChild( levelCompletedButton );
  }
}

vegas.register( 'FiniteChallengesScreenView', FiniteChallengesScreenView );
export default FiniteChallengesScreenView;