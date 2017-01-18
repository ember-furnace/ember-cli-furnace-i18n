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
			
	getLocale : function(locale) {
		var _locale= Ember.getOwner(this).lookup('locale:' + locale);
		_locale._libraries={};
		return _locale;
	},
	
	getLibrary : function(locale,path) {
		return Ember.getOwner(this).lookup('locale:' + locale.get('text.key')+'.'+path) || null;
	},
			
	lookupPath : function(locale,path,name) {
		var library=locale._libraries[path];		
		if(library===undefined) {
			var library=this.getLibrary(locale,path) || null;
			locale._libraries[path]=library;
			if(library instanceof Ember.RSVP.Promise) {
				library.then(function(result) {
					locale._libraries[path]=result;
				});
			} 			
		}
		if(Ember.PromiseProxyMixin.detect(library)) {			
			if(library.content!==null) {
				return get(library,'content.'+name);
			} else {
				return library.get('promise');
			}
		} else if(library instanceof Ember.RSVP.Promise) {
			return library;
		} else if(library!==null) {
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