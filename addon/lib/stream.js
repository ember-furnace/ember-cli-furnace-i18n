import Ember from 'ember';

/*
`Ember.__loader` is private, but these specific modules were not exposed when the initial
streamification of Ember's view layer happened.

https://github.com/emberjs/ember.js/pull/9693 is pending to expose them (hopefully in 1.10).
*/
var _Stream = Ember.__loader.require('ember-metal/streams/stream')['default'];

var createStream=function(fn) {
	var Stream=new _Stream(fn);
	Stream.subscribeTo=function(stream) {
		if(!this.subscriptions) {
			this.subscriptions=[];
		}
		this.subscriptions.push(stream);
		stream.subscribe(this.notify,this);
	}

	Stream._destroy = Stream.destroy;
	
	Stream.destroy=function() {
		if(this.subscriptions) {
			for(var i=0;i<this.subscriptions.length;i++) {
				if(this.subscriptions[i]) {
					this.subscriptions[i].unsubscribe(this.notify,this);
				}
			}
		}
		this.subscriptions=[];
		return this._destroy();
	}
	return Stream;
}



export var readArray = Ember.__loader.require('ember-metal/streams/utils')['readArray'];
export var read = Ember.__loader.require('ember-metal/streams/utils')['read'];
export default createStream;