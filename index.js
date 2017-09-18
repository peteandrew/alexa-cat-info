/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills
 * nodejs skill development kit.
 * This sample supports multiple lauguages. (en-US, en-GB, de-DE).
 * The Intent Schema, Custom Slots and Sample Utterances for this skill, as well
 * as testing instructions are located at https://github.com/alexa/skill-sample-nodejs-fact
 **/

'use strict';

const Alexa = require('alexa-sdk');
const moment = require('moment-timezone');

const THEIR_NAMES_MESSAGE = 'Their names are ';
const DONT_KNOW = "I'm afraid I don't know";
const LAST_FED = 'They were last fed ';
const SET_FED = 'I have updated when they were last fed to ';

const names = ['Bertie', 'Rufus'];

const handlers = {
    'LaunchRequest': function () {
        this.emit('GetNames');
    },
    'GetNames': function () {
        if (!this.attributes['numTimesGotNames']) this.attributes['numTimesGotNames'] = 0;
        this.attributes['numTimesGotNames']++;
        const speechOutput = THEIR_NAMES_MESSAGE + names.join(' and ');
        this.emit(':tell', speechOutput);
    },
    'SetFed': function () {
        const fedDate = moment().tz('Europe/London');
        this.attributes['lastFed'] = fedDate.format();
        const speechOutput = SET_FED + fedDate.format('h mm a');
        this.emit(':tell', speechOutput);
    },
    'GetFed': function () {
        let speechOutput = DONT_KNOW;
        if (this.attributes['lastFed']) {
            speechOutput = LAST_FED + moment.tz(this.attributes['lastFed'], 'Europe/London').format('dddd h mm a');
        }
        this.emit(':tell', speechOutput);
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = this.t('HELP_MESSAGE');
        const reprompt = this.t('HELP_MESSAGE');
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
};

exports.handler = function (event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.dynamoDBTableName = 'CatInfo';
    alexa.registerHandlers(handlers);
    alexa.execute();
};

