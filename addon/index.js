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
	
	/**
	 * Container instance
	 * @property container
	 * @type Object
	 * @deprecated
	 */
	container: null,
	
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
		return computed(this,defaultValue,values);
	},
	
	/**
	 * Initialize i18n
	 * @method initialize
	 * @private
	 */
	initialize: function(instance) {
		this.container=instance.container;
		this.service=this.container.lookup('service:i18n');
		
	},
	
	
};
