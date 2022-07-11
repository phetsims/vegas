// Copyright 2018-2022, University of Colorado Boulder

/**
 * Demonstrates vegas UI components.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../axon/js/NumberProperty.js';
import Range from '../../../dot/js/Range.js';
import Utils from '../../../dot/js/Utils.js';
import ScreenView from '../../../joist/js/ScreenView.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import { HBox, Text, VBox } from '../../../scenery/js/imports.js';
import RectangularPushButton from '../../../sun/js/buttons/RectangularPushButton.js';
import Checkbox from '../../../sun/js/Checkbox.js';
import HSlider from '../../../sun/js/HSlider.js';
import Tandem from '../../../tandem/js/Tandem.js';
import FiniteStatusBar from '../FiniteStatusBar.js';
import LevelCompletedNode from '../LevelCompletedNode.js';
import vegas from '../vegas.js';

// constants
const PERFECT_SCORE = 10;
const NUMBER_OF_CHALLENGES = 10;
const DEFAULT_FONT = new PhetFont( 20 );

export default class FiniteChallengesScreenView extends ScreenView {

  public constructor() {

    super( {
      tandem: Tandem.OPT_OUT
    } );

    // 1-based
    const levelProperty = new NumberProperty( 1, {
      numberType: 'Integer',
      range: new Range( 1, 5 )
    } );
    const challengeIndexProperty = new NumberProperty( 0, {
      numberType: 'Integer',
      range: new Range( 0, NUMBER_OF_CHALLENGES - 1 )
    } );
    const numberOfChallengesProperty = new NumberProperty( NUMBER_OF_CHALLENGES, {
      numberType: 'Integer',
      range: new Range( 1, NUMBER_OF_CHALLENGES )
    } );
    const scoreProperty = new NumberProperty( 0, {
      numberType: 'Integer',
      range: new Range( 0, PERFECT_SCORE )
    } );
    const elapsedTimeProperty = new NumberProperty( 0, {
      range: new Range( 0, 1000 )
    } );
    const timerEnabledProperty = new BooleanProperty( true );

    // status bar across the top
    const statusBar = new FiniteStatusBar( this.layoutBounds, this.visibleBoundsProperty, scoreProperty, {
      barFill: 'pink',
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
        new HSlider( levelProperty, levelProperty.range!, {
          constrainValue: value => Utils.roundSymmetric( value )
        } )
      ]
    } );

    const challengeIndexSlider = new HBox( {
      children: [
        new Text( 'Challenge: ', { font: DEFAULT_FONT } ),
        new HSlider( challengeIndexProperty, challengeIndexProperty.range!, {
          constrainValue: value => Utils.roundSymmetric( value )
        } )
      ]
    } );

    const numberOfChallengesSlider = new HBox( {
      children: [
        new Text( 'Number of challenges: ', { font: DEFAULT_FONT } ),
        new HSlider( numberOfChallengesProperty, numberOfChallengesProperty.range!, {
          constrainValue: value => Utils.roundSymmetric( value )
        } )
      ]
    } );

    const scoreSlider = new HBox( {
      left: this.layoutBounds.left + 20,
      top: statusBar.bottom + 30,
      children: [
        new Text( 'Score: ', { font: DEFAULT_FONT } ),
        new HSlider( scoreProperty, scoreProperty.range!, {
          constrainValue: value => Utils.roundSymmetric( value )
        } )
      ]
    } );

    const elapsedTimeSlider = new HBox( {
      children: [
        new Text( 'Elapsed time: ', { font: DEFAULT_FONT } ),
        new HSlider( elapsedTimeProperty, elapsedTimeProperty.range!, {
          constrainValue: value => Utils.roundSymmetric( value )
        } )
      ]
    } );

    const timerEnabledCheckbox = new Checkbox( timerEnabledProperty, new Text( 'Timer enabled', { font: DEFAULT_FONT } ) );

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