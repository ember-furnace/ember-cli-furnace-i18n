import I18nTranslate from 'furnace-i18n/utils/translate';
import Service from 'furnace-i18n/services/i18n';
export function initialize(application) {
	
	application.register('service:i18n', Service);

	application.register('i18n:translate', I18nTranslate);
	
	application.inject('route', 'i18nText', 'i18n:translate');
	application.inject('model', 'i18nText', 'i18n:translate');
	application.inject('component', 'i18nText', 'i18n:translate');
	application.inject('controller', 'i18nText', 'i18n:translate');
	application.inject('validator', 'i18nText', 'i18n:translate');
}

export default {
  name: 'i18n',
  initialize: initialize
};
