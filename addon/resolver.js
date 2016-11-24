import Ember from 'ember';
import Promise from './promise';
/**
 * @module furnace
 * @submodule furnace-i18n
 */

/**
 * Resolver for locales
 * @class Resolver
 * @namespace Furnace.I18n
 */
var get = Ember.get;
export default Ember.Object.extend({
			
	load : function(locale,defaultLocale) {
		var _locale={
			locale:locale,
			defaultLocale:defaultLocale,
			libraries: {},
			toString: function() {
				return this.locale;
			}
		};
		return _locale;
	},
	
	_loadPath : function(locale,path) {
		var localeSet= Ember.getOwner(this)._lookupFactory('locale:' + locale.locale+'.'+path);
		if (!localeSet) {
			localeSet = Ember.getOwner(this)._lookupFactory('locale:' + locale.defaultLocale+'.'+path);
		}
		if(localeSet) {
			if(localeSet.create) {
				localeSet=localeSet.create();
			}
			locale.libraries[path]=localeSet;
		}
		else {
			locale.libraries[path]=null;
		}
	},
	
	lookup:function(locale,path) {		
		var _path=typeof path==='string' ? path.split('.') : path.toString().split('.');
		var name=_path.pop();
		path=_path.join('.');
		if(path==='') {
			path='app';
		}
		
		var library=locale.libraries[path];
		
		if(library===undefined) {
			this._loadPath(locale,path);
			library=locale.libraries[path];
		}
		if(library!==null) {
			if(library instanceof Promise) {
				if(library.get('content')===null) {
					return library._promise;
				}
			}
			return get(library,name);
		}
	}
	
});