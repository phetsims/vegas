// Copyright 2022, University of Colorado Boulder

/**
 * Demo for LevelSelectionButtonGroup
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import Range from '../../../../dot/js/Range.js';
import { GridBox, HBox, Text, VBox } from '../../../../scenery/js/imports.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import HSlider from '../../../../sun/js/HSlider.js';
import NumberProperty, { RangedProperty } from '../../../../axon/js/NumberProperty.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import LevelSelectionButtonGroup, { LevelSelectionButtonGroupItem } from '../../LevelSelectionButtonGroup.js';
import ScoreDisplayStars from '../../ScoreDisplayStars.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import IProperty from '../../../../axon/js/IProperty.js';
import Property from '../../../../axon/js/Property.js';
import LevelSelectionButton from '../../LevelSelectionButton.js';

export default function demoLevelSelectionButtonGroup( layoutBounds: Bounds2 ) {

  const scoreProperty = new NumberProperty( 0, {
    range: new Range( 0, 1000 )
  } ).asRanged();

  const bestTimeProperty = new NumberProperty( 0, {
    range: new Range( 0, 10000 )
  } ).asRanged();

  const bestTimeVisibleProperty = new BooleanProperty( true );

  const singleLineButtonGroup = new SingleLineButtonGroup( scoreProperty, bestTimeProperty, bestTimeVisibleProperty );

  const multiLineButtonGroup = new MultiLineButtonGroup( scoreProperty, bestTimeProperty, bestTimeVisibleProperty );

  const xButtonGroup = new XButtonGroup( scoreProperty, bestTimeProperty, bestTimeVisibleProperty );

  const controlPanel = new ControlPanel( scoreProperty, bestTimeProperty, bestTimeVisibleProperty );

  return new HBox( {
    children: [
      new VBox( {
        spacing: 50,
        children: [ singleLineButtonGroup, multiLineButtonGroup ]
      } ),
      new VBox( {
        spacing: 50,
        children: [ xButtonGroup, controlPanel ]
      } )
    ],
    spacing: 100,
    center: layoutBounds.center
  } );
}

/**
 * Demonstrates the default layout of LevelSelectionButtonGroup, a single line of buttons
 */
class SingleLineButtonGroup extends LevelSelectionButtonGroup {

  public constructor( scoreProperty: RangedProperty, bestTimeProperty: IProperty<number>, bestTimeVisibleProperty: IProperty<boolean> ) {

    const numberOfLevels = 3;

    // Describe the buttons. For demonstration purposes, all buttons are associated with the same scoreProperty and
    // bestTimeProperty. In a real game, each level would have its own scoreProperty and bestTimeProperty.
    const items: LevelSelectionButtonGroupItem[] = [];
    for ( let level = 1; level <= numberOfLevels; level++ ) {
      items.push( {

        // The button icon is simply its level number.
        icon: new Text( level, { font: new PhetFont( 15 ) } ),
        scoreProperty: scoreProperty,
        options: {
          createScoreDisplay: () => new ScoreDisplayStars( scoreProperty, {
            perfectScore: scoreProperty.range.max
          } ),
          bestTimeProperty: bestTimeProperty,
          bestTimeVisibleProperty: bestTimeVisibleProperty
        }
      } );
    }

    super( items, {
      levelSelectionButtonOptions: {
        baseColor: 'pink',
        buttonWidth: 100,
        buttonHeight: 100,
        bestTimeFont: new PhetFont( 18 )
      },
      flowBoxOptions: {
        spacing: 30
      },
      tandem: Tandem.OPT_OUT
    } );
  }
}

/**
 * Demonstrates how to customize LevelSelectionButtonGroup to provide multiple rows of buttons
 */
class MultiLineButtonGroup extends LevelSelectionButtonGroup {

  public constructor( scoreProperty: RangedProperty, bestTimeProperty: RangedProperty, bestTimeVisibleProperty: IProperty<boolean> ) {

    const numberOfLevels = 5;

    // Describe the buttons. For demonstration purposes, all buttons are associated with the same scoreProperty and
    // bestTimeProperty. In a real game, each level would have its own scoreProperty and bestTimeProperty.
    const items: LevelSelectionButtonGroupItem[] = [];
    for ( let level = 1; level <= numberOfLevels; level++ ) {
      items.push( {

        // The button icon is simply its level number.
        icon: new Text( level, { font: new PhetFont( 15 ) } ),
        scoreProperty: scoreProperty,
        options: {
          createScoreDisplay: () => new ScoreDisplayStars( scoreProperty, {
            perfectScore: scoreProperty.range.max
          } ),
          bestTimeProperty: bestTimeProperty,
          bestTimeVisibleProperty: bestTimeVisibleProperty
        }
      } );
    }

    // constants related to the buttons and their layout
    const buttonsPerRow = 3;
    const buttonWidth = 100;
    const buttonHeight = 100;
    const buttonLineWidth = 3;
    const xSpacing = 20;
    const ySpacing = 20;

    // preferredWidth is used to limit the width of the FlowBox, so that it displays a maximum number of buttons
    // per row. When combined with wrap:true, this causes buttons to wrap to a new line.
    // It would also be acceptable to set this value empirically.
    const preferredWidth = ( buttonsPerRow * buttonWidth ) +  // width of the buttons
                           ( ( buttonsPerRow - 1 ) * xSpacing ) + // space between the buttons
                           ( 2 * buttonsPerRow * buttonLineWidth ); // lineWidth of the buttons

    super( items, {
      levelSelectionButtonOptions: {
        baseColor: 'lightGreen',
        buttonWidth: buttonWidth,
        buttonHeight: buttonHeight,
        lineWidth: buttonLineWidth,
        bestTimeFont: new PhetFont( 18 )
      },
      flowBoxOptions: {
        spacing: xSpacing, // horizontal spacing
        lineSpacing: ySpacing, // vertical spacing
        preferredWidth: preferredWidth,
        wrap: true, // start a new row when preferredWidth is reached
        justify: 'center' // horizontal justification
      },
      tandem: Tandem.OPT_OUT
    } );
  }
}

/**
 * Demonstrates how to create a custom layout (in this case, an 'X' pattern), using the createLayoutNode option.
 */
class XButtonGroup extends LevelSelectionButtonGroup {

  public constructor( scoreProperty: RangedProperty, bestTimeProperty: RangedProperty, bestTimeVisibleProperty: IProperty<boolean> ) {

    const numberOfLevels = 5;

    // Describe the buttons. For demonstration purposes, all buttons are associated with the same scoreProperty and
    // bestTimeProperty. In a real game, each level would have its own scoreProperty and bestTimeProperty.
    const items: LevelSelectionButtonGroupItem[] = [];
    for ( let level = 1; level <= numberOfLevels; level++ ) {
      items.push( {

        // The button icon is simply its level number.
        icon: new Text( level, { font: new PhetFont( 15 ) } ),
        scoreProperty: scoreProperty,
        options: {
          createScoreDisplay: () => new ScoreDisplayStars( scoreProperty, {
            perfectScore: scoreProperty.range.max
          } )
        }
      } );
    }

    super( items, {
      levelSelectionButtonOptions: {
        baseColor: 'orange',
        buttonWidth: 75,
        buttonHeight: 75
      },
      createLayoutNode: ( buttons: LevelSelectionButton[] ) => {
        assert && assert( buttons.length === 5, 'rows option value is hardcoded for 5 levels' );
        return new GridBox( {
          xSpacing: 5,
          ySpacing: 5,

          // Layout in an X pattern, by using empty (null) cells.
          // We'd never do anything this brute-force in production code, but this is a demo.
          rows: [
            [ buttons[ 0 ], null, buttons[ 1 ] ],
            [ null, buttons[ 2 ], null ],
            [ buttons[ 3 ], null, buttons[ 4 ] ]
          ]
        } );
      },
      tandem: Tandem.OPT_OUT
    } );
  }
}

/**
 * The controls for this demo
 */
class ControlPanel extends VBox {
  public constructor( scoreProperty: RangedProperty, bestTimeProperty: RangedProperty, bestTimeVisibleProperty: Property<boolean> ) {

    const textOptions = { font: new PhetFont( 20 ) };
    const textSpacing = 10;

    const scoreSlider = new HBox( {
      spacing: textSpacing,
      children: [
        new Text( 'Score: ', textOptions ),
        new HSlider( scoreProperty, scoreProperty.range )
      ]
    } );

    const bestTimeSlider = new HBox( {
      spacing: textSpacing,
      children: [
        new Text( 'Best Time: ', textOptions ),
        new HSlider( bestTimeProperty, bestTimeProperty.range )
      ]
    } );

    const bestTimeVisibleCheckbox = new Checkbox( bestTimeVisibleProperty,
      new Text( 'Best time visible', textOptions ), {
        spacing: textSpacing
      } );

    super( {
      spacing: 15,
      align: 'right',
      children: [ scoreSlider, bestTimeSlider, bestTimeVisibleCheckbox ]
    } );
  }
}