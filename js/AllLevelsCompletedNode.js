// Copyright 2018, University of Colorado Boulder

/**
 * model dialog shown when all levels have been completed
 */
define( function( require ) {
  'use strict';

  // modules
  var FaceNode = require( 'SCENERY_PHET/FaceNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var RichText = require( 'SCENERY/nodes/RichText' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var vegas = require( 'VEGAS/vegas' );

  // constants
  var FACE_DIAMETER = 160; // empirically determined

  // strings
  var doneString = require( 'string!VEGAS/done' );
  var youCompletedAllLevelsString = require( 'string!VEGAS/youCompletedAllLevels' );

  /**
   * @param {Function} listener - function that gets called when 'next' button is pressed
   * @param {Object} [options]
   * @constructor
   */
  function AllLevelsCompletedNode( listener, options ) {
    Node.call( this );

    options = _.extend( {
      // {number} - Controls the width of the main message and the text in the button
      maxTextWidth: 300
    }, options );

    // create the smiley face
    var faceNode = new FaceNode( FACE_DIAMETER );

    // create the dialog text
    var textMessage = new RichText( youCompletedAllLevelsString, {
      font: new PhetFont( 25 ),
      lineWrap: 300,
      maxWidth: options.maxTextWidth,
      maxHeight: 300
    } );

    // create the button
    var button = new RectangularPushButton( {
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
