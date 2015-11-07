// Copyright 2013-2015, University of Colorado Boulder

/**
 * Scoreboard for a game.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Color = require( 'SCENERY/util/Color' );
  var GameTimer = require( 'VEGAS/GameTimer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var SimpleClockIcon = require( 'SCENERY_PHET/SimpleClockIcon' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var TextPushButton = require( 'SUN/buttons/TextPushButton' );

  // strings
  var startOverString = require( 'string!VEGAS/startOver' );
  var labelLevelString = require( 'string!VEGAS/label.level' );
  var labelScoreString = require( 'string!VEGAS/label.score' );
  var pattern0Challenge1MaxString = require( 'string!VEGAS/pattern.0challenge.1max' );

  /**
   * @param {Property.<number>} challengeIndexProperty which challenge is the user current playing? (index starts at 0, displayed starting at 1)
   * @param {Property.<number>} challengesPerGameProperty how many challenges are in the current game
   * @param {Property.<number>} levelProperty
   * @param {Property.<number>} scoreProperty
   * @param {Property.<number>} elapsedTimeProperty elapsed time in seconds
   * @param {Property.<number>} timerEnabledProperty is the timer enabled?
   * @param {function} startOverCallback
   * @param {Object} [options]
   * @constructor
   */
  function ScoreboardPanel( challengeIndexProperty, challengesPerGameProperty, levelProperty, scoreProperty, elapsedTimeProperty, timerEnabledProperty, startOverCallback, options ) {

    var thisNode = this;

    options = _.extend( {
      // things that can be hidden
      levelVisible: true,
      challengeNumberVisible: true,
      // all text
      font: new PhetFont( 20 ),
      // "Start Over" button
      startOverButtonText: startOverString,
      startOverButtonBaseColor: new Color( 229, 243, 255 ),
      startOverButtonXMargin: 10,
      startOverButtonYMargin: 5,
      // Timer
      clockIconRadius: 15,
      // Panel
      minWidth: 0,
      xSpacing: 40,
      xMargin: 20,
      yMargin: 10,
      fill: 'rgb( 180, 205, 255 )',
      stroke: 'black',
      lineWidth: 1,
      align: 'center',

      // Together.js
      startOverButtonTogetherID: null
    }, options );

    // Level
    var levelNode = new Text( '', { font: options.font, pickable: false } );
    levelProperty.link( function( level ) {
      levelNode.text = StringUtils.format( labelLevelString, level + 1 );
    } );

    // Challenge number
    var challengeNumberNode = new Text( '', { font: options.font, pickable: false } );
    challengeIndexProperty.link( function( challengeIndex ) {
      challengeNumberNode.text = StringUtils.format( pattern0Challenge1MaxString, challengeIndex + 1, challengesPerGameProperty.get() );
    } );

    // Score
    var scoreNode = new Text( '', { font: options.font, pickable: false } );
    scoreProperty.link( function( score ) {
      scoreNode.text = StringUtils.format( labelScoreString, score );
    } );

    // Timer, always takes up space even when hidden.
    var timerNode = new Node( { pickable: false } );
    var clockIcon = new SimpleClockIcon( options.clockIconRadius );
    var timeValue = new Text( '', { font: options.font } );
    timerNode.addChild( clockIcon );
    timerNode.addChild( timeValue );
    timeValue.left = clockIcon.right + 8;
    timeValue.centerY = clockIcon.centerY;
    elapsedTimeProperty.link( function( elapsedTime ) {
      timeValue.text = GameTimer.formatTime( elapsedTime );
    } );
    timerEnabledProperty.link( function( timerEnabled ) {
      timerNode.visible = timerEnabled;
    } );

    // Start Over button
    var startOverButton = new TextPushButton( options.startOverButtonText, {
      listener: startOverCallback,
      font: options.font,
      baseColor: options.startOverButtonBaseColor,
      xMargin: options.startOverButtonXMargin,
      yMargin: options.startOverButtonYMargin,
      togetherID: options.startOverButtonTogetherID
    } );

    // Content for the panel, one row.
    var content = new Node();
    var nodes = [ levelNode, challengeNumberNode, scoreNode, timerNode, startOverButton ];
    if ( !options.levelVisible ) { nodes.splice( nodes.indexOf( levelNode ), 1 ); }
    if ( !options.challengeNumberVisible ) { nodes.splice( nodes.indexOf( challengeNumberNode ), 1 ); }
    for ( var i = 0; i < nodes.length; i++ ) {
      content.addChild( nodes[ i ] );
      if ( i > 0 ) {
        nodes[ i ].left = nodes[ i - 1 ].right + options.xSpacing;
        nodes[ i ].centerY = nodes[ i - 1 ].centerY;
      }
    }

    Panel.call( thisNode, content, options );
  }

  return inherit( Panel, ScoreboardPanel );
} );