// Copyright 2025, University of Colorado Boulder
// AUTOMATICALLY GENERATED – DO NOT EDIT.
// Generated from vegas-strings_en.yaml

/* eslint-disable */
/* @formatter:off */

import { TReadOnlyProperty } from '../../axon/js/TReadOnlyProperty.js';
import type { FluentVariable } from '../../chipper/js/browser/FluentPattern.js';
import FluentPattern from '../../chipper/js/browser/FluentPattern.js';
import FluentConstant from '../../chipper/js/browser/FluentConstant.js';
import FluentContainer from '../../chipper/js/browser/FluentContainer.js';
import FluentComment from '../../chipper/js/browser/FluentComment.js';
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
addToMapIfDefined( 'a11y_scoreDisplays_scoreDisplayStars_accessibleScore', 'a11y.scoreDisplays.scoreDisplayStars.accessibleScoreStringProperty' );
addToMapIfDefined( 'a11y_scoreDisplays_scoreDisplayLabelledStars_accessibleScore', 'a11y.scoreDisplays.scoreDisplayLabelledStars.accessibleScoreStringProperty' );
addToMapIfDefined( 'a11y_scoreDisplays_scoreDisplayNumberAndStar_accessibleScore', 'a11y.scoreDisplays.scoreDisplayNumberAndStar.accessibleScoreStringProperty' );
addToMapIfDefined( 'a11y_statusBar_accessibleHeading', 'a11y.statusBar.accessibleHeadingStringProperty' );
addToMapIfDefined( 'a11y_statusBar_accessibleHeadingWithLevelNumber', 'a11y.statusBar.accessibleHeadingWithLevelNumberStringProperty' );
addToMapIfDefined( 'a11y_statusBar_backButton_accessibleName', 'a11y.statusBar.backButton.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_statusBar_backButton_accessibleHelpText', 'a11y.statusBar.backButton.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_statusBar_startOver_accessibleHelpText', 'a11y.statusBar.startOver.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_checkButton_accessibleName', 'a11y.checkButton.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_checkButton_accessibleHelpText', 'a11y.checkButton.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_gameTimerToggleButton_accessibleContextResponseOn', 'a11y.gameTimerToggleButton.accessibleContextResponseOnStringProperty' );
addToMapIfDefined( 'a11y_gameTimerToggleButton_accessibleContextResponseOff', 'a11y.gameTimerToggleButton.accessibleContextResponseOffStringProperty' );
addToMapIfDefined( 'a11y_levelCompletedNode_timeItem_time', 'a11y.levelCompletedNode.timeItem.timeStringProperty' );
addToMapIfDefined( 'a11y_levelCompletedNode_timeItem_timeWithBest', 'a11y.levelCompletedNode.timeItem.timeWithBestStringProperty' );
addToMapIfDefined( 'a11y_levelCompletedNode_timeItem_timeWithNewBest', 'a11y.levelCompletedNode.timeItem.timeWithNewBestStringProperty' );
addToMapIfDefined( 'a11y_levelCompletedNode_continueButton_accessibleHelpText', 'a11y.levelCompletedNode.continueButton.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_gameInfoButton_accessibleName', 'a11y.gameInfoButton.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_gameInfoButton_accessibleHelpText', 'a11y.gameInfoButton.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_showAnswerButton_accessibleHelpText', 'a11y.showAnswerButton.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_showAnswerButton_accessibleContextResponse', 'a11y.showAnswerButton.accessibleContextResponseStringProperty' );
addToMapIfDefined( 'a11y_challengeScreenNode_accessibleHeadingChallenge', 'a11y.challengeScreenNode.accessibleHeadingChallengeStringProperty' );
addToMapIfDefined( 'a11y_challengeScreenNode_accessibleAnswerSection', 'a11y.challengeScreenNode.accessibleAnswerSectionStringProperty' );
addToMapIfDefined( 'a11y_challengeScreenNode_accessibleProgressSection', 'a11y.challengeScreenNode.accessibleProgressSectionStringProperty' );
addToMapIfDefined( 'a11y_rewardScreenNode_accessibleHeading', 'a11y.rewardScreenNode.accessibleHeadingStringProperty' );
addToMapIfDefined( 'a11y_rewardDialog_accessibleName', 'a11y.rewardDialog.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_rewardDialog_accessibleContextResponseShown', 'a11y.rewardDialog.accessibleContextResponseShownStringProperty' );
addToMapIfDefined( 'a11y_rewardDialog_accessibleContextResponseHidden', 'a11y.rewardDialog.accessibleContextResponseHiddenStringProperty' );
addToMapIfDefined( 'a11y_rewardDialog_phetGirl_accessibleParagraph', 'a11y.rewardDialog.phetGirl.accessibleParagraphStringProperty' );
addToMapIfDefined( 'a11y_rewardDialog_newLevelButton_accessibleParagraph', 'a11y.rewardDialog.newLevelButton.accessibleParagraphStringProperty' );
addToMapIfDefined( 'a11y_units_stars_pattern', 'a11y.units.stars.patternStringProperty' );
addToMapIfDefined( 'a11y_levelSelectionButton_accessibleName', 'a11y.levelSelectionButton.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_levelSelectionButton_accessibleNameWithLevelName', 'a11y.levelSelectionButton.accessibleNameWithLevelNameStringProperty' );
addToMapIfDefined( 'a11y_levelSelectionScreenNode_accessibleHeadingChooseLevel', 'a11y.levelSelectionScreenNode.accessibleHeadingChooseLevelStringProperty' );
addToMapIfDefined( 'a11y_levelSelectionScreenNode_accessibleHeadingOptions', 'a11y.levelSelectionScreenNode.accessibleHeadingOptionsStringProperty' );
addToMapIfDefined( 'a11y_levelSelectionScreenNode_accessibleContextResponseShow', 'a11y.levelSelectionScreenNode.accessibleContextResponseShowStringProperty' );
addToMapIfDefined( 'a11y_levelSelectionScreenNode_screenSummary_intro', 'a11y.levelSelectionScreenNode.screenSummary.introStringProperty' );
addToMapIfDefined( 'a11y_levelSelectionScreenNode_screenSummary_introWithOptions', 'a11y.levelSelectionScreenNode.screenSummary.introWithOptionsStringProperty' );

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
    _comment_0: new FluentComment( {"comment":"Just a display of the time.","associatedKey":"time"} ),
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
    scoreDisplays: {
      scoreDisplayStars: {
        accessibleScore: new FluentPattern<{ stars: number | 'one' | number | 'other' | TReadOnlyProperty<number | 'one' | number | 'other'> }>( fluentSupport.bundleProperty, 'a11y_scoreDisplays_scoreDisplayStars_accessibleScore', _.get( VegasStrings, 'a11y.scoreDisplays.scoreDisplayStars.accessibleScoreStringProperty' ), [{"name":"stars","variants":[{"type":"number","value":"one"},{"type":"number","value":"other"}]}] )
      },
      scoreDisplayLabelledStars: {
        accessibleScore: new FluentPattern<{ stars: number | 'one' | number | 'other' | TReadOnlyProperty<number | 'one' | number | 'other'> }>( fluentSupport.bundleProperty, 'a11y_scoreDisplays_scoreDisplayLabelledStars_accessibleScore', _.get( VegasStrings, 'a11y.scoreDisplays.scoreDisplayLabelledStars.accessibleScoreStringProperty' ), [{"name":"stars","variants":[{"type":"number","value":"one"},{"type":"number","value":"other"}]}] )
      },
      scoreDisplayNumberAndStar: {
        accessibleScore: new FluentPattern<{ stars: number | 'one' | number | 'other' | TReadOnlyProperty<number | 'one' | number | 'other'> }>( fluentSupport.bundleProperty, 'a11y_scoreDisplays_scoreDisplayNumberAndStar_accessibleScore', _.get( VegasStrings, 'a11y.scoreDisplays.scoreDisplayNumberAndStar.accessibleScoreStringProperty' ), [{"name":"stars","variants":[{"type":"number","value":"one"},{"type":"number","value":"other"}]}] )
      }
    },
    statusBar: {
      accessibleHeadingStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_statusBar_accessibleHeading', _.get( VegasStrings, 'a11y.statusBar.accessibleHeadingStringProperty' ) ),
      accessibleHeadingWithLevelNumber: new FluentPattern<{ levelNumber: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_statusBar_accessibleHeadingWithLevelNumber', _.get( VegasStrings, 'a11y.statusBar.accessibleHeadingWithLevelNumberStringProperty' ), [{"name":"levelNumber"}] ),
      backButton: {
        _comment_0: new FluentComment( {"comment":"The accessible name has two variants - with and without a descriptive name.","associatedKey":"accessibleName"} ),
        accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_statusBar_backButton_accessibleName', _.get( VegasStrings, 'a11y.statusBar.backButton.accessibleNameStringProperty' ) ),
        accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_statusBar_backButton_accessibleHelpText', _.get( VegasStrings, 'a11y.statusBar.backButton.accessibleHelpTextStringProperty' ) )
      },
      startOver: {
        accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_statusBar_startOver_accessibleHelpText', _.get( VegasStrings, 'a11y.statusBar.startOver.accessibleHelpTextStringProperty' ) )
      }
    },
    checkButton: {
      _comment_0: new FluentComment( {"comment":"The accessible name has two variants - with and without a descriptive name.","associatedKey":"accessibleName"} ),
      accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_checkButton_accessibleName', _.get( VegasStrings, 'a11y.checkButton.accessibleNameStringProperty' ) ),
      accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_checkButton_accessibleHelpText', _.get( VegasStrings, 'a11y.checkButton.accessibleHelpTextStringProperty' ) )
    },
    gameTimerToggleButton: {
      accessibleContextResponseOnStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_gameTimerToggleButton_accessibleContextResponseOn', _.get( VegasStrings, 'a11y.gameTimerToggleButton.accessibleContextResponseOnStringProperty' ) ),
      accessibleContextResponseOffStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_gameTimerToggleButton_accessibleContextResponseOff', _.get( VegasStrings, 'a11y.gameTimerToggleButton.accessibleContextResponseOffStringProperty' ) )
    },
    levelCompletedNode: {
      timeItem: {
        _comment_0: new FluentComment( {"comment":"Just a display of the time.","associatedKey":"time"} ),
        time: new FluentPattern<{ time: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_levelCompletedNode_timeItem_time', _.get( VegasStrings, 'a11y.levelCompletedNode.timeItem.timeStringProperty' ), [{"name":"time"}] ),
        _comment_1: new FluentComment( {"comment":"A display of the time, with the best play time.","associatedKey":"timeWithBest"} ),
        timeWithBest: new FluentPattern<{ bestTime: FluentVariable, time: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_levelCompletedNode_timeItem_timeWithBest', _.get( VegasStrings, 'a11y.levelCompletedNode.timeItem.timeWithBestStringProperty' ), [{"name":"bestTime"},{"name":"time"}] ),
        _comment_2: new FluentComment( {"comment":"A display of the time when it is the new best time.","associatedKey":"timeWithNewBest"} ),
        timeWithNewBest: new FluentPattern<{ time: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_levelCompletedNode_timeItem_timeWithNewBest', _.get( VegasStrings, 'a11y.levelCompletedNode.timeItem.timeWithNewBestStringProperty' ), [{"name":"time"}] )
      },
      continueButton: {
        accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_levelCompletedNode_continueButton_accessibleHelpText', _.get( VegasStrings, 'a11y.levelCompletedNode.continueButton.accessibleHelpTextStringProperty' ) )
      }
    },
    gameInfoButton: {
      _comment_0: new FluentComment( {"comment":"The accessible name has two variants - with and without a descriptive name.","associatedKey":"accessibleName"} ),
      accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_gameInfoButton_accessibleName', _.get( VegasStrings, 'a11y.gameInfoButton.accessibleNameStringProperty' ) ),
      accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_gameInfoButton_accessibleHelpText', _.get( VegasStrings, 'a11y.gameInfoButton.accessibleHelpTextStringProperty' ) )
    },
    showAnswerButton: {
      accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_showAnswerButton_accessibleHelpText', _.get( VegasStrings, 'a11y.showAnswerButton.accessibleHelpTextStringProperty' ) ),
      accessibleContextResponseStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_showAnswerButton_accessibleContextResponse', _.get( VegasStrings, 'a11y.showAnswerButton.accessibleContextResponseStringProperty' ) )
    },
    challengeScreenNode: {
      _comment_0: new FluentComment( {"comment":"Simple accessibleHeading when a game does not have a defined number of challenges. If it does, the accessibleHeading","associatedKey":"accessibleHeadingChallenge"} ),
      _comment_1: new FluentComment( {"comment":"will use the visual pattern for challenge like \"Challenge 1 of 5\".","associatedKey":"accessibleHeadingChallenge"} ),
      accessibleHeadingChallengeStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_challengeScreenNode_accessibleHeadingChallenge', _.get( VegasStrings, 'a11y.challengeScreenNode.accessibleHeadingChallengeStringProperty' ) ),
      accessibleAnswerSectionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_challengeScreenNode_accessibleAnswerSection', _.get( VegasStrings, 'a11y.challengeScreenNode.accessibleAnswerSectionStringProperty' ) ),
      accessibleProgressSection: new FluentPattern<{ levelNumber: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_challengeScreenNode_accessibleProgressSection', _.get( VegasStrings, 'a11y.challengeScreenNode.accessibleProgressSectionStringProperty' ), [{"name":"levelNumber"}] )
    },
    rewardScreenNode: {
      accessibleHeading: new FluentPattern<{ levelNumber: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_rewardScreenNode_accessibleHeading', _.get( VegasStrings, 'a11y.rewardScreenNode.accessibleHeadingStringProperty' ), [{"name":"levelNumber"}] )
    },
    rewardDialog: {
      _comment_0: new FluentComment( {"comment":"The accessible name has two variants - with and without a descriptive name.","associatedKey":"accessibleName"} ),
      accessibleName: new FluentPattern<{ levelNumber: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_rewardDialog_accessibleName', _.get( VegasStrings, 'a11y.rewardDialog.accessibleNameStringProperty' ), [{"name":"levelNumber"}] ),
      accessibleContextResponseShown: new FluentPattern<{ levelNumber: FluentVariable, stars: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_rewardDialog_accessibleContextResponseShown', _.get( VegasStrings, 'a11y.rewardDialog.accessibleContextResponseShownStringProperty' ), [{"name":"levelNumber"},{"name":"stars"}] ),
      accessibleContextResponseHidden: new FluentPattern<{ levelNumber: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_rewardDialog_accessibleContextResponseHidden', _.get( VegasStrings, 'a11y.rewardDialog.accessibleContextResponseHiddenStringProperty' ), [{"name":"levelNumber"}] ),
      phetGirl: {
        accessibleParagraph: new FluentPattern<{ stars: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_rewardDialog_phetGirl_accessibleParagraph', _.get( VegasStrings, 'a11y.rewardDialog.phetGirl.accessibleParagraphStringProperty' ), [{"name":"stars"}] )
      },
      newLevelButton: {
        accessibleParagraph: new FluentPattern<{ level: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_rewardDialog_newLevelButton_accessibleParagraph', _.get( VegasStrings, 'a11y.rewardDialog.newLevelButton.accessibleParagraphStringProperty' ), [{"name":"level"}] )
      }
    },
    units: {
      stars: {
        pattern: new FluentPattern<{ value: number | 'one' | number | 'other' | TReadOnlyProperty<number | 'one' | number | 'other'> }>( fluentSupport.bundleProperty, 'a11y_units_stars_pattern', _.get( VegasStrings, 'a11y.units.stars.patternStringProperty' ), [{"name":"value","variants":[{"type":"number","value":"one"},{"type":"number","value":"other"}]}] )
      }
    },
    levelSelectionButton: {
      _comment_0: new FluentComment( {"comment":"The accessible name has two variants - with and without a descriptive name.","associatedKey":"accessibleName"} ),
      accessibleName: new FluentPattern<{ levelNumber: FluentVariable, scoreDescription: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_levelSelectionButton_accessibleName', _.get( VegasStrings, 'a11y.levelSelectionButton.accessibleNameStringProperty' ), [{"name":"levelNumber"},{"name":"scoreDescription"}] ),
      accessibleNameWithLevelName: new FluentPattern<{ levelName: FluentVariable, levelNumber: FluentVariable, scoreDescription: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_levelSelectionButton_accessibleNameWithLevelName', _.get( VegasStrings, 'a11y.levelSelectionButton.accessibleNameWithLevelNameStringProperty' ), [{"name":"levelName"},{"name":"levelNumber"},{"name":"scoreDescription"}] )
    },
    levelSelectionScreenNode: {
      accessibleHeadingChooseLevelStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_levelSelectionScreenNode_accessibleHeadingChooseLevel', _.get( VegasStrings, 'a11y.levelSelectionScreenNode.accessibleHeadingChooseLevelStringProperty' ) ),
      accessibleHeadingOptionsStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_levelSelectionScreenNode_accessibleHeadingOptions', _.get( VegasStrings, 'a11y.levelSelectionScreenNode.accessibleHeadingOptionsStringProperty' ) ),
      accessibleContextResponseShowStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_levelSelectionScreenNode_accessibleContextResponseShow', _.get( VegasStrings, 'a11y.levelSelectionScreenNode.accessibleContextResponseShowStringProperty' ) ),
      screenSummary: {
        intro: new FluentPattern<{ screenName: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_levelSelectionScreenNode_screenSummary_intro', _.get( VegasStrings, 'a11y.levelSelectionScreenNode.screenSummary.introStringProperty' ), [{"name":"screenName"}] ),
        introWithOptions: new FluentPattern<{ screenName: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_levelSelectionScreenNode_screenSummary_introWithOptions', _.get( VegasStrings, 'a11y.levelSelectionScreenNode.screenSummary.introWithOptionsStringProperty' ), [{"name":"screenName"}] )
      }
    }
  }
};

export default VegasFluent;

vegas.register('VegasFluent', VegasFluent);
