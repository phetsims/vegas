// Copyright 2018, University of Colorado Boulder

/**
 * 
 *
 * @author Andrea Lin
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var vegas = require( 'VEGAS/vegas' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var Image = require( 'SCENERY/nodes/Image' );
  var PushButton = require( 'SUN/PushButton' );
  var VStrut = require( 'SCENERY/nodes/VStrut' );
  var Dialog = require( 'JOIST/Dialog' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var ScoreDisplayDiscreteStars = require( 'VEGAS/ScoreDisplayDiscreteStars' );
  var Text = require( 'SCENERY/nodes/Text' );

  // images
  var rewardDialogPhetGirlImage = require( 'image!VEGAS/reward-dialog-phet-girl.png' );

  // strings
  var keepGoingString = require( 'string!VEGAS/keepGoing' );
  var newLevelString = require( 'string!VEGAS/newLevel' );

  // constants

  /**
   * @param {number} score
   * @param {function} keepGoingCallback
   * @param {function} newLevelCallback
   * @param {Object} [options]
   * @constructor
   */
  function RewardDialog( score, keepGoingCallback, newLevelCallback, options ) {

    var phetGirlNode = new Image( rewardDialogPhetGirlImage );

    var scoreDisplay = new ScoreDisplayDiscreteStars( new NumberProperty( score ) );

    var keepGoingButton = new PushButton( {
      content: new Text( keepGoingString/*, { font: BUTTON_FONT }*/ )
    } );

    var newLevelButton = new PushButton( {
      content: new Text( newLevelString/*, { font: BUTTON_FONT }*/ )
    } );

    var rightSideNode = new VBox( {
      children: [ scoreDisplay, new VStrut( 20 ), keepGoingButton, newLevelButton ],
      spacing: 20
    } );

    var content = new HBox( {
      children: [ phetGirlNode, rightSideNode ],
      spacing: 20
    } );

    Dialog.call( this, content, options );

  }

  vegas.register( 'RewardDialog', RewardDialog );

  return inherit( Dialog, RewardDialog );

} );