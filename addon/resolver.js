import Ember from 'ember';
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

	service: null,
	
	getLocale(localeKey) {
		return this.get('service.adapter').lookupLocale(localeKey);
	},
	
	updateLibrary: function(locale,path,hash) {
		var promiseOrLib=this.lookupLibrary(locale,path);
		return new Ember.RSVP.Promise(function(resolve) {
			if(promiseOrLib instanceof Ember.RSVP.Promise) {
				promiseOrLib.then(function() {
					Ember.merge(locale._libraries[path],hash);
				}).finally(resolve);
			} else {
				Ember.merge(locale._libraries[path],hash);
				resolve();
			}
		});
	},
	
	lookupLibrary(locale,path) {
		var library=locale._libraries[path];
		if(library===undefined) {
			library=this.get('service.adapter').lookupLibrary(locale,path) || null;
			locale._libraries[path]=library;
			if(library instanceof Ember.RSVP.Promise) {
				library.then(function(result) {
					locale._libraries[path]=result;
				});
			}
		}
		if(Ember.PromiseProxyMixin.detect(library)) {
			if(library.content!==null) {
				library = get(library,'content');
			} else {
				return library.get('promise');
			}
		}
		return library;
	},
	
	lookupPath : function(locale,path,name) {
		var library=this.lookupLibrary(locale,path);
		if(library instanceof Ember.RSVP.Promise) {
			return library;
		}		
		if(library!==null) {
			return get(library,name);
		}
		return undefined;
	},
	
	lookup:function(locale,path) {	
		if(!locale) {
			return undefined;
		}
		var _path=typeof path==='string' ? path.split('.') : path.toString().split('.');
		var name=_path.pop();
		path=_path.join('.');
		if(path==='') {
			path='app';
		}
		return this.lookupPath(locale,path,name);
	}
	
});