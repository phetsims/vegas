// Copyright 2025, University of Colorado Boulder

/**
 * Demonstration for a game model with multiple levels and challenges. The game demonstrates
 * components and various accessibility and focus management strategies.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../../axon/js/DerivedProperty.js';
import NumberProperty from '../../../../../axon/js/NumberProperty.js';
import Property from '../../../../../axon/js/Property.js';
import { TReadOnlyProperty } from '../../../../../axon/js/TReadOnlyProperty.js';
import Range from '../../../../../dot/js/Range.js';
import TModel from '../../../../../joist/js/TModel.js';
import GameTimer from '../../../GameTimer.js';
import vegas from '../../../vegas.js';

export type GameState = 'levelSelection' | 'challenge' | 'reward';

const NUMBER_OF_LEVELS = 5;
const CHALLENGES_PER_LEVEL = 2;

export default class LevelsModel implements TModel {

  // Each level has a number of challenges.
  public readonly levelNumberProperty = new NumberProperty( 1 );
  public readonly numberOfLevelsProperty = new NumberProperty( NUMBER_OF_LEVELS );
  public readonly challengesPerLevelProperty = new NumberProperty( CHALLENGES_PER_LEVEL );

  // Drives the current game screen.
  public readonly gameStateProperty = new Property<GameState>( 'levelSelection' );

  public readonly scoreProperty = new NumberProperty( 0, { range: new Range( 0, 5 ) } );
  public readonly gameOverProperty: TReadOnlyProperty<boolean>;

  public readonly gameTimer = new GameTimer();
  public readonly timerEnabledProperty = new BooleanProperty( true );


  public constructor() {
    this.gameOverProperty = new DerivedProperty( [ this.scoreProperty ], score => score === this.scoreProperty.range.max );
  }

  public reset(): void {
    this.levelNumberProperty.value = 1;
    this.scoreProperty.value = 0;
    this.gameStateProperty.value = 'levelSelection';
    this.gameTimer.reset();
  }
}

vegas.register( 'LevelsModel', LevelsModel );