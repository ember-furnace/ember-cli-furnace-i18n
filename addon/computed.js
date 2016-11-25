import Ember from 'ember';


var fn= function(key,value) {	
	Ember.assert('I18n:  You seem to have assigned a i18n computed property to a native object',typeof this.constructor.metaForProperty==='function');
		
	var meta=this.constructor.metaForProperty(key);
	
	var owner= Ember.getOwner(this);
	if(!owner) {
		Ember.debug('I18n: No owner for object '+this);
		return '';
	}
	var service=owner.lookup('service:i18n');
	Ember.assert('I18n: service not initialized, please check your version of ember-load-initializers (bower)',service);
	
	if(!this['_i18n']) {
		// Added this because of a potential memory leak, but the leak might have been caused by furnace-forms
		this.reopen({
			_i18n: service,
			willDestroy : function() {
				this._super();
				this.set('_i18n',null);
			}
		});
	
	}
	
	if(!this._i18nCache) {
		this._i18nCache={};
	}
	
	if(typeof meta.i18nDefaultValue==='function') {
		value=meta.i18nDefaultValue.call(this,key,value);
	} else {
		if(arguments.length>1) {
			this._i18nCache[key]=value;
		}
		else {
			value = this._i18nCache[key] || meta.i18nDefaultValue;
		}
	}
		
	
	
	var _values=[];
	if(meta.i18nValues) {
		for(var i=0; i<meta.i18nValues.length;i++) {
			_values.push(this.get(meta.i18nValues[i]));
		}
	}
	// We might want to be able to use objects to load toString value from	
	return service.translate(value,_values);
};

/* Signatures
 * 
 * ns,defaultValue[,values]
 * ns,keys,defaultValue[,values]
 * 
 */

export default function i18nComputed() { 
	var ns=arguments[0];
	var observes=null;
	var values=null;
	var defaultValue=null;
	if(arguments.length===2 || (arguments.length===3 && (arguments[2]===undefined || arguments[2] instanceof Array ))) {
		defaultValue=arguments[1];
		if(arguments.length===3) {
			values=arguments[2];
		}
	} else {
		observes=arguments[1];
		defaultValue=arguments[2];
		if(arguments.length===4) {
			values=arguments[3];
		}
	}
	
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
		
	});
		
	cp.property((observes ? observes+',' :'')+(values ?  values +',' : '')+'_i18n.locale');
	
	return cp;	
}