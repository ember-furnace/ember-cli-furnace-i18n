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
		var _params=Ember.A(),hash=Ember.assign ? Ember.assign({},hash) : hash;
		if(hash.explicit) {
			explicit=hash.explicit;
			delete hash.explicit;
		}
		_params.pushObjects(params);		
		var result = this.get('i18n')._translate(_params.shift(),hash.attributes ? hash.attributes : _params,explicit);
		if(result instanceof Ember.RSVP.Promise) {
			var instance=this;
			result.then(function() {
				instance.recompute();
			});
			return '⌛';
		}
		return result;
	}
});
