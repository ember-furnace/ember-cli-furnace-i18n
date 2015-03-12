import Ember from 'ember';


var fn= function(key,value) {
	var meta=this.constructor.metaForProperty(key);
	var service=meta.i18nService();

	if(!this['_i18n']) {
		this['_i18n']=service;
	}
	
	if(value) {
		this[key]=value;
	}
	
	var _values=[];
	if(meta.i18nValues) {
		for(var i=0; i<meta.i18nValues;i++) {
			_values.push(this.get(meta.i18nValues[i]));
		}
	}
	
	if(this[key]) {
		return service.translate(this[key],_values)
	} else if(meta.defaultValue) {
		return service.translate(meta.defaultValue,_values);
	}
	return null;
};

export default function i18nComputed(ns,defaultValue,values) { 
	var cp = new Ember.computed(fn).meta({
		defaultValue: defaultValue,
		i18nValues : values,
		i18nService: function() {
			return ns.service;
		},
		
	});
		
	cp.property((values ?  values +',' : '')+'_i18n.locale');
	
	return cp;	
};