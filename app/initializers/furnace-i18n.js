import Ember from 'ember';
import i18n from 'furnace-i18n';
import I18nTranslate from 'furnace-i18n/utils/translate';
import I18nStream from 'furnace-i18n/utils/stream';
import Stream from 'furnace-i18n/lib/stream';
import Service from 'furnace-i18n/services/i18n';

export function initialize(application) {
	
	application.register('service:i18n', Service);
  
	application.register('i18n:translate', I18nTranslate);
	application.register('i18n:stream', I18nStream);
  
	application.inject('route', 'i18n', 'i18n:translate');
	application.inject('model', 'i18n', 'i18n:translate');
	application.inject('component', 'i18n', 'i18n:translate');
	application.inject('controller', 'i18n', 'i18n:translate');
	application.inject('validator', 'i18n', 'i18n:translate');
	
};

export default {
  name: 'i18n',
  initialize: initialize
};
