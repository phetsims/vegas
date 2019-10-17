// Copyright 2018-2019, University of Colorado Boulder

/**
 * model dialog shown when all levels have been completed
 */
define( require => {
  'use strict';

  // modules
  const FaceNode = require( 'SCENERY_PHET/FaceNode' );
  const inherit = require( 'PHET_CORE/inherit' );
  const merge = require( 'PHET_CORE/merge' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Panel = require( 'SUN/Panel' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  const RichText = require( 'SCENERY/nodes/RichText' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );
  const vegas = require( 'VEGAS/vegas' );

  // constants
  const FACE_DIAMETER = 160; // empirically determined

  // strings
  const doneString = require( 'string!VEGAS/done' );
  const youCompletedAllLevelsString = require( 'string!VEGAS/youCompletedAllLevels' );

  /**
   * @param {Function} listener - function that gets called when 'next' button is pressed
   * @param {Object} [options]
   * @constructor
   */
  function AllLevelsCompletedNode( listener, options ) {
    Node.call( this );

    options = merge( {
      // {number} - Controls the width of the main message and the text in the button
      maxTextWidth: 300
    }, options );

    // create the smiley face
    const faceNode = new FaceNode( FACE_DIAMETER );

    // create the dialog text
    const textMessage = new RichText( youCompletedAllLevelsString, {
      font: new PhetFont( 25 ),
      lineWrap: 300,
      maxWidth: options.maxTextWidth,
      maxHeight: 300
    } );

    // create the button
    const button = new RectangularPushButton( {
      content: new Text( doneString, {
        font: new PhetFont( 30 ),
        maxWidth: options.maxTextWidth
      } ),
      listener: listener,
      baseColor: 'yellow'
    } );

    // add the main background panel
    this.addChild( new Panel(
      new VBox( { children: [ faceNode, textMessage, button ], spacing: 20 } ),
      { xMargin: 50, yMargin: 20 }
    ) );

    this.mutate( options );
  }

  vegas.register( 'AllLevelsCompletedNode', AllLevelsCompletedNode );

  return inherit( Node, AllLevelsCompletedNode );
} );
