// Copyright 2021-2023, University of Colorado Boulder

/**
 * Auto-generated from modulify, DO NOT manually modify.
 */
/* eslint-disable */
/* @formatter:off */
import getStringModule from '../../chipper/js/getStringModule.js';
import type LocalizedStringProperty from '../../chipper/js/LocalizedStringProperty.js';
import vegas from './vegas.js';

type StringsType = {
  'vegas': {
    'titleStringProperty': LocalizedStringProperty;
  };
  'screen': {
    'componentsStringProperty': LocalizedStringProperty;
    'finiteChallengesStringProperty': LocalizedStringProperty;
    'infiniteChallengesStringProperty': LocalizedStringProperty;
  };
  'pattern': {
    '0challenge': {
      '1maxStringProperty': LocalizedStringProperty;
    };
    '0hours': {
      '1minutes': {
        '2secondsStringProperty': LocalizedStringProperty;
      }
    };
    '0minutes': {
      '1secondsStringProperty': LocalizedStringProperty;
    };
    '0yourBestStringProperty': LocalizedStringProperty;
    'score': {
      'numberStringProperty': LocalizedStringProperty;
    }
  };
  'keepTryingStringProperty': LocalizedStringProperty;
  'goodStringProperty': LocalizedStringProperty;
  'greatStringProperty': LocalizedStringProperty;
  'excellentStringProperty': LocalizedStringProperty;
  'yourNewBestStringProperty': LocalizedStringProperty;
  'continueStringProperty': LocalizedStringProperty;
  'label': {
    'levelStringProperty': LocalizedStringProperty;
    'scorePatternStringProperty': LocalizedStringProperty;
    'timeStringProperty': LocalizedStringProperty;
    'score': {
      'maxStringProperty': LocalizedStringProperty;
    }
  };
  'checkStringProperty': LocalizedStringProperty;
  'nextStringProperty': LocalizedStringProperty;
  'button': {
    'newGameStringProperty': LocalizedStringProperty;
  };
  'showAnswerStringProperty': LocalizedStringProperty;
  'tryAgainStringProperty': LocalizedStringProperty;
  'selectLevelStringProperty': LocalizedStringProperty;
  'startOverStringProperty': LocalizedStringProperty;
  'keepGoingStringProperty': LocalizedStringProperty;
  'newLevelStringProperty': LocalizedStringProperty;
  'scoreStringProperty': LocalizedStringProperty;
  'doneStringProperty': LocalizedStringProperty;
  'youCompletedAllLevelsStringProperty': LocalizedStringProperty;
  'chooseYourLevelStringProperty': LocalizedStringProperty;
};

const VegasStrings = getStringModule( 'VEGAS' ) as StringsType;

vegas.register( 'VegasStrings', VegasStrings );

export default VegasStrings;
