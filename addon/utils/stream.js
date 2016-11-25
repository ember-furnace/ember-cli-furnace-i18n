

import Ember from 'ember';

var bind = Ember.run.bind;

function I18nStream(attributes) {
	for(var key in attributes) {
		this[key] = attributes[key];
	}
	this.stream = function(path, values) {
		var service = Ember.getOwner(this).lookup('service:i18n');
		return service.stream( path,values);
	};
}

I18nStream.create = function(attributes) {
	var instance = new I18nStream(attributes);
	var fn = bind(instance, instance.stream);
	fn.destroy = function() {};
	return fn;
};

export default I18nStream;