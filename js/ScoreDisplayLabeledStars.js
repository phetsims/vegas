// Copyright 2018-2019, University of Colorado Boulder

/**
 * Display a score as 'Score: * * * *', where '*' are stars, which may be fully or partially filled in.
 * See specification in https://github.com/phetsims/vegas/issues/59.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const HBox = require( 'SCENERY/nodes/HBox' );
  const inherit = require( 'PHET_CORE/inherit' );
  const ScoreDisplayStars = require( 'VEGAS/ScoreDisplayStars' );
  const StatusBar = require( 'VEGAS/StatusBar' );
  const Text = require( 'SCENERY/nodes/Text' );
  const vegas = require( 'VEGAS/vegas' );

  // strings
  const scoreString = require( 'string!VEGAS/score' );

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

    const textNode = new Text( scoreString, {
      font: options.font,
      fill: options.textFill
    } );

    const scoreDisplay = new ScoreDisplayStars( scoreProperty, options );

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

    /**
     * @public
     * @override
     */
    dispose: function() {
      this.disposeScoreDisplayLabeledStars();
      HBox.prototype.dispose.call( this );
    }
  } );
} );