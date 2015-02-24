import Ember from 'ember';
import T from 'furnace-i18n/utils/t';
import tHelper from 'furnace-i18n/helpers/i18n';
import Stream from 'furnace-i18n/utils/stream';

export function initialize(container, application) {
  Ember.HTMLBars._registerHelper('i18n', tHelper);

  application.localeStream = new Stream(function() {
    return  application.get('locale');
  });

  Ember.addObserver(application, 'locale', function() {
    application.localeStream.notify();
  });

  application.register('i18n:t', T);
  application.inject('route', 't', 'i18n:t');
  application.inject('model', 't', 'i18n:t');
  application.inject('component', 't', 'i18n:t');
  application.inject('controller', 't', 'i18n:t');
};

export default {
  name: 'i18n',
  initialize: initialize
};
