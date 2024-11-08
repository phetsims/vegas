// Copyright 2022-2024, University of Colorado Boulder

/**
 * Demo for LevelSelectionButtonGroup
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Range from '../../../../dot/js/Range.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { GridBox, HBox, Node, Text, VBox } from '../../../../scenery/js/imports.js';
import HSlider from '../../../../sun/js/HSlider.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import LevelSelectionButton from '../../LevelSelectionButton.js';
import LevelSelectionButtonGroup, { LevelSelectionButtonGroupItem } from '../../LevelSelectionButtonGroup.js';
import ScoreDisplayStars from '../../ScoreDisplayStars.js';
import vegasQueryParameters, { NUMBER_OF_GAME_LEVELS } from '../../vegasQueryParameters.js';

const BUTTON_WIDTH = 75;
const BUTTON_HEIGHT = 75;

export default function demoLevelSelectionButtonGroup( layoutBounds: Bounds2 ): Node {

  // Properties used by LevelSelectionButtonGroupItem
  const scoreProperty = new NumberProperty( 0, {
    range: new Range( 0, 1000 )
  } );

  // A few examples of LevelSelectionButtonGroup, all wired to scoreProperty
  const singleRowButtonGroup = new SingleRowButtonGroup( scoreProperty );
  const multiRowButtonGroup = new MultiRowButtonGroup( scoreProperty );
  const xButtonGroup = new XButtonGroup( scoreProperty );

  const scoreSlider = new HBox( {
    spacing: 10,
    children: [
      new Text( 'Score: ', { font: new PhetFont( 20 ) } ),
      new HSlider( scoreProperty, scoreProperty.range )
    ]
  } );

  return new HBox( {
    children: [
      new VBox( {
        spacing: 50,
        children: [ singleRowButtonGroup, multiRowButtonGroup ]
      } ),
      new VBox( {
        spacing: 50,
        children: [ xButtonGroup, scoreSlider ]
      } )
    ],
    spacing: 100,
    center: layoutBounds.center
  } );
}

/**
 * Demonstrates the default layout of LevelSelectionButtonGroup, a single row of buttons.
 */
class SingleRowButtonGroup extends LevelSelectionButtonGroup {

  public constructor( scoreProperty: NumberProperty ) {

    // Describe the buttons. For demonstration purposes, all buttons are associated with the same scoreProperty and
    // bestTimeProperty. In a real game, each level would have its own scoreProperty and bestTimeProperty.
    const items: LevelSelectionButtonGroupItem[] = [];
    for ( let level = 1; level <= NUMBER_OF_GAME_LEVELS; level++ ) {
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
        baseColor: 'pink'
      },
      flowBoxOptions: {
        spacing: 30
      },
      groupButtonWidth: BUTTON_WIDTH,
      groupButtonHeight: BUTTON_HEIGHT,
      gameLevels: vegasQueryParameters.gameLevels,
      tandem: Tandem.OPT_OUT
    } );
  }
}

/**
 * Demonstrates how to customize LevelSelectionButtonGroup to provide multiple rows of buttons.
 * Note the use of options preferredWidth, wrap, and justify.
 */
class MultiRowButtonGroup extends LevelSelectionButtonGroup {

  public constructor( scoreProperty: NumberProperty ) {

    // Describe the buttons. For demonstration purposes, all buttons are associated with the same scoreProperty and
    // bestTimeProperty. In a real game, each level would have its own scoreProperty and bestTimeProperty.
    const items: LevelSelectionButtonGroupItem[] = [];
    for ( let level = 1; level <= NUMBER_OF_GAME_LEVELS; level++ ) {
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

    // constants related to the buttons and their layout
    const buttonsPerRow = 3;
    const buttonLineWidth = 3;
    const xSpacing = 20;
    const ySpacing = 20;

    // preferredWidth is used to limit the width of the FlowBox, so that it displays a maximum number of buttons
    // per row. When combined with wrap:true, this causes buttons to wrap to a new line.
    // It would also be acceptable to set this value empirically.
    const preferredWidth = ( buttonsPerRow * BUTTON_WIDTH ) +  // width of the buttons
                           ( ( buttonsPerRow - 1 ) * xSpacing ) + // space between the buttons
                           ( 2 * buttonsPerRow * buttonLineWidth ); // lineWidth of the buttons

    super( items, {
      levelSelectionButtonOptions: {
        baseColor: 'lightGreen',
        lineWidth: buttonLineWidth
      },
      flowBoxOptions: {
        spacing: xSpacing, // horizontal spacing
        lineSpacing: ySpacing, // vertical spacing
        preferredWidth: preferredWidth,
        wrap: true, // start a new row when preferredWidth is reached
        justify: 'center' // horizontal justification
      },
      groupButtonWidth: BUTTON_WIDTH,
      groupButtonHeight: BUTTON_HEIGHT,
      gameLevels: vegasQueryParameters.gameLevels,
      tandem: Tandem.OPT_OUT
    } );
  }
}

/**
 * Demonstrates how to create a custom layout, in this case, an 'X' pattern.
 * Note the use of option createLayoutNode.
 */
class XButtonGroup extends LevelSelectionButtonGroup {

  public constructor( scoreProperty: NumberProperty ) {

    // Describe the buttons. For demonstration purposes, all buttons are associated with the same scoreProperty and
    // bestTimeProperty. In a real game, each level would have its own scoreProperty and bestTimeProperty.
    const items: LevelSelectionButtonGroupItem[] = [];
    for ( let level = 1; level <= NUMBER_OF_GAME_LEVELS; level++ ) {
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
        baseColor: 'orange'
      },
      groupButtonWidth: BUTTON_WIDTH,
      groupButtonHeight: BUTTON_HEIGHT,

      // Create a custom layout, not possible via the default FlowBox and flowBoxOptions.
      createLayoutNode: ( buttons: LevelSelectionButton[] ) => {
        assert && assert( buttons.length === 5, 'rows option value is hardcoded for 5 levels' );
        return new GridBox( {
          xSpacing: 5,
          ySpacing: 5,

          // Layout in an X pattern, by making every-other cell empty (null).
          // We'd never do anything this brute-force in production code, but this is a demo.
          rows: [
            [ buttons[ 0 ], null, buttons[ 1 ] ],
            [ null, buttons[ 2 ], null ],
            [ buttons[ 3 ], null, buttons[ 4 ] ]
          ]
        } );
      },
      gameLevels: vegasQueryParameters.gameLevels,
      tandem: Tandem.OPT_OUT
    } );
  }
}