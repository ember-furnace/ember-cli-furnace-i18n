import Ember from 'ember';

import createStream from 'furnace-i18n/lib/stream';

import { read, readArray } from 'furnace-i18n/lib/stream';

var get = Ember.get;

export default Ember.Service.extend( {

	container: null,
	
	_defaultLocale: null,
	
	_localeStream:null,
	
	_locale: null,
	
	_rules: null,
	
	locale : null,
	
	localeStream : Ember.computed.alias('_localeStream').readOnly(),
	
	resolver : null,
	
	init: function() {
		var application = this.container.lookup('application:main');
		var service=this;
		this._localeStream = createStream(function() {
			return service.get('locale') || service.get('_defaultLocale');
		});

		Ember.addObserver(application, 'locale',this, function() {
			this.set('locale', application.get('locale') || application.get('defaultLocale') )
		});
		
		Ember.addObserver(this, 'locale',this, function() {
			this._loadLocale(this.get('locale'));
		});
		this._localeStream.subscribe(this._loadLocale,this);
		
		
		this.set('_defaultLocale', application.defaultLocale);
		this.set('locale', application.locale ||  application.defaultLocale);

		this.resolver = this.container.lookup('locale:resolver');
		
		this._loadLocale();
	},

	_loadLocale: function() {
		var locale=this.resolver.load(this.locale,this.defaultLocale);
		if(locale instanceof Ember.RSVP.Promise) {
			var service=this;
			locale.then(function(locale){
				service._didLoadLocale(locale);
			});
		} else {
			this._didLoadLocale(locale)
		}
	},
	
	_didLoadLocale: function(locale) {
		this.set('_locale',locale);
		this.set('_rules', this.container.lookupFactory('furnace-i18n@rule:'+locale.toString().split('-')[0]));
		this._localeStream.notify();
	},
	
	_resolveLocale: function() {
		var	locale=this.get('_localeStream').value(); 
		var localeSet;
		if(locale) {
			localeSet= this.container.lookupFactory('locale:' + locale);
		}
		if (!localeSet) {
			locale = this._defaultLocale;
		}
		localeSet = this.container.lookupFactory('locale:' + locale);
		this.set('_locale',localeSet);
		this.set('_rules', this.container.lookupFactory('furnace-i18n@rule:'+locale.split('-')[0]));
	},
  
	_getLocalizedPath: function(path) {
		if(typeof path === 'object') {
			path=path.toString();
		}
		return this.resolver.lookup(this._locale, path);
	},
  
	_applyPluralizationRules: function(result, path, values) {
		if (Ember.typeOf(result) === 'object') {
			var ruleResults = this._rules(values[0], result, path, this._locale);
			result = ruleResults.result;
			path = ruleResults.path;
		}
		return result;
	},
  
	translate:function(path,values) {
		var result;
		var	locale=this.get('_localeStream').value(); 
		
		if(values.isStream) {
			values=values.value();
		}		
		if (!Ember.isArray(values)) {
			values = Array.prototype.slice.call(arguments, 1);
		}
	  
		path = read(path);
	  
		result = this._getLocalizedPath(path);	 
		if(result instanceof Ember.RSVP.Promise) {
			return result;
		}
		result = this._applyPluralizationRules(result, path, values);  
	     
		Ember.warn('Missing translation for key "' + path + '".', result);
		if(!result) {
			result='(i18n:'+locale+":"+path+')';
		}
		Ember.assert('Translation for key "' + path + '" is not a string.', Ember.typeOf(result) === 'string');
		return this.fmt(result, readArray(values));	    
	},

	stream : function(path, params) {
		var service=this;  
		var stream = createStream(function() {
			var result = service.translate(path, params);
			if(result instanceof Ember.RSVP.Promise) {
				result.then(function(){
					stream.notify();
				} );
			} else {
				return result;
			}
		});
		
		stream.subscribeTo(this._localeStream);
		
		if (path.isStream) {
			stream.subscribeTo(path);
		}
		
		// bind any arguments that are Streams
		for (var i = 0, l = params.length; i < l; i++) {
			var param = params[i];
			if(param && param.isStream){
				stream.subscribeTo(param);
			};
		}
		return stream;
	},
	
	fmt: Ember.String.fmt
});
