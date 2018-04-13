// Copyright 2018, University of Colorado Boulder

/**
 * Indicates score by using 'Score: * * * *' where '* are discrete stars.
 * See specification in https://github.com/phetsims/vegas/issues/59.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var ScoreDisplayStars = require( 'VEGAS/ScoreDisplayStars' );
  var Text = require( 'SCENERY/nodes/Text' );
  var vegas = require( 'VEGAS/vegas' );

  // strings
  var scoreString = require( 'string!VEGAS/score' );

  // constants
  var DEFAULT_FONT = new PhetFont( { size: 18, weight: 'bold' } );

  /**
   * @param {Property.<number>} scoreProperty
   * @param {Object} [options]
   * @constructor
   */
  function ScoreDisplayTextAndStars( scoreProperty, options ) {

    options = _.extend( {
      font: DEFAULT_FONT,
      fill: 'black',
      spacing: 5
    }, options );

    var textNode = new Text( scoreString, {
      font: options.font,
      fill: options.fill
    } );

    var scoreDisplay = new ScoreDisplayStars( scoreProperty, options );

    assert && assert( !options.children, 'ScoreDisplayTextAndStars sets children' );
    options.children = [ textNode, scoreDisplay ];

    HBox.call( this, options );
  }

  vegas.register( 'ScoreDisplayTextAndStars', ScoreDisplayTextAndStars );

  return inherit( HBox, ScoreDisplayTextAndStars, {

    // @public 
    dispose: function() {
      this.disposeScoreDisplayTextAndStars();
      HBox.prototype.dispose.call( this );
    }
  } );
} );