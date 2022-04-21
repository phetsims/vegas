// Copyright 2014-2022, University of Colorado Boulder

/**
 * Demonstrates the challenge UI for a game that has an infinite number of challenges per level.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../axon/js/Property.js';
import Range from '../../../dot/js/Range.js';
import ScreenView from '../../../joist/js/ScreenView.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import { HBox, Text } from '../../../scenery/js/imports.js';
import HSlider from '../../../sun/js/HSlider.js';
import InfiniteStatusBar from '../InfiniteStatusBar.js';
import StatusBar from '../../../scenery-phet/js/StatusBar.js';
import vegas from '../vegas.js';
import Tandem from '../../../tandem/js/Tandem.js';

// constants
const SCORE_RANGE = new Range( 0, 1000 );

export default class InfiniteChallengesScreenView extends ScreenView {

  constructor() {

    super( {
      tandem: Tandem.OPT_OUT
    } );

    const scoreProperty = new Property( 0 );

    // bar across the top
    const messageNode = new Text( 'Your Node goes here', {
      font: StatusBar.DEFAULT_FONT
    } );
    const statusBar = new InfiniteStatusBar( this.layoutBounds, this.visibleBoundsProperty, messageNode, scoreProperty, {
      backButtonListener: () => console.log( 'back' )
    } );
    this.addChild( statusBar );

    // slider for testing score changes
    const scoreSlider = new HBox( {
      right: this.layoutBounds.right - 20,
      top: statusBar.bottom + 30,
      children: [
        new Text( 'Score: ', { font: new PhetFont( 20 ) } ),
        new HSlider( scoreProperty, SCORE_RANGE )
      ]
    } );

    this.addChild( scoreSlider );
  }
}

vegas.register( 'InfiniteChallengesScreenView', InfiniteChallengesScreenView );