// Copyright 2002-2013, University of Colorado Boulder

/**
 * When a level is completed, this node shows how you did.
 *
 * @author John Blanco
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // Imports
  var Color = require( 'SCENERY/util/Color' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var ProgressIndicator = require( 'VEGAS/ProgressIndicator' );
  var GameTimer = require( 'VEGAS/GameTimer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MultiLineText = require( 'SCENERY_PHET/MultiLineText' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var TextPushButton = require( 'SUN/TextPushButton' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // Strings
  var keepTryingString = require( 'string!VEGAS/keepTrying' );
  var goodString = require( 'string!VEGAS/good' );
  var greatString = require( 'string!VEGAS/great' );
  var excellentString = require( 'string!VEGAS/excellent' );
  var scoreOutOfString = require( 'string!VEGAS/label.score.max' );
  var timeString = require( 'string!VEGAS/label.time' );
  var yourNewBestString = require( 'string!VEGAS/yourNewBest' );
  var pattern0YourBestString = require( 'string!VEGAS/pattern.0yourBest' );
  var continueString = require( 'string!VEGAS/continue' );
  var levelString = require( 'string!VEGAS/label.level' );

  /**
   * @param {number} level starting from zero, 1 added to this when displayed
   * @param {number} score
   * @param {number} perfectScore
   * @param {number} numStars
   * @param {boolean} timerEnabled
   * @param {number} elapsedTime In seconds
   * @param {number} bestTimeAtThisLevel In seconds, null if no best time exists yet.
   * @param {boolean} isNewBestTime
   * @param {Bounds2} layoutBounds
   * @param {function} continueFunction Function to call when the user presses the 'Continue' button.
   * @param {*} options
   * @constructor
   */
  function LevelCompletedNode( level, score, perfectScore, numStars, timerEnabled, elapsedTime, bestTimeAtThisLevel, isNewBestTime, layoutBounds, continueFunction, options ) {

    var size = new Dimension2( layoutBounds.width * 0.5, layoutBounds.height * 0.7 );

    options = _.extend( {
      levelVisible: true, // display the level number?
      fill: new Color( 180, 205, 255 ),
      stroke: 'black',
      lineWidth: 2,
      cornerRadius: 0.1 * size.width,
      xMargin: 20,
      yMargin: 20,
      ySpacing: 30,
      titleFont: new PhetFont( { size: 28, weight: 'bold' } ),
      infoFont: new PhetFont( { size: 22, weight: 'bold' } ),
      buttonFont: new PhetFont( 28 ),
      buttonColor: new Color( 255, 255, 0 )
    }, options );

    // nodes to be added to the panel
    var children = [];

    // Title
    var proportionCorrect = score / perfectScore;
    var titleText = keepTryingString;
    if ( proportionCorrect > 0.95 ) {
      titleText = excellentString;
    }
    else if ( proportionCorrect > 0.75 ) {
      titleText = greatString;
    }
    else if ( proportionCorrect >= 0.5 ) {
      titleText = goodString;
    }
    var title = new Text( titleText, {font: options.titleFont} );
    title.scale( Math.min( 1, (size.width * 0.9 ) / title.width ) );
    children.push( title );

    // Progress indicator
    var starDiameter = Math.min( size.width / numStars * 0.8, size.width * 0.2 );
    children.push( new ProgressIndicator( numStars, starDiameter, new Property( score ), perfectScore ) );

    // Level (optional)
    if ( options.levelVisible ) {
      children.push( new Text( StringUtils.format( levelString, level + 1 ), { font: options.infoFont } ) );
    }

    // Score
    children.push( new Text( StringUtils.format( scoreOutOfString, score, perfectScore ), { font: options.infoFont } ) );

    // Time (optional)
    if ( timerEnabled ) {
      var time = new MultiLineText( StringUtils.format( timeString, GameTimer.formatTime( elapsedTime ) ), { font: options.infoFont, align: 'center' } );
      if ( isNewBestTime ) {
        time.text += '\n' + yourNewBestString;
      }
      else if ( bestTimeAtThisLevel !== null ) {
        time.text += '\n' + StringUtils.format( pattern0YourBestString, GameTimer.formatTime( bestTimeAtThisLevel ) );
      }
      children.push( time );
    }

    // Continue button
    children.push( new TextPushButton( continueString, {
      listener: continueFunction,
      font: options.buttonFont,
      rectangleFillUp: options.buttonColor,
      rectangleXMargin: 10,
      rectangleYMargin: 5
    } ) );

    // Panel
    Panel.call( this, new VBox( { children: children, spacing: options.ySpacing } ), options );
  }

  // Inherit from Node.
  return inherit( Panel, LevelCompletedNode );
} );
