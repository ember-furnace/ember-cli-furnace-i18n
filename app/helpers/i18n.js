import Ember from 'ember';
/**
 * @module furnace
 * @submodule furnace-i18n
 */

/**
 * @method i18n
 * @for Furnace.I18n.helpers
 * @param {String} path
 * @param {Hash} options
 * @return {String} HTML string  
 */

export default Ember.Helper.extend({
	i18n : Ember.inject.service(),
	
	localeObserver : Ember.observer('i18n._locale',function() {
		this.recompute();
	}),
	
	compute: function(params,hash)  {
		
		var explicit=false;
		var nl2br=true;
		var htmlSafe=false;
		
		var _attributes=Ember.A();
		
		if(hash.explicit) {
			explicit=hash.explicit;
		}
		
		if(hash.nl2br) {
			nl2br=hash.nl2brl
		}
		
		if(hash.htmlSafe) {
			htmlSafe=hash.htmlSafe
		}
		
		if(hash.attributes) {
			_attributes.pushObjects(hash.attributes);
		} else {
			_attributes.pushObjects(params.slice(1));
		}
		
		var result = this.get('i18n')._translate(params[0],_attributes,explicit);
		if(result instanceof Ember.RSVP.Promise) {
			var instance=this;
			result.then(function() {
				instance.recompute();
			});
			return '⌛';
		}
		
		if(!htmlSafe) {
			result = result.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
		}
		
		if(nl2br) {
			result = result.replace(/\n/g, '<br>');
		}
		
		return Ember.String.htmlSafe(result);
	}
});
