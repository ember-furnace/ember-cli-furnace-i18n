import Ember from 'ember';

/*
`Ember.__loader` is private, but these specific modules were not exposed when the initial
streamification of Ember's view layer happened.

https://github.com/emberjs/ember.js/pull/9693 is pending to expose them (hopefully in 1.10).
*/
var Stream = Ember.__loader.require('ember-metal/streams/stream')['Stream'];

var createStream=function(fn) {
	return new Stream(fn);
};



export var readArray = Ember.__loader.require('ember-metal/streams/utils')['readArray'];
export var read = Ember.__loader.require('ember-metal/streams/utils')['read'];
export default createStream;