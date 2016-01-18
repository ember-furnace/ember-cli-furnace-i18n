import Ember from 'ember';


var fn= function(key,value) {	
	Ember.assert('You seem to have assigned a i18n computed property to a native object',typeof this.constructor.metaForProperty==='function');
		
	var meta=this.constructor.metaForProperty(key);
	
	var service=meta.i18nService();
	Ember.assert('I18n: service not initialized, please check your version of ember-load-initializers (bower)',service);
	
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
	
	if(!this._i18nCache) {
		this._i18nCache={};
	}
	
	if(value) {
		this._i18nCache[key]=value
	}
	else {
		value = this._i18nCache[key] || meta.i18nDefaultValue;
	}
	
	var _values=[];
	if(meta.i18nValues) {
		for(var i=0; i<meta.i18nValues.length;i++) {
			_values.push(this.get(meta.i18nValues[i]));
		}
	}
	// We might want to be able to use objects to load toString value from	
	return service.translate(value,_values)
};

export default function i18nComputed(ns,defaultValue,values) { 
	var cp = new Ember.computed({
		get : function(key) {
			return fn.call(this,key);
		},
		set : function(key,value) {
			if(typeof value==='function') {
				value=value.call(this,key);
			}
			return fn.call(this,key,value);
		}
	}).meta({
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