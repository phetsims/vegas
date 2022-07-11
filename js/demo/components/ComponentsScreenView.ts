// Copyright 2015-2022, University of Colorado Boulder

/**
 * ComponentsScreenView demonstrates various vegas UI components.
 * Demos are selected from a combo box, and are instantiated on demand.
 * Use the 'component' query parameter to set the initial selection of the combo box.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import vegasQueryParameters from '../../vegasQueryParameters.js';
import vegas from '../../vegas.js';
import optionize from '../../../../phet-core/js/optionize.js';
import EmptyObjectType from '../../../../phet-core/js/types/EmptyObjectType.js';
import DemosScreenView, { DemosScreenViewOptions } from '../../../../sun/js/demo/DemosScreenView.js';
import demoLevelSelectionButton from './demoLevelSelectionButton.js';
import demoLevelSelectionButtonGroup from './demoLevelSelectionButtonGroup.js';
import demoRewardNode from './demoRewardNode.js';
import demoScoreDisplays from './demoScoreDisplays.js';

type SelfOptions = EmptyObjectType;
type ComponentsScreenViewOptions = SelfOptions & DemosScreenViewOptions;

export default class ComponentsScreenView extends DemosScreenView {

  public constructor( providedOptions?: ComponentsScreenViewOptions ) {

    const options = optionize<ComponentsScreenViewOptions, SelfOptions, DemosScreenViewOptions>()( {
      selectedDemoLabel: vegasQueryParameters.component
    }, providedOptions );

    // To add a demo, add an entry here of type SunDemo.
    const demos = [
      { label: 'LevelSelectionButton', createNode: demoLevelSelectionButton },
      { label: 'LevelSelectionButtonGroup', createNode: demoLevelSelectionButtonGroup },
      { label: 'RewardNode', createNode: demoRewardNode },
      { label: 'ScoreDisplays', createNode: demoScoreDisplays }
    ];

    super( demos, options );
  }
}

vegas.register( 'ComponentsScreenView', ComponentsScreenView );