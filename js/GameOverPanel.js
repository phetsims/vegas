// Copyright 2002-2013, University of Colorado Boulder

/**
 * Upon completion of a Game, this panel displays a summary of the user's game results.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var Color = require( 'SCENERY/util/Color' );
  var GameTimer = require( 'VEGAS/GameTimer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var TextButton = require( 'SUN/TextButton' );
  var Util = require( 'DOT/Util' );

  // strings
  var gameOverString = require( 'string!VEGAS/gameOver' );
  var levelString = require( 'string!VEGAS/level' );
  var newGameString = require( 'string!VEGAS/newGame' );
  var pattern_0label_1value = require( 'string!VEGAS/pattern.0label.1value' );
  var pattern_0points_1max = require( 'string!VEGAS/pattern.0points.1max' );
  var pattern_0points_1max_perfect = require( 'string!VEGAS/pattern.0points.1max.perfect' );
  var pattern_0time = require( 'string!VEGAS/pattern.0time' );
  var pattern_0time_newBest = require( 'string!VEGAS/pattern.0time.newBest' );
  var pattern_0time_yourBest = require( 'string!VEGAS/pattern.0time.yourBest' );

  function GameOverPanel( level, score, perfectScore, scoreDecimalPlaces, time, bestTime, timerEnabled, newGameCallback, options ) {

    options = _.extend( {
      minWidth: 400,
      xMargin: 20,
      yMargin: 20,
      fill: 'rgb( 180, 205, 255 )',
      font: new PhetFont( 24 ),
      titleFont: new PhetFont( 30 ),
      newGameButtonColor: new Color( 255, 255, 255 )
    }, options );

    var titleNode = new Text( gameOverString, { font: options.titleFont } );

    var textOptions = { font: options.font };
    var levelNode = new Text( StringUtils.format( pattern_0label_1value, levelString, level + 1 ), textOptions );
    var scoreNode = new Text( getScoreString( score, perfectScore, scoreDecimalPlaces ), textOptions );
    var timeNode = new Text( getTimeString( ( score === perfectScore ), time, bestTime ), textOptions );
    timeNode.visible = timerEnabled;

    // New Game button
    var newGameButton = new TextButton( newGameString, newGameCallback, {
      font: options.font,
      rectangleFillUp: options.newGameButtonColor,
      rectangleXMargin: 20,
      rectangleYMargin: 5 } );

    // content for the panel
    var content = new Node();
    content.addChild( titleNode );
    content.addChild( levelNode );
    content.addChild( scoreNode );
    content.addChild( timeNode );
    content.addChild( newGameButton );

    // separators
    var separatorWidth = Math.max( content.width, options.minWidth - ( 2 * options.xMargin ) );
    var topSeparator = new Line( 0, 0, separatorWidth, 0, { stroke: 'black' } );
    var bottomSeparator = new Line( 0, 0, separatorWidth, 0, { stroke: 'black' } );
    content.addChild( topSeparator );
    content.addChild( bottomSeparator );

    // layout
    var ySpacing = 30;
    titleNode.centerX = topSeparator.centerX;
    topSeparator.top = titleNode.bottom + ySpacing;
    levelNode.top = topSeparator.bottom + ySpacing;
    scoreNode.top = levelNode.bottom + ySpacing;
    timeNode.top = scoreNode.bottom + ySpacing;
    bottomSeparator.top = timeNode.bottom + ySpacing;
    newGameButton.centerX = bottomSeparator.centerX;
    newGameButton.top = bottomSeparator.bottom + ySpacing;

    Panel.call( this, content, options );
  }

  // Gets the score string. If the score was perfect, indicate that.
  var getScoreString = function( score, perfectScore, numberOfDecimalPlaces ) {
    var pointsString = Util.toFixed( score, numberOfDecimalPlaces );
    var perfectScoreString = Util.toFixed( perfectScore, numberOfDecimalPlaces );
    if ( score === perfectScore ) {
      return StringUtils.format( pattern_0points_1max_perfect, pointsString, perfectScoreString );
    }
    else {
      return StringUtils.format( pattern_0points_1max, pointsString, perfectScoreString );
    }
  };

  /*
   * Gets the time string.
   * If we had an imperfect score, simply show the time.
   * If we had a perfect score, show the best time, and indicate if the time was a "new best".
   */
  var getTimeString = function( isPerfectScore, time, bestTime ) {
    // Time: 0:29
    if ( !isPerfectScore ) {
      // Time: 0:29
      return StringUtils.format( pattern_0time, GameTimer.formatTime( time ) );
    }
    else if ( time !== bestTime ) {
      // Time: 0:29 (Your New Best!)
      return StringUtils.format( pattern_0time_newBest, GameTimer.formatTime( time ) );
    }
    else {
      // Time: 0:29 (Your Best: 0:20)
      return StringUtils.format( pattern_0time_yourBest, GameTimer.formatTime( time ) );
    }
  };

  return inherit( Panel, GameOverPanel );
} );
