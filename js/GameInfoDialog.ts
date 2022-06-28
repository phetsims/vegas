// Copyright 2022, University of Colorado Boulder

/**
 * GameInfoDialog shows descriptions for the levels of a game.  Each description is on a separate line.
 * If the simulation supports the gameLevels query parameter (see getGameLevelsSchema.ts) the caller
 * can optionally provide options.gameLevels to control which descriptions are visible.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { RichText, RichTextOptions, VBox, VBoxOptions } from '../../scenery/js/imports.js';
import vegas from './vegas.js';
import optionize from '../../phet-core/js/optionize.js';
import StrictOmit from '../../phet-core/js/types/StrictOmit.js';
import Dialog, { DialogOptions } from '../../sun/js/Dialog.js';
import EmptyObjectType from '../../phet-core/js/types/EmptyObjectType.js';
import Tandem from '../../tandem/js/Tandem.js';

type SelfOptions = {

  // Game levels whose descriptions should be visible in the dialog. Levels are numbered starting from 1.
  // This is typically set to the value of the gameLevels query parameter. See getGameLevelsSchema.ts.
  gameLevels?: number[];

  // Options for the description text nodes
  descriptionTextOptions?: StrictOmit<RichTextOptions, 'tandem'>;

  // Options for the layout (VBox)
  vBoxOptions?: StrictOmit<VBoxOptions, 'children'>;
};

export type GameInfoDialogOptions = SelfOptions & DialogOptions;

export default class GameInfoDialog extends Dialog {

  /**
   * @param levelDescriptions - level descriptions, in order of ascending level number
   * @param providedOptions
   */
  public constructor( levelDescriptions: string[], providedOptions?: GameInfoDialogOptions ) {

    const options = optionize<GameInfoDialogOptions, StrictOmit<SelfOptions, 'gameLevels' | 'descriptionTextOptions'>, DialogOptions>()( {
      vBoxOptions: {
        align: 'left',
        spacing: 20
      },
      tandem: Tandem.REQUIRED
    }, providedOptions );

    const descriptionNodes = levelDescriptions.map( ( levelDescription, index ) =>
      new RichText( levelDescription, optionize<RichTextOptions, EmptyObjectType, RichTextOptions>()( {
        tandem: options.tandem.createTandem( `level${index}DescriptionText` )
      }, options.descriptionTextOptions ) )
    );

    // Hide descriptions for levels that are not included in options.gameLevels.
    // We must still create these Nodes so that the PhET-iO API is not changed.
    if ( options.gameLevels ) {
      assert && assert( _.every( options.gameLevels, gameLevel => ( Number.isInteger( gameLevel ) && gameLevel > 0 ) ),
        'gameLevels must be positive integers' );
      descriptionNodes.forEach( ( node, index ) => {
        node.visible = options.gameLevels!.includes( index + 1 );
      } );
    }

    // Vertical layout
    const content = new VBox( optionize<VBoxOptions, EmptyObjectType, VBoxOptions>()( {
      children: descriptionNodes
    }, options.vBoxOptions ) );

    super( content, options );
  }
}

vegas.register( 'GameInfoDialog', GameInfoDialog );