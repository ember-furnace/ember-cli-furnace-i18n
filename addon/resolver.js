import Ember from 'ember';
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
		var localeSet= this.container.lookupFactory('locale:' + locale.locale+'.'+path);
		if (!localeSet) {
			localeSet = this.container.lookupFactory('locale:' + locale.defaultLocale+'.'+path);
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
		var _path=path.split('.');
		var name=_path.pop();
		path=_path.join('.');
		if(path==='') {
			path='app';
		}
		
		if(locale.libraries[path]===undefined) {
			this._loadPath(locale,path);
		}
		if(locale.libraries[path]!==null) {
			return get(locale.libraries[path],name);
		}
	}
	
});