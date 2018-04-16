// Copyright 2018, University of Colorado Boulder

/**
 * Status bar for games with levels that have an infinite (open-ended) number of challenges.
 * See specification in https://github.com/phetsims/vegas/issues/59.
 *
 * @author Andrea Lin
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var BackButton = require( 'SCENERY_PHET/buttons/BackButton' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var StatusBar = require( 'VEGAS/StatusBar' );
  var vegas = require( 'VEGAS/vegas' );

  /**
   * @param {Bounds2} layoutBounds - static 'safe' bounds of the parent ScreenView
   * @param {Property.<Bounds2>} visibleBoundsProperty - dynamic bounds of the browser window
   * @param {Node} messageNode - to the right of the back button, typically Text
   * @param {Node} scoreDisplay - intended to be one of the ScoreDisplay* nodes but can be any Node
   * @param {Object} [options]
   * @constructor
   */
  function InfiniteStatusBar( layoutBounds, visibleBoundsProperty, messageNode, scoreDisplay, options ) {

    var self = this;

    options = _.extend( {
      backButtonListener: null,
      xMargin: 20,
      yMargin: 10,
      spacing: 10,

      // true: keeps things on the status bar aligned with left and right edges of window bounds
      // false: align things on status bar with left and right edges of static layoutBounds
      dynamicAlignment: true
    }, options );

    var backButton = new BackButton( {
      listener: options.backButtonListener,
      xMargin: 8,
      yMargin: 10
    } );

    // Nodes on the left end of the bar
    var leftNodes = new HBox( {
      spacing: options.spacing,
      align: 'center',
      children: [ backButton, messageNode ]
    } );

    // Wrap scoreDisplay, since we will listen for bounds changes to reposition it.
    var scoreDisplayParent = new Node( { children: [ scoreDisplay ] } );

    var barHeight = _.max( [ backButton.height, messageNode.height, scoreDisplay.height ] ) + 2 * options.yMargin;

    assert && assert( !options.children, 'InfiniteStatusBar sets children' );
    options.children = [ leftNodes, scoreDisplayParent ];

    StatusBar.call( this, barHeight, layoutBounds, visibleBoundsProperty, options );

    // Update the layout of things on the status bar.
    // Some of this may be unnecessary depending on what changed, but it simplifies to do all layout here.
    var updateLayout = function() {

      var leftEdge = (options.dynamicAlignment) ? self.barNode.left : layoutBounds.minX;
      var rightEdge = (options.dynamicAlignment) ? self.barNode.right : layoutBounds.maxX;

      // stuff on left end of bar
      leftNodes.left = leftEdge + options.xMargin;
      leftNodes.centerY = self.barNode.centerY;

      // Score display on the right end
      scoreDisplayParent.right = rightEdge - options.xMargin;
      scoreDisplayParent.centerY = self.barNode.centerY;
    };
    scoreDisplay.on( 'bounds', updateLayout );
    this.barNode.on( 'bounds', updateLayout );
    updateLayout();

    // @private
    this.disposeInfiniteStatusBar = function() {
      backButton.dispose();
      if ( scoreDisplay.hasListener( 'bounds', updateLayout ) ) {
        scoreDisplay.off( 'bounds', updateLayout );
      }
      if ( self.bar.hasListener( 'bounds', updateLayout ) ) {
        self.bar.off( 'bounds', updateLayout );
      }
    };
  }

  vegas.register( 'InfiniteStatusBar', InfiniteStatusBar );

  return inherit( StatusBar, InfiniteStatusBar, {

    // @public
    dispose: function() {
      this.disposeInfiniteStatusBar();
      StatusBar.prototype.dispose.call( this );
    }
  } );
} );