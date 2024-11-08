// Copyright 2022-2024, University of Colorado Boulder

/**
 * ComponentsScreenView demonstrates various vegas UI components.
 * Demos are selected from a combo box, and are instantiated on demand.
 * Use the 'component' query parameter to set the initial selection of the combo box.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import DemosScreenView, { DemosScreenViewOptions } from '../../../../sun/js/demo/DemosScreenView.js';
import vegas from '../../vegas.js';
import demoAllLevelsCompletedNode from './demoAllLevelsCompletedNode.js';
import demoGameInfoDialog from './demoGameInfoDialog.js';
import demoLevelCompletedNode from './demoLevelCompletedNode.js';
import demoLevelSelectionButton from './demoLevelSelectionButton.js';
import demoLevelSelectionButtonGroup from './demoLevelSelectionButtonGroup.js';
import demoRewardNode from './demoRewardNode.js';
import demoScoreDisplays from './demoScoreDisplays.js';

type SelfOptions = EmptySelfOptions;
type ComponentsScreenViewOptions = SelfOptions & DemosScreenViewOptions;

export default class ComponentsScreenView extends DemosScreenView {

  public constructor( options?: ComponentsScreenViewOptions ) {

    // To add a demo, add an entry here of type DemoItemData.
    const demos = [
      { label: 'AllLevelsCompletedNode', createNode: demoAllLevelsCompletedNode },
      { label: 'GameInfoDialog', createNode: demoGameInfoDialog },
      { label: 'LevelCompletedNode', createNode: demoLevelCompletedNode },
      { label: 'LevelSelectionButton', createNode: demoLevelSelectionButton },
      { label: 'LevelSelectionButtonGroup', createNode: demoLevelSelectionButtonGroup },
      { label: 'RewardNode', createNode: demoRewardNode },
      { label: 'ScoreDisplays', createNode: demoScoreDisplays }
    ];

    super( demos, options );
  }
}

vegas.register( 'ComponentsScreenView', ComponentsScreenView );