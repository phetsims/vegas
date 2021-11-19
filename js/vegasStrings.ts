// Copyright 2020-2021, University of Colorado Boulder

/**
 * Auto-generated from modulify, DO NOT manually modify.
 */
/* eslint-disable */
import getStringModule from '../../chipper/js/getStringModule.js';
import vegas from './vegas.js';

type StringsType = {
  'vegas': {
    'title': string
  },
  'pattern': {
    '0challenge': {
      '1max': string
    },
    '0hours': {
      '1minutes': {
        '2seconds': string
      }
    },
    '0minutes': {
      '1seconds': string
    },
    '0yourBest': string,
    'score': {
      'number': string
    }
  },
  'keepTrying': string,
  'good': string,
  'great': string,
  'excellent': string,
  'yourNewBest': string,
  'continue': string,
  'label': {
    'level': string,
    'scorePattern': string,
    'time': string,
    'score': {
      'max': string
    }
  },
  'check': string,
  'next': string,
  'button': {
    'newGame': string
  },
  'showAnswer': string,
  'tryAgain': string,
  'selectLevel': string,
  'startOver': string,
  'keepGoing': string,
  'newLevel': string,
  'score': string,
  'done': string,
  'youCompletedAllLevels': string,
  'chooseYourLevel': string
};

const vegasStrings = getStringModule( 'VEGAS' ) as StringsType;

vegas.register( 'vegasStrings', vegasStrings );

export default vegasStrings;
