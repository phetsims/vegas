// Copyright 2025, University of Colorado Boulder
// AUTOMATICALLY GENERATED – DO NOT EDIT.
// Generated from vegas-strings_en.yaml

/* eslint-disable */
/* @formatter:off */

import type { FluentVariable } from '../../chipper/js/browser/FluentPattern.js';
import FluentPattern from '../../chipper/js/browser/FluentPattern.js';
import FluentConstant from '../../chipper/js/browser/FluentConstant.js';
import FluentContainer from '../../chipper/js/browser/FluentContainer.js';
import vegas from './vegas.js';
import VegasStrings from './VegasStrings.js';

// This map is used to create the fluent file and link to all StringProperties.
// Accessing StringProperties is also critical for including them in the built sim.
// However, if strings are unused in Fluent system too, they will be fully excluded from
// the build. So we need to only add actually used strings.
const fluentKeyToStringPropertyMap = new Map();

const addToMapIfDefined = ( key: string, path: string ) => {
  const sp = _.get( VegasStrings, path );
  if ( sp ) {
    fluentKeyToStringPropertyMap.set( key, sp );
  }
};

addToMapIfDefined( 'vegas_title', 'vegas.titleStringProperty' );
addToMapIfDefined( 'screen_components', 'screen.componentsStringProperty' );
addToMapIfDefined( 'screen_finiteChallenges', 'screen.finiteChallengesStringProperty' );
addToMapIfDefined( 'screen_infiniteChallenges', 'screen.infiniteChallengesStringProperty' );
addToMapIfDefined( 'keepTrying', 'keepTryingStringProperty' );
addToMapIfDefined( 'good', 'goodStringProperty' );
addToMapIfDefined( 'great', 'greatStringProperty' );
addToMapIfDefined( 'excellent', 'excellentStringProperty' );
addToMapIfDefined( 'yourNewBest', 'yourNewBestStringProperty' );
addToMapIfDefined( 'continue', 'continueStringProperty' );
addToMapIfDefined( 'check', 'checkStringProperty' );
addToMapIfDefined( 'next', 'nextStringProperty' );
addToMapIfDefined( 'button_newGame', 'button.newGameStringProperty' );
addToMapIfDefined( 'showAnswer', 'showAnswerStringProperty' );
addToMapIfDefined( 'tryAgain', 'tryAgainStringProperty' );
addToMapIfDefined( 'selectLevel', 'selectLevelStringProperty' );
addToMapIfDefined( 'startOver', 'startOverStringProperty' );
addToMapIfDefined( 'keepGoing', 'keepGoingStringProperty' );
addToMapIfDefined( 'newLevel', 'newLevelStringProperty' );
addToMapIfDefined( 'score', 'scoreStringProperty' );
addToMapIfDefined( 'done', 'doneStringProperty' );
addToMapIfDefined( 'youCompletedAllLevels', 'youCompletedAllLevelsStringProperty' );
addToMapIfDefined( 'chooseYourLevel', 'chooseYourLevelStringProperty' );
addToMapIfDefined( 'a11y_statusBar_backButton_accessibleName', 'a11y.statusBar.backButton.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_statusBar_backButton_accessibleHelpText', 'a11y.statusBar.backButton.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_statusBar_backButton_accessibleContextResponse', 'a11y.statusBar.backButton.accessibleContextResponseStringProperty' );
addToMapIfDefined( 'a11y_levelSelectionScreen_levelButton_accessibleName', 'a11y.levelSelectionScreen.levelButton.accessibleNameStringProperty' );

// A function that creates contents for a new Fluent file, which will be needed if any string changes.
const createFluentFile = (): string => {
  let ftl = '';
  for (const [key, stringProperty] of fluentKeyToStringPropertyMap.entries()) {
    ftl += `${key} = ${stringProperty.value.replace('\n','\n ')}\n`;
  }
  return ftl;
};

const fluentSupport = new FluentContainer( createFluentFile, Array.from(fluentKeyToStringPropertyMap.values()) );

const VegasFluent = {
  vegas: {
    titleStringProperty: _.get( VegasStrings, 'vegas.titleStringProperty' )
  },
  screen: {
    componentsStringProperty: _.get( VegasStrings, 'screen.componentsStringProperty' ),
    finiteChallengesStringProperty: _.get( VegasStrings, 'screen.finiteChallengesStringProperty' ),
    infiniteChallengesStringProperty: _.get( VegasStrings, 'screen.infiniteChallengesStringProperty' )
  },
  pattern: {
    "0challenge": {
      "1maxStringProperty": _.get( VegasStrings, 'pattern.0challenge.1maxStringProperty' )
    },
    "0hours": {
      "1minutes": {
        "2secondsStringProperty": _.get( VegasStrings, 'pattern.0hours.1minutes.2secondsStringProperty' )
      }
    },
    "0minutes": {
      "1secondsStringProperty": _.get( VegasStrings, 'pattern.0minutes.1secondsStringProperty' )
    },
    "0yourBestStringProperty": _.get( VegasStrings, 'pattern.0yourBestStringProperty' ),
    score: {
      numberStringProperty: _.get( VegasStrings, 'pattern.score.numberStringProperty' )
    }
  },
  keepTryingStringProperty: _.get( VegasStrings, 'keepTryingStringProperty' ),
  goodStringProperty: _.get( VegasStrings, 'goodStringProperty' ),
  greatStringProperty: _.get( VegasStrings, 'greatStringProperty' ),
  excellentStringProperty: _.get( VegasStrings, 'excellentStringProperty' ),
  yourNewBestStringProperty: _.get( VegasStrings, 'yourNewBestStringProperty' ),
  continueStringProperty: _.get( VegasStrings, 'continueStringProperty' ),
  label: {
    levelStringProperty: _.get( VegasStrings, 'label.levelStringProperty' ),
    scorePatternStringProperty: _.get( VegasStrings, 'label.scorePatternStringProperty' ),
    timeStringProperty: _.get( VegasStrings, 'label.timeStringProperty' ),
    score: {
      maxStringProperty: _.get( VegasStrings, 'label.score.maxStringProperty' )
    }
  },
  checkStringProperty: _.get( VegasStrings, 'checkStringProperty' ),
  nextStringProperty: _.get( VegasStrings, 'nextStringProperty' ),
  button: {
    newGameStringProperty: _.get( VegasStrings, 'button.newGameStringProperty' )
  },
  showAnswerStringProperty: _.get( VegasStrings, 'showAnswerStringProperty' ),
  tryAgainStringProperty: _.get( VegasStrings, 'tryAgainStringProperty' ),
  selectLevelStringProperty: _.get( VegasStrings, 'selectLevelStringProperty' ),
  startOverStringProperty: _.get( VegasStrings, 'startOverStringProperty' ),
  keepGoingStringProperty: _.get( VegasStrings, 'keepGoingStringProperty' ),
  newLevelStringProperty: _.get( VegasStrings, 'newLevelStringProperty' ),
  scoreStringProperty: _.get( VegasStrings, 'scoreStringProperty' ),
  doneStringProperty: _.get( VegasStrings, 'doneStringProperty' ),
  youCompletedAllLevelsStringProperty: _.get( VegasStrings, 'youCompletedAllLevelsStringProperty' ),
  chooseYourLevelStringProperty: _.get( VegasStrings, 'chooseYourLevelStringProperty' ),
  a11y: {
    statusBar: {
      backButton: {
        accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_statusBar_backButton_accessibleName', _.get( VegasStrings, 'a11y.statusBar.backButton.accessibleNameStringProperty' ) ),
        accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_statusBar_backButton_accessibleHelpText', _.get( VegasStrings, 'a11y.statusBar.backButton.accessibleHelpTextStringProperty' ) ),
        accessibleContextResponseStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_statusBar_backButton_accessibleContextResponse', _.get( VegasStrings, 'a11y.statusBar.backButton.accessibleContextResponseStringProperty' ) )
      }
    },
    levelSelectionScreen: {
      levelButton: {
        accessibleName: new FluentPattern<{ levelNumber: FluentVariable, score: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_levelSelectionScreen_levelButton_accessibleName', _.get( VegasStrings, 'a11y.levelSelectionScreen.levelButton.accessibleNameStringProperty' ), [{"name":"levelNumber"},{"name":"score"}] )
      }
    }
  }
};

export default VegasFluent;

vegas.register('VegasFluent', VegasFluent);
