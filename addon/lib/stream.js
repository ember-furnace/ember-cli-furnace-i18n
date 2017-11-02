import Ember from 'ember';

/*
`Ember.__loader` is private, but these specific modules were not exposed when the initial
streamification of Ember's view layer happened.

https://github.com/emberjs/ember.js/pull/9693 is pending to expose them (hopefully in 1.10).
*/

var streamPackage='ember-metal';
var readArray,read;
if(Ember.VERSION.split('.')[1]>6) {
	streamPackage='ember-htmlbars';
}
if (Ember.VERSION.split('.')[1]>9) {
	readArray=read=function(value) {
		return value;
	}
} else {
	readArray = Ember.__loader.require(streamPackage+'/streams/utils')['readArray'];
	read = Ember.__loader.require(streamPackage+'/streams/utils')['read'];
}


var createStream=function() {
	Ember.assert('We no longer work with streams');
};


export {readArray,read};
export default createStream;