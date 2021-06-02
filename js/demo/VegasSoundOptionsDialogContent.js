// Copyright 2020, University of Colorado Boulder

import NumberProperty from '../../../axon/js/NumberProperty.js';
import Property from '../../../axon/js/Property.js';
import Range from '../../../dot/js/Range.js';
import NumberPicker from '../../../scenery-phet/js/NumberPicker.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import HBox from '../../../scenery/js/nodes/HBox.js';
import Text from '../../../scenery/js/nodes/Text.js';
import VBox from '../../../scenery/js/nodes/VBox.js';
import vegas from '../vegas.js';

// constants
const TEXT_OPTIONS = { font: new PhetFont( 24 ) };

/**
 * VegasSoundOptionsDialogContent is used to set values for global variables which in turn are used to control sound
 * generation in some common UI components.
 *
 * TODO: This is here temporarily while we work on sound design for a couple of items, see https://github.com/phetsims/scenery-phet/issues/677
 * and https://github.com/phetsims/vegas/issues/89.
 */
class VegasSoundOptionsDialogContent extends VBox {

  constructor() {

    // global property that specifies which sound to use for the back button
    phet.vegas.soundIndexForBackButtonProperty = new NumberProperty( 0 );
    
    // label and number picker for back button sounds
    const backButtonSoundSelector = new HBox( {
      children: [
        new Text( 'Back button sound: ', TEXT_OPTIONS ),
        new NumberPicker( phet.vegas.soundIndexForBackButtonProperty, new Property( new Range( 0, 2 ) ) )
      ],
      spacing: 5
    } );

    // global property that specifies which base sound to use for the level selection buttons
    phet.vegas.soundIndexForLevelSelectionButtonsProperty = new NumberProperty( 0 );

    // label and number picker for back button sounds
    const levelSelectionButtonsSoundSelector = new HBox( {
      children: [
        new Text( 'Level selection buttons base sound: ', TEXT_OPTIONS ),
        new NumberPicker( phet.vegas.soundIndexForLevelSelectionButtonsProperty, new Property( new Range( 0, 3 ) ) )
      ],
      spacing: 5
    } );

    super( {
      children: [ backButtonSoundSelector, levelSelectionButtonsSoundSelector ],
      spacing: 20
    } );
  }
}

vegas.register( 'VegasSoundOptionsDialogContent', VegasSoundOptionsDialogContent );
export default VegasSoundOptionsDialogContent;