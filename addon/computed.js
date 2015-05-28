import Ember from 'ember';




var get = function(key) {
	Ember.assert('You seem to have assigned a i18n computed property to a native object',typeof this.constructor.metaForProperty==='function');
	var meta=this.constructor.metaForProperty(key);
	var value =meta.i18nCache[key] || meta.i18nDefaultValue;
	
	var service=meta.i18nService();
	
	if(!this['_i18n']) {
		// Added this because of a potential memory leak, but the leak might have been caused by furnace-forms
		this.reopen({
			_i18n: service,
			willDestroy : function() {
				this._super();
				this.set('_i18n',null);
			}
		})
	
	}	
	
	var _values=[];
	
	if(meta.i18nValues) {
		for(var i=0; i<meta.i18nValues;i++) {
			_values.push(this.get(meta.i18nValues[i]));
		}
	}
	// We might want to be able to use objects to load toString value from	
	return service.translate(value,_values)
}
var set= function(key,value) {	
	Ember.assert('You seem to have assigned a i18n computed property to a native object',typeof this.constructor.metaForProperty==='function');
		
	var meta=this.constructor.metaForProperty(key);	
	meta.i18nCache[key]=value
	return get.call(this,key);
};
export default function i18nComputed(ns,defaultValue,values) { 
	var cp = new Ember.computed({get:get,set:set}).meta({
		i18nDefaultValue: defaultValue,
		i18nValues : values,
		i18nCache : {},
		i18nService: function() {
			return ns.service;
		},
		
	});
		
	cp.property((values ?  values +',' : '')+'_i18n.locale');
	
	return cp;	
};