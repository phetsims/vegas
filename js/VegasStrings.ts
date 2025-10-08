// Copyright 2021-2025, University of Colorado Boulder

/* eslint-disable */
/* @formatter:off */

/**
 * Auto-generated from modulify, DO NOT manually modify.
 */

import getStringModule from '../../chipper/js/browser/getStringModule.js';
import type LocalizedStringProperty from '../../chipper/js/browser/LocalizedStringProperty.js';
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
  'a11y': {
    'scoreDisplays': {
      'scoreDisplayStars': {
        'accessibleScoreStringProperty': LocalizedStringProperty;
      };
      'scoreDisplayLabelledStars': {
        'accessibleScoreStringProperty': LocalizedStringProperty;
      };
      'scoreDisplayNumberAndStar': {
        'accessibleScoreStringProperty': LocalizedStringProperty;
      }
    };
    'statusBar': {
      'accessibleHeadingStringProperty': LocalizedStringProperty;
      'accessibleHeadingWithLevelNumberStringProperty': LocalizedStringProperty;
      'backButton': {
        'accessibleNameStringProperty': LocalizedStringProperty;
        'accessibleHelpTextStringProperty': LocalizedStringProperty;
        'accessibleContextResponseStringProperty': LocalizedStringProperty;
      };
      'startOver': {
        'accessibleHelpTextStringProperty': LocalizedStringProperty;
        'accessibleContextResponseStringProperty': LocalizedStringProperty;
      }
    };
    'checkButton': {
      'accessibleNameStringProperty': LocalizedStringProperty;
      'accessibleHelpTextStringProperty': LocalizedStringProperty;
    };
    'gameTimerToggleButton': {
      'accessibleContextResponseOnStringProperty': LocalizedStringProperty;
      'accessibleContextResponseOffStringProperty': LocalizedStringProperty;
    };
    'levelCompletedNode': {
      'continueButton': {
        'accessibleHelpTextStringProperty': LocalizedStringProperty;
      }
    };
    'gameInfoButton': {
      'accessibleNameStringProperty': LocalizedStringProperty;
      'accessibleHelpTextStringProperty': LocalizedStringProperty;
    };
    'gameScreenNode': {
      'accessibleAnswerSectionStringProperty': LocalizedStringProperty;
      'accessibleProgressSectionStringProperty': LocalizedStringProperty;
    };
    'units': {
      'stars': {
        'patternStringProperty': LocalizedStringProperty;
      }
    };
    'levelSelectionButton': {
      'accessibleNameStringProperty': LocalizedStringProperty;
      'accessibleNameWithLevelNameStringProperty': LocalizedStringProperty;
    };
    'levelSelectionScreenNode': {
      'screenSummary': {
        'introStringProperty': LocalizedStringProperty;
        'introWithOptionsStringProperty': LocalizedStringProperty;
      }
    }
  }
};

const VegasStrings = getStringModule( 'VEGAS' ) as StringsType;

vegas.register( 'VegasStrings', VegasStrings );

export default VegasStrings;
