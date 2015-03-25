import Ember from 'ember';
import createStream from 'furnace-i18n/lib/stream';
/**
 * @module furnace
 * @submodule furnace-i18n
 */

/**
 * Object to abstract translation keys to be fulfilled by a promise  
 * 
 * @class Promise
 * @namespace Furnace.I18n
 * @extends Ember.ObjectProxy
 */
export default Ember.ObjectProxy.extend({
	/**
	 * Dispatch the load function, set proxy content on promise fulfill.
	 * @method init
	 * @private 
	 */
	init: function() {
		var proxy=this;
		var promiseFn=this._promiseFn;
		this._promise = new Ember.RSVP.Promise(promiseFn).then(function(data) {
			proxy.set('content',data);			
		});
	},
	
}).reopenClass({
	/**
	 * @method load
	 * @param fn {Function} Function to load translation
	 * @returns {Furnace.I18n.Promise} Promise with overloaded function
	 */
	load:function(fn) {		
		this.reopen({
			
			_promiseFn:fn
		
		});
		return this;
	}
});