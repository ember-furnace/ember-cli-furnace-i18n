import Ember from 'ember';

import { read, readArray } from 'furnace-i18n/lib/stream';

import sprintf from 'furnace-i18n/lib/sprintf';

import I18nString from 'furnace-i18n/string';

import {AbstractAdapterMixin} from 'furnace-i18n/mixins/adapters';

/**
 * @module furnace
 * @submodule furnace-i18n
 */

/**
 * @namespace Furnace.I18n
 * @class Service 
 */
export default Ember.Service.extend({

	_defaultLocale: null,
	
	_localeStream:null,
	
	_locale: null,
	
	_localePromise: null,
	
	_rules: null,
	
	/**
	 * Current selected locale
	 * @property locale
	 * @type String
	 */
	locale : null,
	
	/**
	 * Resolver used for resolving translation paths
	 * @property resolver
	 * @type Furnace.I18n.Resolver
	 */
	resolver : null,
	
	adapter : null,
	
	/**
	 * Initialize the translation service
	 * @method init
	 * @private
	 */
	init: function() {
		var application = Ember.getOwner(this).lookup('application:main');
		var service=this;
		
		Ember.addObserver(application, 'locale',this, function() {
			this.set('locale', application.get('locale') || application.get('defaultLocale') );
		});
		
		Ember.addObserver(this, 'locale',this, function() {
			this.loadLocale(this.get('locale'));
		});
		
		this.set('_defaultLocale', application.defaultLocale);

		var resolverFactory = Ember.getOwner(this).factoryFor('locale:resolver');
		this.resolver=resolverFactory.create({
			service: this
		});
		var adapterFactory = Ember.getOwner(this).factoryFor('adapter:locale');
		this.adapter=adapterFactory.create({
			service: this
		});
		
		Ember.assert('furnace-i18n: adapter should apply AbstractAdapterMixin',AbstractAdapterMixin.detect(this.adapter));
		
		if(!( application.locale ||  application.defaultLocale)) {
			Ember.warn('furnace-i18n: no locale to load! Did you set "defaultLocale" in your application environment?',null,{id:'furnace-i18n:locale-not-specified'});
			return;
		}
		
		this.set('locale', application.locale ||  application.defaultLocale);
		
		this.loadLocale(this.get('locale'));
	},
	
	updateLibraries : function(libraries,locale) {
		var service=this;
		locale=locale || this.get('_locale');
		if(!locale) {
			throw new Error('furnace-i18n: can not update libraries without locale')
		}
		var promises=[];
		for(var key in libraries) {
			promises.push(this.resolver.updateLibrary(locale,key,libraries[key]));
		}
		return Ember.RSVP.Promise.all(promises).then(function() {
			service._didUpdateLocale(locale);
		});
	},
	
	reloadLocale: function() {
		return this.loadLocale(this.get('locale'));
	},

	loadLocale: function(key) {
		var service=this;
		// To prevent rerendering we make the locale available immediately 
		
		
		this._localePromise= new Ember.RSVP.Promise(function(resolve) {
			var locale=service.resolver.getLocale(key);
			var result;
			if(locale instanceof Ember.RSVP.Promise) {
				result=locale.then(function(locale){
					return service._didLoadLocale(locale);
				});
			} else {			
				result=service._didLoadLocale(locale);
			}
			resolve(result)
		});
		return this._localePromise;
	},
	
	_didUpdateLocale(locale) {
		if(locale===this.get('_locale')) {
			this.notifyPropertyChange('_locale');
		}
	},
	
	_didLoadLocale: function(locale) {
		if(!locale) {
			if(this.get('_defaultLocale')===this.get('locale')) {
				Ember.warn('furnace-i18n: could not load defaultLocale '+this.get('_defaultLocale'),null,{id:'furnace-i18n:default-locale-not-available'});
			} else {
				return this.loadLocale(this.get('_defaultLocale'));
			}
		} else {
			this.set('_rules', Ember.getOwner(this).factoryFor('furnace-i18n@rule:'+Ember.get(locale,'text.rules')).class);
			if(locale!==this.get('_locale')) {
				this.set('_locale',locale);
			}
		}
		return locale;
	},
	
	_getLocalizedPath: function(path) {
		if(path===null) {
			return null;
		}
		if(typeof path === 'object') {
			path=path.toString();
		}
		return this.resolver.lookup(this.get('_locale'), path);
	},
  
	_applyPluralizationRules: function(result, path, values) {
		if (Ember.typeOf(result) === 'object') {
			var ruleResults = this._rules(values[0], result, path, this.get('_locale.key'));
			result = ruleResults.result;
			path = ruleResults.path;
		}
		return result;
	},
	
	
	translate: function(path,values,explicit) {
		var result=this._translate(path,values,explicit);
		Ember.assert('furnace-i18n: got a promise as translation result. Make sure the library is loaded before requesting it.',!(result instanceof Ember.RSVP.Promise),{id:'furnace-i18n:service-translate-promise'});
		return result;
	},
  
	/**
	 * Translate a certain translation path with optional parameters
	 * @method _translate
	 * @param path {String|Stream} Path to translate
	 * @param values (optional) {Array} A list of attributes for the translation
	 * @returns {String|Ember.RSVP.Promise} Returns translation or a promise for the requested translation  
	 */
	_translate:function(path,values,explicit) {
		var result;
		var	locale=this.get('_locale'); 
		
		if(!locale) {
			return this._localePromise;
		}
		if(values!==undefined) {
			if(values.isStream) {
				values=values.value();
			}
			if (!Ember.isArray(values)) {
				values = Array.prototype.slice.call(arguments, 1);
			}
			values=values.toArray();
		}
	  
		path = read(path);
		if(!path) {
			return null;
		}
		if(explicit && !(path instanceof I18nString)) {
			return path;
		}
		if(path instanceof I18nString && path.values && path.values.length && !values.length) {
			values=path.values;
		}
		result = this._getLocalizedPath(path);

		if(result instanceof Ember.RSVP.Promise) {
			return result;
		}
		result = this._applyPluralizationRules(result, path, values);  
	     
		Ember.warn('Missing translation for key "' + path + '".', result,{id:'furnace-i18n.translation-missing'});
		if(!result) {
			result='(i18n:'+locale.get('text.key')+":"+path+')';
		}
		Ember.assert('Translation for key "' + path + '" is not a string.', Ember.typeOf(result) === 'string');
		let args=readArray(values);
		args.unshift(result);
		return this.fmt.apply(this,args );	    
	},

	/**
	 * Create a stream for a certain translation path with optional parameters
	 * @method stream
	 * @param path {String|Stream} Path to translate
	 * @param values (optional) {Array} A list of attributes for the translation
	 * @returns {Stream} Stream for the translation  
	 */
//	stream : function(path, values, explicit) {
//		var service=this;  
//		var stream = createStream(function() {
//			var result = service._translate(path, values, explicit);
//			if(!this.label) {
//				this.label=path;
//			} else {
//				console.log(this.label);
//			}
//			if(result instanceof Ember.RSVP.Promise) {
//				result.then(function(){
//					stream.notify();
//				} );
//				return '⌛';
//			} else {
//				return result;
//			}
//		});
//		stream.addDependency(this._localeStream);
//		
//		if (path.isStream) {
//			stream.addDependency(path);
//		}
//		
//		// bind any arguments that are Streams
//		for (var i = 0, l = values.length; i < l; i++) {
//			var value = values[i];
//			if(value && value.isStream){
//				stream.addDependency(value);
//			}
//		}
//		return stream;
//	},
	
	
	numberFromLocale(number) {
		return Number(number.replace(new RegExp('\\'+this.get('_locale.numeric.groupingSymbol'),'g'),'').replace(this.get('_locale.numeric.decimalSymbol'),'.'));
	},
	
	numberToLocale(number,opts) {
		if(typeof number!=='number') {
			number=Number(number);
		}
		return number.toLocaleString(this.get('_locale.key'),opts);
	},
	
	time(date,timeFormat) {
		
	},
	
	date(date, dateFormat) {
		
	},
	
	dateTime(date,dateFormat,timeFormat) {
		
	},
	
	/**
	 * Alias for Ember.String.fmt
	 * @method fmt
	 * @return {String} Formatted string
	 */
	fmt: sprintf
});