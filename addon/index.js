/**
 * Provides i18n features.
 *
 * @module furnace
 * @submodule furnace-i18n
 */
import Ember from 'ember';
import computed from './computed';
import Resolver from './resolver';
import Translation from './translation';
import Promise from './promise';
import I18nString from './string';
import AbstractAdapter from './adapters/abstract';
import LocalAdapter from './adapters/local';
import AjaxAdapter from './adapters/ajax';
import {AbstractAdapterMixin,LocalAdapterMixin,AjaxAdapterMixin} from './mixins/adapters';

import {defaultDiacriticsRemovalMap } from './lib/diacritics';
/**
 * @class I18n
 * @namespace Furnace
 * @static
 */
export default {		
	/**
	 * @property Resolver
	 * @type Furnace.I18n.Resolver
	 */
	Resolver: Resolver,
	
	AbstractAdapter : AbstractAdapter,

	AbstractAdapterMixin : AbstractAdapterMixin,

	LocalAdapter : LocalAdapter,

	LocalAdapterMixin : LocalAdapterMixin,
	
	AjaxAdapter : AjaxAdapter,

	AjaxAdapterMixin : AjaxAdapterMixin,
	
	/**
	 * @property Translation
	 * @type Furnace.I18n.Translation
	 */
	Translation: Translation,
	
	/**
	 * @property TranslationPromise
	 * @type Furnace.I18n.Promise
	 */
	TranslationPromise: Promise,
	
	String: I18nString,
	
	/**
	 * Service instance
	 * @property service
	 * @type Object
	 * @deprecated
	 */
	service: null,
	
	/**
	 * Create a computed property that returns a translated text for the value it is set to.
	 * @method computed
	 * @param defaultValue {String} Default translatable value for the property
	 * @returns Ember.ComputedProperty
	 */
	computed : function(defaultValue,values) {
		return computed(defaultValue,values);
	},
	
	/**
	 * Initialize i18n
	 * @method initialize
	 * @private
	 */
	initialize: function() {
		
	},
	
	text: function(str,values) {
		return new I18nString(str,values);
	},
	
	error:function(str) {
		var object,values;
		if(arguments.length===2) {
			if(arguments[1] instanceof Array) {
				values=arguments[1];
			} else {
				object=arguments[1];
			}
		} else if(arguments.length>2) {
			values=arguments[1];
			object=arguments[2];
		} 
		Ember.assert("Parameters argument should be an array",values===undefined || values instanceof Array);
		object=object||new Ember.Error(str);
		if(typeof object==='function') {
			object=new object(str);
		}
		Ember.assert("Object argument should be an instanceof Error", object instanceof Error );
		object.message=this.text(str,values);
		return object;
	},
	
	removeDiacritics: function(str) {
		var changes = defaultDiacriticsRemovalMap;
		for(var i=0; i<changes.length; i++) {
			str = str.replace(changes[i].letters, changes[i].base);
		}
		return str;
	}
};
