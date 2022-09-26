// Copyright 2021-2022, University of Colorado Boulder

/**
 * Auto-generated from modulify, DO NOT manually modify.
 */
/* eslint-disable */
import getStringModule from '../../chipper/js/getStringModule.js';
import LinkableProperty from '../../axon/js/LinkableProperty.js';
import vegas from './vegas.js';

type StringsType = {
  'vegas': {
    'title': string;
    'titleStringProperty': LinkableProperty<string>;
  };
  'pattern': {
    '0challenge': {
      '1max': string;
      '1maxStringProperty': LinkableProperty<string>;
    };
    '0hours': {
      '1minutes': {
        '2seconds': string;
        '2secondsStringProperty': LinkableProperty<string>;
      }
    };
    '0minutes': {
      '1seconds': string;
      '1secondsStringProperty': LinkableProperty<string>;
    };
    '0yourBest': string;
    '0yourBestStringProperty': LinkableProperty<string>;
    'score': {
      'number': string;
      'numberStringProperty': LinkableProperty<string>;
    }
  };
  'keepTrying': string;
  'keepTryingStringProperty': LinkableProperty<string>;
  'good': string;
  'goodStringProperty': LinkableProperty<string>;
  'great': string;
  'greatStringProperty': LinkableProperty<string>;
  'excellent': string;
  'excellentStringProperty': LinkableProperty<string>;
  'yourNewBest': string;
  'yourNewBestStringProperty': LinkableProperty<string>;
  'continue': string;
  'continueStringProperty': LinkableProperty<string>;
  'label': {
    'level': string;
    'levelStringProperty': LinkableProperty<string>;
    'scorePattern': string;
    'scorePatternStringProperty': LinkableProperty<string>;
    'time': string;
    'timeStringProperty': LinkableProperty<string>;
    'score': {
      'max': string;
      'maxStringProperty': LinkableProperty<string>;
    }
  };
  'check': string;
  'checkStringProperty': LinkableProperty<string>;
  'next': string;
  'nextStringProperty': LinkableProperty<string>;
  'button': {
    'newGame': string;
    'newGameStringProperty': LinkableProperty<string>;
  };
  'showAnswer': string;
  'showAnswerStringProperty': LinkableProperty<string>;
  'tryAgain': string;
  'tryAgainStringProperty': LinkableProperty<string>;
  'selectLevel': string;
  'selectLevelStringProperty': LinkableProperty<string>;
  'startOver': string;
  'startOverStringProperty': LinkableProperty<string>;
  'keepGoing': string;
  'keepGoingStringProperty': LinkableProperty<string>;
  'newLevel': string;
  'newLevelStringProperty': LinkableProperty<string>;
  'score': string;
  'scoreStringProperty': LinkableProperty<string>;
  'done': string;
  'doneStringProperty': LinkableProperty<string>;
  'youCompletedAllLevels': string;
  'youCompletedAllLevelsStringProperty': LinkableProperty<string>;
  'chooseYourLevel': string;
  'chooseYourLevelStringProperty': LinkableProperty<string>;
};

const VegasStrings = getStringModule( 'VEGAS' ) as StringsType;

vegas.register( 'VegasStrings', VegasStrings );

export default VegasStrings;
