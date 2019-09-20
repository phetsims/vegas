// Copyright 2018-2019, University of Colorado Boulder

/**
 * Demonstrates vegas UI components.
 *
 * @author Sam Reid
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const Checkbox = require( 'SUN/Checkbox' );
  const FiniteStatusBar = require( 'VEGAS/FiniteStatusBar' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const HSlider = require( 'SUN/HSlider' );
  const inherit = require( 'PHET_CORE/inherit' );
  const LevelCompletedNode = require( 'VEGAS/LevelCompletedNode' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Property = require( 'AXON/Property' );
  const Range = require( 'DOT/Range' );
  const RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  const ScreenView = require( 'JOIST/ScreenView' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Util = require( 'DOT/Util' );
  const VBox = require( 'SCENERY/nodes/VBox' );
  const vegas = require( 'VEGAS/vegas' );

  // constants
  const PERFECT_SCORE = 10;
  const NUMBER_OF_CHALLENGES = 10;
  const DEFAULT_FONT = new PhetFont( 20 );

  /**
   * @constructor
   */
  function FiniteChallengesScreenView() {

    const self = this;
    ScreenView.call( this );

    const levelProperty = new Property( 1 ); // 1-based
    const challengeIndexProperty = new Property( 0 );
    const numberOfChallengesProperty = new Property( NUMBER_OF_CHALLENGES );
    const scoreProperty = new Property( 0 );
    const elapsedTimeProperty = new Property( 0 );
    const timerEnabledProperty = new BooleanProperty( true );

    // status bar across the top
    const statusBar = new FiniteStatusBar( this.layoutBounds, this.visibleBoundsProperty, scoreProperty, {
      font: new PhetFont( 20 ),
      levelProperty: levelProperty,
      challengeIndexProperty: challengeIndexProperty,
      numberOfChallengesProperty: numberOfChallengesProperty,
      elapsedTimeProperty: elapsedTimeProperty,
      timerEnabledProperty: timerEnabledProperty,
      startOverButtonOptions: {
        listener: function() { console.log( 'Start Over' ); }
      }
    } );
    this.addChild( statusBar );

    // Controls for changing Properties
    const levelSlider = new HBox( {
      children: [
        new Text( 'Level: ', { font: DEFAULT_FONT } ),
        new HSlider( levelProperty, new Range( 1, 5 ), {
          constrainValue: function( value ) {
            return Util.roundSymmetric( value );
          }
        } )
      ]
    } );

    const challengeIndexSlider = new HBox( {
      children: [
        new Text( 'Challenge: ', { font: DEFAULT_FONT } ),
        new HSlider( challengeIndexProperty, new Range( 0, NUMBER_OF_CHALLENGES - 1 ), {
          constrainValue: function( value ) {
            return Util.roundSymmetric( value );
          }
        } )
      ]
    } );

    const numberOfChallengesSlider = new HBox( {
      children: [
        new Text( 'Number of challenges: ', { font: DEFAULT_FONT } ),
        new HSlider( numberOfChallengesProperty, new Range( 1, NUMBER_OF_CHALLENGES ), {
          constrainValue: function( value ) {
            return Util.roundSymmetric( value );
          }
        } )
      ]
    } );

    const scoreSlider = new HBox( {
      left: this.layoutBounds.left + 20,
      top: statusBar.bottom + 30,
      children: [
        new Text( 'Score: ', { font: DEFAULT_FONT } ),
        new HSlider( scoreProperty, new Range( 0, PERFECT_SCORE ) )
      ]
    } );

    const elapsedTimeSlider = new HBox( {
      children: [
        new Text( 'Elapsed time: ', { font: DEFAULT_FONT } ),
        new HSlider( elapsedTimeProperty, new Range( 0, 1000 ), {
          constrainValue: function( value ) {
            return Util.roundSymmetric( value );
          }
        } )
      ]
    } );

    const timerEnabledCheckbox = new Checkbox(
      new Text( 'Timer enabled', { font: DEFAULT_FONT } ),
      timerEnabledProperty );

    const controls = new VBox( {
      align: 'left',
      spacing: 15,
      left: this.layoutBounds.left + 20,
      top: statusBar.bottom + 30,
      children: [ levelSlider, challengeIndexSlider, numberOfChallengesSlider, scoreSlider, elapsedTimeSlider, timerEnabledCheckbox ]
    } );
    this.addChild( controls );

    // button to open LevelCompleteNode
    const levelCompletedButton = new RectangularPushButton( {
      content: new Text( 'show LevelCompletedNode', { font: new PhetFont( 20 ) } ),
      centerX: this.layoutBounds.centerX,
      bottom: this.layoutBounds.bottom - 20,
      listener: function() {
        var levelCompletedNode = new LevelCompletedNode(
          levelProperty.get(), // level
          scoreProperty.value, // score
          PERFECT_SCORE, // maxScore
          4, // numberOfStars 
          true, // timerEnabled
          77, // elapsedTime
          74, // bestTimeAtThisLevel
          true, // isNewBestTime
          function() { levelCompletedNode.detach(); }, // Continue button callback
          {
            center: self.layoutBounds.center
          } );
        self.addChild( levelCompletedNode );
      }
    } );
    this.addChild( levelCompletedButton );
  }

  vegas.register( 'FiniteChallengesScreenView', FiniteChallengesScreenView );

  return inherit( ScreenView, FiniteChallengesScreenView );
} );