// Copyright 2018, University of Colorado Boulder

/**
 * TODO
 *
 * @author Andrea Lin
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var vegas = require( 'VEGAS/vegas' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var Image = require( 'SCENERY/nodes/Image' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var VStrut = require( 'SCENERY/nodes/VStrut' );
  var Dialog = require( 'JOIST/Dialog' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var ScoreDisplayNumberAndStar = require( 'VEGAS/ScoreDisplayNumberAndStar' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );

  // images
  var rewardDialogPhetGirlImage = require( 'image!VEGAS/reward-dialog-phet-girl.png' );

  // strings
  var keepGoingString = require( 'string!VEGAS/keepGoing' );
  var newLevelString = require( 'string!VEGAS/newLevel' );

  // constants
  var SCORE_FONT = new PhetFont( { size: 40, weight: 'bold' } );
  var BUTTON_FONT = new PhetFont( 24 );

  /**
   * @param {number} score
   * @param {function} newLevelCallback
   * @param {Object} [options]
   * @constructor
   */
  function RewardDialog( score, newLevelCallback, options ) {

    var self = this;
    
    options = _.extend( {
      modal: true,
      hasCloseButton: false,
      xMargin: 40
    }, options );

    var phetGirlNode = new Image( rewardDialogPhetGirlImage );

    var scoreDisplay = new ScoreDisplayNumberAndStar( new NumberProperty( score ), {
      textFont: SCORE_FONT,
      starOuterRadius: 25,
      starInnerRadius: 12.5,
      starFilledLineWidth: 3,
      starEmptyLineWidth: 3,
      spacing: 6
    } );

    var buttonOptions = {
      minWidth: 145, // determined empirically
      maxWidth: 145
    };

    var keepGoingButton = new RectangularPushButton( _.extend( {}, buttonOptions, {
      content: new Text( keepGoingString, { font: BUTTON_FONT } ),
      listener: function() { self.hide(); },
      baseColor: 'white'
    } ) );

    var newLevelButton = new RectangularPushButton( _.extend( {}, buttonOptions, {
      content: new Text( newLevelString, { font: BUTTON_FONT } ),
      listener: newLevelCallback,
      baseColor: PhetColorScheme.PHET_LOGO_YELLOW
    } ) );

    var rightSideNode = new VBox( {
      children: [ scoreDisplay, new VStrut( 20 ), keepGoingButton, newLevelButton ],
      spacing: 25
    } );

    var content = new HBox( {
      children: [ phetGirlNode, rightSideNode ],
      spacing: 40
    } );

    Dialog.call( this, content, options );
  }

  vegas.register( 'RewardDialog', RewardDialog );

  return inherit( Dialog, RewardDialog );
} );