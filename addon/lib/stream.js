import Ember from 'ember';

/*
`Ember.__loader` is private, but these specific modules were not exposed when the initial
streamification of Ember's view layer happened.

https://github.com/emberjs/ember.js/pull/9693 is pending to expose them (hopefully in 1.10).
*/

var streamPackage='ember-metal';

if(Ember.VERSION.split('.')[1]>6) {
	streamPackage='ember-htmlbars';
} 

var Stream = Ember.__loader.require(streamPackage+'/streams/stream')['Stream'];

var createStream=function(fn) {
	return new Stream(fn);
};



export var readArray = Ember.__loader.require(streamPackage+'/streams/utils')['readArray'];
export var read = Ember.__loader.require(streamPackage+'/streams/utils')['read'];
export default createStream;