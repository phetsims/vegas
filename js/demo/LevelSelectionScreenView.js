// Copyright 2014-2020, University of Colorado Boulder

/**
 * Demonstrates UI components related to the typical level-selection UI in games.
 *
 * @author Sam Reid
 * @author Andrea Lin
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../axon/js/BooleanProperty.js';
import Property from '../../../axon/js/Property.js';
import Range from '../../../dot/js/Range.js';
import ScreenView from '../../../joist/js/ScreenView.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import HBox from '../../../scenery/js/nodes/HBox.js';
import Rectangle from '../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../scenery/js/nodes/Text.js';
import VBox from '../../../scenery/js/nodes/VBox.js';
import Checkbox from '../../../sun/js/Checkbox.js';
import HSlider from '../../../sun/js/HSlider.js';
import LevelSelectionButton from '../LevelSelectionButton.js';
import ScoreDisplayLabeledNumber from '../ScoreDisplayLabeledNumber.js';
import ScoreDisplayLabeledStars from '../ScoreDisplayLabeledStars.js';
import ScoreDisplayNumberAndStar from '../ScoreDisplayNumberAndStar.js';
import ScoreDisplayStars from '../ScoreDisplayStars.js';
import vegas from '../vegas.js';

// constants
const NUM_STARS = 5;
const SCORE_RANGE = new Range( 0, 1000 );
const BEST_TIME_RANGE = new Range( 0, 10000 );

class LevelSelectionScreenView extends ScreenView {

  constructor() {

    super();

    const scoreProperty = new Property( 0 );
    const bestTimeProperty = new Property( 0 );
    const bestTimeVisibleProperty = new BooleanProperty( true );

    // Various options for displaying score.
    const scoreDisplays = new VBox( {
      resize: false,
      spacing: 20,
      align: 'left',
      centerX: this.layoutBounds.centerX,
      top: this.layoutBounds.top + 20,
      children: [
        new ScoreDisplayStars( scoreProperty, { numberOfStars: NUM_STARS, perfectScore: SCORE_RANGE.max } ),
        new ScoreDisplayLabeledStars( scoreProperty, { numberOfStars: NUM_STARS, perfectScore: SCORE_RANGE.max } ),
        new ScoreDisplayNumberAndStar( scoreProperty ),
        new ScoreDisplayLabeledNumber( scoreProperty )
      ]
    } );
    this.addChild( scoreDisplays );

    // Level selection buttons
    const buttonIcon = new Rectangle( 0, 0, 100, 100, { fill: 'red', stroke: 'black' } );

    const buttonWithStars = new LevelSelectionButton( buttonIcon, scoreProperty, {
      scoreDisplayConstructor: ScoreDisplayStars,
      scoreDisplayOptions: {
        numberOfStars: NUM_STARS,
        perfectScore: SCORE_RANGE.max
      },
      listener: () => console.log( 'level start' )
    } );

    const buttonWithTextAndStars = new LevelSelectionButton( buttonIcon, scoreProperty, {
      scoreDisplayConstructor: ScoreDisplayLabeledStars,
      scoreDisplayOptions: {
        numberOfStars: NUM_STARS,
        perfectScore: SCORE_RANGE.max
      },
      listener: () => console.log( 'level start' )
    } );

    const buttonWithNumberAndStar = new LevelSelectionButton( buttonIcon, scoreProperty, {
      scoreDisplayConstructor: ScoreDisplayNumberAndStar,
      listener: () => console.log( 'level start' )
    } );

    const buttonWithTextAndNumber = new LevelSelectionButton( buttonIcon, scoreProperty, {
      scoreDisplayConstructor: ScoreDisplayLabeledNumber,
      listener: () => console.log( 'level start' ),
      bestTimeProperty: bestTimeProperty,
      bestTimeVisibleProperty: bestTimeVisibleProperty
    } );

    const levelSelectionButtons = new HBox( {
      spacing: 20,
      align: 'top',
      centerX: this.layoutBounds.centerX,
      top: scoreDisplays.bottom + 60,
      children: [ buttonWithStars, buttonWithTextAndStars, buttonWithNumberAndStar, buttonWithTextAndNumber ]
    } );
    this.addChild( levelSelectionButtons );

    // Controls for Properties
    const scoreSlider = new HBox( {
      children: [
        new Text( 'Score: ', { font: new PhetFont( 20 ) } ),
        new HSlider( scoreProperty, SCORE_RANGE )
      ]
    } );

    const bestTimeSlider = new HBox( {
      children: [
        new Text( 'Best Time: ', { font: new PhetFont( 20 ) } ),
        new HSlider( bestTimeProperty, BEST_TIME_RANGE )
      ]
    } );

    const bestTimeVisibleCheckbox = new Checkbox(
      new Text( 'Best time visible', { font: new PhetFont( 20 ) } ),
      bestTimeVisibleProperty );

    const controls = new HBox( {
      resize: false,
      spacing: 30,
      centerX: this.layoutBounds.centerX,
      top: levelSelectionButtons.bottom + 60,
      children: [ scoreSlider, bestTimeSlider, bestTimeVisibleCheckbox ]
    } );
    this.addChild( controls );
  }
}

vegas.register( 'LevelSelectionScreenView', LevelSelectionScreenView );
export default LevelSelectionScreenView;