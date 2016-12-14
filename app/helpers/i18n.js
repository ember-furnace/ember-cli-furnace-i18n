import streamCreate from 'furnace-i18n/lib/stream';
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
		if(hash.explicit) {
			explicit=hash.explicit;
			delete hash.explicit;
		}
		return this.get('i18n').translate(params.shift(),hash.attributes ? hash.attributes : params,explicit);
	}
});
