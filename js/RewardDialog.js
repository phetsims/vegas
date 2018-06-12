// Copyright 2018, University of Colorado Boulder

/**
 * A dialog that the client displays when the user gets a specific number of stars.
 * See specification in https://github.com/phetsims/vegas/issues/59.
 *
 * @author Andrea Lin
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Dialog = require( 'SUN/Dialog' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var ScoreDisplayNumberAndStar = require( 'VEGAS/ScoreDisplayNumberAndStar' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var vegas = require( 'VEGAS/vegas' );

  // images
  var phetGirlJugglingStarsImage = require( 'image!VEGAS/phet-girl-juggling-stars.png' );

  // strings
  var keepGoingString = require( 'string!VEGAS/keepGoing' );
  var newLevelString = require( 'string!VEGAS/newLevel' );

  // constants
  var DEFAULT_BUTTONS_FONT = new PhetFont( 16 );
  var DEFAULT_SCORE_DISPLAY_OPTIONS = {
    font: new PhetFont( { size: 30, weight: 'bold' } ),
    spacing: 6,
    starNodeOptions: {
      outerRadius: 20,
      innerRadius: 10,
      filledLineWidth: 2
    }
  };

  /**
   * @param {number} score
   * @param {Object} [options]
   * @constructor
   */
  function RewardDialog( score, options ) {

    options = _.extend( {

      // RewardDialog options
      phetGirlScale: 0.6,
      scoreDisplayOptions: null, // {Object|null} options passed to ScoreDisplayNumberAndStar
      buttonsFont: DEFAULT_BUTTONS_FONT,
      buttonsWidth: 110, // {number} fixed width for both buttons
      buttonsYSpacing: 15,
      keepGoingButtonListener: function() {}, // called when 'Keep Going' button is pressed
      newLevelButtonListener: function() {} // called when 'New Level' button is pressed
    }, options );

    options.scoreDisplayOptions = _.extend( {}, DEFAULT_SCORE_DISPLAY_OPTIONS, options.numeratorOptions );

    var phetGirlNode = new Image( phetGirlJugglingStarsImage, {
      scale: options.phetGirlScale
    } );

    var scoreDisplay = new ScoreDisplayNumberAndStar( new NumberProperty( score ), options.scoreDisplayOptions );

    var buttonOptions = {
      font: options.buttonsFont,
      minWidth: options.buttonsWidth,
      maxWidth: options.buttonsWidth
    };

    var keepGoingButton = new RectangularPushButton( _.extend( {}, buttonOptions, {
      content: new Text( keepGoingString, { font: DEFAULT_BUTTONS_FONT } ),
      listener: options.keepGoingButtonListener,
      baseColor: 'white'
    } ) );

    var newLevelButton = new RectangularPushButton( _.extend( {}, buttonOptions, {
      content: new Text( newLevelString, { font: DEFAULT_BUTTONS_FONT } ),
      listener: options.newLevelButtonListener,
      baseColor: PhetColorScheme.PHET_LOGO_YELLOW
    } ) );

    var buttons = new VBox( {
      children: [ keepGoingButton, newLevelButton ],
      spacing: options.buttonsYSpacing
    } );

    // half the remaining height, so that scoreDisplay will be centered in the negative space above the buttons.
    var scoreSpacing = ( phetGirlNode.height - scoreDisplay.height - buttons.height ) / 2;
    assert && assert( scoreSpacing > 0, 'phetGirlNode is scaled down too much' );

    var rightSideNode = new VBox( {
      children: [ scoreDisplay, buttons ],
      align: 'center',
      spacing: scoreSpacing
    } );

    var content = new HBox( {
      align: 'bottom',
      children: [ phetGirlNode, rightSideNode ],
      spacing: 40
    } );

    Dialog.call( this, content, options );
  }

  vegas.register( 'RewardDialog', RewardDialog );

  return inherit( Dialog, RewardDialog );
} );