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
  
	application.inject('route', 'i18nText', 'i18n:translate');
	application.inject('model', 'i18nText', 'i18n:translate');
	application.inject('component', 'i18nText', 'i18n:translate');
	application.inject('controller', 'i18nText', 'i18n:translate');
	application.inject('validator', 'i18nText', 'i18n:translate');
	
	Ember.ComponentLookup.reopen({
		componentFor(name, owner, options) {
			var fullName = 'component:' + name;
			return owner._lookupFactory(fullName, options);
		},
		layoutFor(name, owner, options) {			
			 var templateFullName = 'template:components/' + name;
			 return owner.lookup(templateFullName, options);
		}
	});
};

export default {
  name: 'i18n',
  initialize: initialize
};
