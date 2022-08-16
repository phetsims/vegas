// Copyright 2021-2022, University of Colorado Boulder

/**
 * Auto-generated from modulify, DO NOT manually modify.
 */
/* eslint-disable */
import getStringModule from '../../chipper/js/getStringModule.js';
import TReadOnlyProperty from '../../axon/js/TReadOnlyProperty.js';
import vegas from './vegas.js';

type StringsType = {
  'vegas': {
    'title': string;
    'titleProperty': TReadOnlyProperty<string>;
  };
  'pattern': {
    '0challenge': {
      '1max': string;
      '1maxProperty': TReadOnlyProperty<string>;
    };
    '0hours': {
      '1minutes': {
        '2seconds': string;
        '2secondsProperty': TReadOnlyProperty<string>;
      }
    };
    '0minutes': {
      '1seconds': string;
      '1secondsProperty': TReadOnlyProperty<string>;
    };
    '0yourBest': string;
    '0yourBestProperty': TReadOnlyProperty<string>;
    'score': {
      'number': string;
      'numberProperty': TReadOnlyProperty<string>;
    }
  };
  'keepTrying': string;
  'keepTryingProperty': TReadOnlyProperty<string>;
  'good': string;
  'goodProperty': TReadOnlyProperty<string>;
  'great': string;
  'greatProperty': TReadOnlyProperty<string>;
  'excellent': string;
  'excellentProperty': TReadOnlyProperty<string>;
  'yourNewBest': string;
  'yourNewBestProperty': TReadOnlyProperty<string>;
  'continue': string;
  'continueProperty': TReadOnlyProperty<string>;
  'label': {
    'level': string;
    'levelProperty': TReadOnlyProperty<string>;
    'scorePattern': string;
    'scorePatternProperty': TReadOnlyProperty<string>;
    'time': string;
    'timeProperty': TReadOnlyProperty<string>;
    'score': {
      'max': string;
      'maxProperty': TReadOnlyProperty<string>;
    }
  };
  'check': string;
  'checkProperty': TReadOnlyProperty<string>;
  'next': string;
  'nextProperty': TReadOnlyProperty<string>;
  'button': {
    'newGame': string;
    'newGameProperty': TReadOnlyProperty<string>;
  };
  'showAnswer': string;
  'showAnswerProperty': TReadOnlyProperty<string>;
  'tryAgain': string;
  'tryAgainProperty': TReadOnlyProperty<string>;
  'selectLevel': string;
  'selectLevelProperty': TReadOnlyProperty<string>;
  'startOver': string;
  'startOverProperty': TReadOnlyProperty<string>;
  'keepGoing': string;
  'keepGoingProperty': TReadOnlyProperty<string>;
  'newLevel': string;
  'newLevelProperty': TReadOnlyProperty<string>;
  'score': string;
  'scoreProperty': TReadOnlyProperty<string>;
  'done': string;
  'doneProperty': TReadOnlyProperty<string>;
  'youCompletedAllLevels': string;
  'youCompletedAllLevelsProperty': TReadOnlyProperty<string>;
  'chooseYourLevel': string;
  'chooseYourLevelProperty': TReadOnlyProperty<string>;
};

const vegasStrings = getStringModule( 'VEGAS' ) as StringsType;

vegas.register( 'vegasStrings', vegasStrings );

export default vegasStrings;
