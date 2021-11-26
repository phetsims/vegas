// Copyright 2018-2021, University of Colorado Boulder

/**
 * InfiniteStatusBar is the status bar for games that have an infinite (open-ended) number of challenges per level.
 * See specification in https://github.com/phetsims/vegas/issues/59.
 *
 * @author Andrea Lin
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../phet-core/js/merge.js';
import BackButton from '../../scenery-phet/js/buttons/BackButton.js';
import { HBox } from '../../scenery/js/imports.js';
import ScoreDisplayLabeledNumber from './ScoreDisplayLabeledNumber.js';
import ScoreDisplayNumberAndStar from './ScoreDisplayNumberAndStar.js';
import StatusBar from './StatusBar.js';
import vegas from './vegas.js';

// Valid values for scoreDisplayConstructor. These are the types that are relevant for this status bar.
// All constructors must have the same signature!
const VALID_SCORE_DISPLAY_CONSTRUCTORS = [
  ScoreDisplayLabeledNumber, ScoreDisplayNumberAndStar
];

class InfiniteStatusBar extends StatusBar {

  /**
   * @param {Bounds2} layoutBounds - static 'safe' bounds of the parent ScreenView
   * @param {Property.<Bounds2>} visibleBoundsProperty - dynamic bounds of the browser window
   * @param {Node} messageNode - to the right of the back button, typically Text
   * @param {Property.<number>} scoreProperty
   * @param {Object} [options]
   */
  constructor( layoutBounds, visibleBoundsProperty, messageNode, scoreProperty, options ) {

    options = merge( {
      backButtonListener: null,
      xMargin: 20,
      yMargin: 10,
      spacing: 10,

      // score display
      scoreDisplayConstructor: ScoreDisplayNumberAndStar,
      scoreDisplayOptions: null // passed to scoreDisplayConstructor
    }, options );

    assert && assert( _.includes( VALID_SCORE_DISPLAY_CONSTRUCTORS, options.scoreDisplayConstructor,
      `invalid scoreDisplayConstructor: ${options.scoreDisplayConstructor}` ) );

    // button that typically takes us back to the level-selection UI
    const backButton = new BackButton( {
      listener: options.backButtonListener,
      xMargin: 8,
      yMargin: 10
    } );

    // Nodes on the left end of the bar
    const leftNodes = new HBox( {
      spacing: options.spacing,
      align: 'center',
      children: [ backButton, messageNode ],
      maxWidth: 0.7 * layoutBounds.width
    } );

    const scoreDisplay = new options.scoreDisplayConstructor( scoreProperty,
      merge( { maxWidth: 0.2 * layoutBounds.width }, options.scoreDisplayOptions ) );

    assert && assert( !options.children, 'InfiniteStatusBar sets children' );
    options.children = [ leftNodes, scoreDisplay ];

    assert && assert( options.barHeight === undefined, 'InfiniteStatusBar sets barHeight' );
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

    // @private
    this.disposeInfiniteStatusBar = () => {
      scoreDisplay.dispose();
    };
  }

  /**
   * @public
   * @override
   */
  dispose() {
    this.disposeInfiniteStatusBar();
    super.dispose();
  }
}

vegas.register( 'InfiniteStatusBar', InfiniteStatusBar );
export default InfiniteStatusBar;