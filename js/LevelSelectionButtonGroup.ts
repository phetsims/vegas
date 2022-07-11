// Copyright 2022, University of Colorado Boulder

//TODO https://github.com/phetsims/vegas/issues/107 Do not use this yet, it's work that is in-progress.
/**
 * LevelSelectionButtonGroup is a group that creates LevelSelectionButtons, used in games.
 *
 * Responsibilities include:
 * - Instantiation of the buttons, based on an 'items' array that describes the buttons.
 * - Setting an effective uniform size for the button icons.
 * - Layout of the buttons. The layout is customizable, with the default being a single row of buttons.
 * - Support for the gameLevels query parameter, via the gameLevels option.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import StrictOmit from '../../phet-core/js/types/StrictOmit.js';
import PickRequired from '../../phet-core/js/types/PickRequired.js';
import optionize, { combineOptions } from '../../phet-core/js/optionize.js';
import { AlignBox, AlignGroup, FlowBox, FlowBoxOptions, LayoutNode, Node, NodeLayoutConstraint, NodeOptions } from '../../scenery/js/imports.js';
import LevelSelectionButton, { LevelSelectionButtonOptions } from './LevelSelectionButton.js';
import IProperty from '../../axon/js/IProperty.js';
import Tandem from '../../tandem/js/Tandem.js';
import vegas from './vegas.js';

// Describes one LevelSelectionButton
export type LevelSelectionButtonGroupItem = {

  // The icon displayed on the button
  icon: Node;

  // The score displayed on the button
  scoreProperty: IProperty<number>;

  // Name used when creating the button's tandem, defaults to `level${N}Button`
  tandemName?: string;

  // Options for the button. These will override LevelSelectionButtonGroupOptions.levelSelectionButtonOptions.
  // Setting tandem is the responsibility of the group, so it is omitted here.
  options?: StrictOmit<LevelSelectionButtonOptions, 'tandem'>;
};

type SelfOptions = {

  // Options for all LevelSelectionButton instances in the group.
  // These can be overridden for specific button(s) via LevelSelectionButtonGroupItem.options.
  levelSelectionButtonOptions: StrictOmit<LevelSelectionButtonOptions, 'tandem'>;

  // Creates the Node that handles layout of the buttons. Defaults to a FlowBox with flowBoxOptions.
  createLayoutNode?: ( buttons: LevelSelectionButton[] ) => LayoutNode<NodeLayoutConstraint>;

  // Options for the default layout, which is a FlowBox. Ignored if createLayoutNode is provided.
  flowBoxOptions?: StrictOmit<FlowBoxOptions, 'children'>;

  // Game levels whose buttons should be visible. Levels are numbered starting from 1.
  // Set this to the value of the gameLevels query parameter, if supported by your sim. See getGameLevelsSchema.ts.
  gameLevels?: number[];
};

export type LevelSelectionButtonGroupOptions = SelfOptions & StrictOmit<NodeOptions, 'children'> & PickRequired<NodeOptions, 'tandem'>;

export default class LevelSelectionButtonGroup extends Node {

  // Buttons, ordered by increasing level number.
  // Note that level numbering starts from 1, to match the gameLevels query parameter.
  private readonly buttons: LevelSelectionButton[];

  /**
   * @param items - descriptions of the LevelSelectionButtons, ordered by increasing level number
   * @param [providedOptions]
   */
  public constructor( items: LevelSelectionButtonGroupItem[], providedOptions?: LevelSelectionButtonGroupOptions ) {
    assert && assert( items.length > 0, 'at least one item must be specified' );

    const options = optionize<LevelSelectionButtonGroupOptions,
      StrictOmit<SelfOptions, 'createLayoutNode' | 'gameLevels'>, NodeOptions>()( {

      // The default layout is a single row of buttons.
      flowBoxOptions: {
        orientation: 'horizontal',
        spacing: 10
      },
      tandem: Tandem.REQUIRED // this default is provided for JavaScript simulations
    }, providedOptions );

    // All icons will have the same effective size.
    const alignBoxOptions = {
      group: new AlignGroup()
    };

    // Create the LevelSelectionButton instances.
    const buttons: LevelSelectionButton[] = items.map( ( item, index ) => {

      let tandem = Tandem.OPT_OUT;
      if ( options.tandem.supplied ) {
        const tandemName = item.tandemName || `level${index + 1}Button`;
        tandem = options.tandem.createTandem( tandemName );
      }

      return new LevelSelectionButton( new AlignBox( item.icon, alignBoxOptions ), item.scoreProperty,
        combineOptions<LevelSelectionButtonOptions>( {
          tandem: tandem
        }, options.levelSelectionButtonOptions, item.options ) );
    } );

    // Hide buttons for levels that are not included in gameLevels.
    // All buttons must be instantiated so that the PhET-iO API is not changed conditionally.
    if ( options.gameLevels ) {
      assert && assert( options.gameLevels.length > 0, 'at least 1 gameLevel must be visible' );
      assert && assert( _.every( options.gameLevels, gameLevel => ( Number.isInteger( gameLevel ) && gameLevel > 0 ) ),
        'gameLevels must be positive integers' );
      buttons.forEach( ( button, index ) => {
        button.visible = options.gameLevels!.includes( index + 1 );
      } );
    }


    let layoutNode;
    if ( options.createLayoutNode ) {
      layoutNode = options.createLayoutNode( buttons );
    }
    else {

      // The default layout Node is a FlowBox.
      layoutNode = new FlowBox( combineOptions<FlowBoxOptions>( {
        children: buttons
      }, options.flowBoxOptions ) );
    }

    options.children = [ layoutNode ];

    super( options );

    this.buttons = buttons;
  }

  /**
   * Sets the focus to the button associated with a specified level number.
   * @param level - numbered starting from 1
   */
  public focusLevelSelectionButton( level: number ): void {
    assert && assert( Number.isInteger( level ) && level > 0 && level <= this.buttons.length,
      `invalid level: ${level}` );
    this.buttons[ level - 1 ].focus();
  }
}

vegas.register( 'LevelSelectionButtonGroup', LevelSelectionButtonGroup );