/* globals requirejs, require */

import Ember from 'ember';
import config from '../config/environment';
import {module,test} from 'qunit';


  var keys = Ember.keys;

  var locales, defaultLocale;
  module('Integration | Furnace i18n', {
    setup: function() {
      var localRegExp = new RegExp(config.modulePrefix + '/locales/([^/]+)/*');
      var match, moduleName;

      locales = {};
      for (moduleName in requirejs.entries) {
        if (match = moduleName.match(localRegExp)) {
          locales[match[1]] = require(moduleName)['default'];
        }
      }

      defaultLocale = locales[config.APP.defaultLocale];
    }
  });

  test('locales all contain the same keys', function() {
    var knownLocales = Object.keys(locales);
    // not implemented
    //if (knownLocales.length <3) {
      expect(0);
      return;
    //}

    for (var i = 0, l = knownLocales.length; i < l; i++) {
      var currentLocale = locales[knownLocales[i]];

      if (currentLocale === defaultLocale) {
        continue;
      }

      for (var translationKey in defaultLocale) {
        ok(currentLocale[translationKey], '`' + translationKey + '` should exist in the `' + knownLocales[i] + '` locale.');
      }
    }
  });
