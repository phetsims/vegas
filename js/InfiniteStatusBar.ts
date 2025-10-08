// Copyright 2018-2025, University of Colorado Boulder

/**
 * InfiniteStatusBar is the status bar for games that have an infinite (open-ended) number of challenges per level.
 * See specification in https://github.com/phetsims/vegas/issues/59.
 *
 * @author Andrea Lin
 * @author Chris Malley (PixelZoom, Inc.)
 */

/**
 * TODO: I took a stab at accessibility for this one. See https://github.com/phetsims/vegas/issues/138.
 *   - The messageNode is provided by the client so it will be their responsibility to instrument it.
 *   - The score display is presented as an accessibleParagraph.
 *   - DISCUSSION:
 *   - The level number should be included in the accessible heading for the status bar.
 *   - Ideally, it should be a list of two items. item 1 is the content of the message Node, item 2 is the score display.
 *   -   If the messageNode is Text, we can try to find its stringProperty by default and use that.
 */

import ReadOnlyProperty from '../../axon/js/ReadOnlyProperty.js';
import { TReadOnlyProperty } from '../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../dot/js/Bounds2.js';
import optionize from '../../phet-core/js/optionize.js';
import StrictOmit from '../../phet-core/js/types/StrictOmit.js';
import BackButton from '../../scenery-phet/js/buttons/BackButton.js';
import StatusBar, { StatusBarOptions } from '../../scenery-phet/js/StatusBar.js';
import HBox from '../../scenery/js/layout/nodes/HBox.js';
import Node from '../../scenery/js/nodes/Node.js';
import { PushButtonListener } from '../../sun/js/buttons/PushButtonModel.js';
import ScoreDisplayNumberAndStar from './ScoreDisplayNumberAndStar.js';
import { TScoreDisplayNode } from './TScoreDisplayNode.js';
import vegas from './vegas.js';
import VegasFluent from './VegasFluent.js';

type SelfOptions = {
  backButtonListener?: PushButtonListener;
  xMargin?: number;
  yMargin?: number;
  spacing?: number;

  // score display
  createScoreDisplay?: ( scoreProperty: ReadOnlyProperty<number> ) => TScoreDisplayNode;
};

export type InfiniteStatusBarOptions = SelfOptions & StrictOmit<StatusBarOptions, 'children' | 'barHeight'>;

export default class InfiniteStatusBar extends StatusBar {

  private readonly disposeInfiniteStatusBar: () => void;

  /**
   * @param layoutBounds - layoutBounds of the ScreenView
   * @param visibleBoundsProperty - visible bounds of the ScreenView
   * @param messageNode - to the right of the back button, typically Text
   * @param scoreProperty
   * @param providedOptions
   */
  public constructor( layoutBounds: Bounds2,
                      visibleBoundsProperty: TReadOnlyProperty<Bounds2>,
                      messageNode: Node,
                      scoreProperty: ReadOnlyProperty<number>,
                      providedOptions?: InfiniteStatusBarOptions ) {

    const options = optionize<InfiniteStatusBarOptions, SelfOptions, StatusBarOptions>()( {

      // SelfOptions
      backButtonListener: _.noop,
      xMargin: 20,
      yMargin: 10,
      spacing: 10,
      createScoreDisplay: ( scoreProperty: ReadOnlyProperty<number> ) => new ScoreDisplayNumberAndStar( scoreProperty ),
      accessibleHeading: VegasFluent.a11y.statusBar.accessibleHeadingStringProperty
    }, providedOptions );

    // button that typically takes us back to the level-selection UI
    const backButton = new BackButton( {
      accessibleName: VegasFluent.a11y.statusBar.backButton.accessibleNameStringProperty,
      accessibleHelpText: VegasFluent.a11y.statusBar.backButton.accessibleHelpTextStringProperty,
      accessibleContextResponse: VegasFluent.a11y.statusBar.backButton.accessibleContextResponseStringProperty,
      listener: options.backButtonListener,
      xMargin: 8,
      yMargin: 10,
      tandem: options.tandem?.createTandem( 'backButton' )
    } );

    // Nodes on the left end of the bar
    const leftNodes = new HBox( {
      spacing: options.spacing,
      align: 'center',
      children: [ backButton, messageNode ],
      maxWidth: 0.7 * layoutBounds.width
    } );

    // Create the score display.
    const scoreDisplay = options.createScoreDisplay( scoreProperty );
    scoreDisplay.maxWidth = 0.2 * layoutBounds.width;

    // TODO: The score Display will need to be responsible for creating its
    //  own PDOM representation. See https://github.com/phetsims/vegas/issues/138
    // scoreDisplay.accessibleParagraph = findStringProperty( scoreDisplay );

    options.children = [ leftNodes, scoreDisplay ];

    options.barHeight = Math.max( leftNodes.height, scoreDisplay.height ) + ( 2 * options.yMargin );

    super( layoutBounds, visibleBoundsProperty, options );

    // Position components on the bar.
    this.positioningBoundsProperty.link( positioningBounds => {
      leftNodes.left = positioningBounds.left;
      leftNodes.centerY = positioningBounds.centerY;
      scoreDisplay.right = positioningBounds.right;
      scoreDisplay.centerY = positioningBounds.centerY;
    } );

    // Keep the score right justified.
    scoreDisplay.localBoundsProperty.link( () => {
      scoreDisplay.right = this.positioningBoundsProperty.value.right;
    } );

    this.disposeInfiniteStatusBar = () => {
      scoreDisplay.dispose();
    };
  }

  public override dispose(): void {
    this.disposeInfiniteStatusBar();
    super.dispose();
  }
}

vegas.register( 'InfiniteStatusBar', InfiniteStatusBar );