import Ember from 'ember';


var fn= function(key,value) {	
	Ember.assert('You seem to have assigned a i18n computed property to a native object',typeof this.constructor.metaForProperty==='function');
		
	var meta=this.constructor.metaForProperty(key);
	var service=meta.i18nService();
	if(!this['_i18n']) {
		this['_i18n']=service;
	}
	
	if(value) {
		this['_i18n_'+key]=value
	}
	else {
		value =this['_i18n_'+key] || meta.i18nDefaultValue;
	}
	var _values=[];
	if(meta.i18nValues) {
		for(var i=0; i<meta.i18nValues;i++) {
			_values.push(this.get(meta.i18nValues[i]));
		}
	}
	// We might want to be able to use objects to load toString value from	
	return service.translate(value,_values)
};

export default function i18nComputed(ns,defaultValue,values) { 
	var cp = new Ember.computed(fn).meta({
		i18nDefaultValue: defaultValue,
		i18nValues : values,
		i18nService: function() {
			return ns.service;
		},
		
	});
		
	cp.property((values ?  values +',' : '')+'_i18n.locale');
	
	return cp;	
};