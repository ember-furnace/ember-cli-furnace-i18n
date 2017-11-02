import Ember from 'ember';
import DS from 'ember-data';
import { moduleFor, test } from 'ember-qunit';
moduleFor('i18n:translate','Integration | Translate | i18nText injection', {
	integration: true,
	setup() {		
		var owner=Ember.getOwner(this);
		owner.lookup('application:main').set('defaultLocale','en');
		owner.factoryFor('initializer:furnace-i18n').class.initialize(owner);
		this.inject.service('i18n');
	},
});

test('i18nText gets injected into controllers', function(assert) {
	var FooController = Ember.Controller.extend({
		foo: Ember.computed(function() {
			return this.i18nText('foo');
		})
	});
	this.register('controller:foo', FooController);

	var fooControllerInstance = Ember.getOwner(this).lookup('controller:foo');
	assert.equal(fooControllerInstance.get('foo'), 'bar');
});

test('i18nText gets injected into routes', function(assert) {
	var FooRoute = Ember.Route.extend({
		foo: Ember.computed(function() {
			return this.i18nText('foo');
		})
	});
	this.register('route:foo', FooRoute);

	var fooRouteInstance = Ember.getOwner(this).lookup('route:foo');
	assert.equal(fooRouteInstance.get('foo'), 'bar');
});

test('i18nText gets injected into models', function(assert) {
	var FooModel = DS.Model.extend({
		foo: Ember.computed(function() {
			return this.i18nText('foo');
		})
	});
	this.register('model:foo', FooModel);

	Ember.run(()=> {
		var fooModelInstance = Ember.getOwner(this).lookup('service:store').createRecord('foo');
		assert.equal(fooModelInstance.get('foo'), 'bar');
	});
});

test('i18nText gets injected into components', function(assert) {
	var FooComponent = Ember.Component.extend({
		foo: Ember.computed(function() {
			return this.i18nText('foo');
		})
	});
	this.register('component:foo', FooComponent);

	var fooComponentInstance = Ember.getOwner(this).lookup('component:foo');
	assert.equal(fooComponentInstance.get('foo'), 'bar');
});
