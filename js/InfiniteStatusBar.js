// Copyright 2018-2019, University of Colorado Boulder

/**
 * Status bar for games with levels that have an infinite (open-ended) number of challenges per level.
 * See specification in https://github.com/phetsims/vegas/issues/59.
 *
 * @author Andrea Lin
 * @author Chris Malley (PixelZoom, Inc.)
 */

import inherit from '../../phet-core/js/inherit.js';
import merge from '../../phet-core/js/merge.js';
import BackButton from '../../scenery-phet/js/buttons/BackButton.js';
import HBox from '../../scenery/js/nodes/HBox.js';
import Node from '../../scenery/js/nodes/Node.js';
import ScoreDisplayLabeledNumber from './ScoreDisplayLabeledNumber.js';
import ScoreDisplayNumberAndStar from './ScoreDisplayNumberAndStar.js';
import StatusBar from './StatusBar.js';
import vegas from './vegas.js';

// constants
const VALID_SCORE_DISPLAY_CONSTRUCTORS = [
  // Types that are relevant for this status bar. All constructors must have the same signature!
  ScoreDisplayLabeledNumber, ScoreDisplayNumberAndStar
];

/**
 * @param {Bounds2} layoutBounds - static 'safe' bounds of the parent ScreenView
 * @param {Property.<Bounds2>} visibleBoundsProperty - dynamic bounds of the browser window
 * @param {Node} messageNode - to the right of the back button, typically Text
 * @param {Property.<number>} scoreProperty
 * @param {Object} [options]
 * @constructor
 */
function InfiniteStatusBar( layoutBounds, visibleBoundsProperty, messageNode, scoreProperty, options ) {

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
    'invalid scoreDisplayConstructor: ' + options.scoreDisplayConstructor ) );

  // button that typically takes us back to the level-selection UI
  const backButton = new BackButton( {
    listener: options.backButtonListener,
    xMargin: 8,
    yMargin: 10
  } );

  // @private Nodes on the left end of the bar
  this.leftNodes = new HBox( {
    spacing: options.spacing,
    align: 'center',
    children: [ backButton, messageNode ],
    maxWidth: 0.7 * layoutBounds.width
  } );

  const scoreDisplay = new options.scoreDisplayConstructor( scoreProperty,
    merge( { maxWidth: 0.2 * layoutBounds.width }, options.scoreDisplayOptions ) );

  // Wrap scoreDisplay, since we are listening for bounds changes to reposition it.
  this.scoreDisplayParent = new Node( { children: [ scoreDisplay ] } );

  assert && assert( !options.children, 'InfiniteStatusBar sets children' );
  options.children = [ this.leftNodes, this.scoreDisplayParent ];

  assert && assert( !options.barHeight, 'InfiniteStatusBar sets barHeight' );
  options.barHeight = Math.max( this.leftNodes.height, this.scoreDisplayParent.height ) + ( 2 * options.yMargin );

  StatusBar.call( this, layoutBounds, visibleBoundsProperty, options );

  // When the score display's bounds change, update the layout.
  scoreDisplay.on( 'bounds', this.updateLayout.bind( this ) );

  // @private
  this.disposeInfiniteStatusBar = function() {
    scoreDisplay.dispose();
  };
}

vegas.register( 'InfiniteStatusBar', InfiniteStatusBar );

export default inherit( StatusBar, InfiniteStatusBar, {

  /**
   * @public
   * @override
   */
  dispose: function() {
    this.disposeInfiniteStatusBar();
    StatusBar.prototype.dispose.call( this );
  },

  /**
   * Handles layout when the bar changes.
   * @param {number} leftEdge - the bar's left edge, compensated for xMargin
   * @param {number} rightEdge - the bar's right edge, compensated for xMargin
   * @param {number} centerY - the bar's vertical center
   * @protected
   * @override
   */
  updateLayoutProtected: function( leftEdge, rightEdge, centerY ) {

    // stuff on left end of bar
    this.leftNodes.left = leftEdge;
    this.leftNodes.centerY = centerY;

    // Score display on the right end
    this.scoreDisplayParent.right = rightEdge;
    this.scoreDisplayParent.centerY = centerY;
  }
} );