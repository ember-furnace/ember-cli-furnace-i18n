import Ember from 'ember';
import createStream from 'furnace-i18n/lib/stream';
export default Ember.ObjectProxy.extend({
	init: function() {
		var proxy=this;
		var promiseFn=this._promiseFn;
		this._promise = new Ember.RSVP.Promise(promiseFn).then(function(data) {
			proxy.set('content',data);			
		});
	},
	
}).reopenClass({
	load:function(fn) {		
		this.reopen({
			
			_promiseFn:fn
		
		});
		return this;
	}
});