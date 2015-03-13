import Ember from 'ember';
import computed from './computed';
import Resolver from './resolver';
import Translation from './translation';
import Promise from './promise';
export default {		
	
	Resolver: Resolver,
	
	Translation: Translation,
	
	TranslationPromise: Promise,
	
	container: null,
	service: null,
	
	computed : function(defaultValue) {
		return computed(this,defaultValue);
	},
	
	initialize: function(container,application) {
		this.container=container;
		this.service=container.lookup('service:i18n');
		
	},
	
	
};
