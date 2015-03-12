import Ember from 'ember';
import computed from './computed';
import Resolver from './resolver';

export default {		
	
	Resolver: Resolver,
	
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
