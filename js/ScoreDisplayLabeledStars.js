// Copyright 2018, University of Colorado Boulder

/**
 * Display a score as 'Score: * * * *', where '*' are stars, which may be fully or partially filled in.
 * See specification in https://github.com/phetsims/vegas/issues/59.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ScoreDisplayStars = require( 'VEGAS/ScoreDisplayStars' );
  var StatusBar = require( 'VEGAS/StatusBar' );
  var Text = require( 'SCENERY/nodes/Text' );
  var vegas = require( 'VEGAS/vegas' );

  // strings
  var scoreString = require( 'string!VEGAS/score' );

  /**
   * @param {Property.<number>} scoreProperty
   * @param {Object} [options]
   * @constructor
   */
  function ScoreDisplayLabeledStars( scoreProperty, options ) {

    options = _.extend( {
      font: StatusBar.DEFAULT_FONT,
      textFill: 'black',
      spacing: 5
    }, options );

    var textNode = new Text( scoreString, {
      font: options.font,
      fill: options.textFill
    } );

    var scoreDisplay = new ScoreDisplayStars( scoreProperty, options );

    assert && assert( !options.children, 'ScoreDisplayLabeledStars sets children' );
    options.children = [ textNode, scoreDisplay ];

    HBox.call( this, options );

    // @private
    this.disposeScoreDisplayLabeledStars = function() {
      scoreDisplay.dispose();
    };
  }

  vegas.register( 'ScoreDisplayLabeledStars', ScoreDisplayLabeledStars );

  return inherit( HBox, ScoreDisplayLabeledStars, {

    // @public 
    dispose: function() {
      this.disposeScoreDisplayLabeledStars();
      HBox.prototype.dispose.call( this );
    }
  } );
} );