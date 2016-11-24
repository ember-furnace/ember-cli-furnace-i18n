import Ember from 'ember';

var bind = Ember.run.bind;

function I18nTranslate(attributes) {
	for(var key in attributes) {
		this[key] = attributes[key];
	}
	this.translate = function(path, values) {
		var service = Ember.getOwner(this).lookup('service:i18n');
		return service.translate( path,values);
	};
}

I18nTranslate.create = function(attributes) {
	var instance = new I18nTranslate(attributes);
	var fn = bind(instance, instance.translate);
	fn.destroy = function() {};
	return fn;
};

export default I18nTranslate;
