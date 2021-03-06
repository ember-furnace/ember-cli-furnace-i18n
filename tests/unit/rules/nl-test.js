import Ember from 'ember';
import rules from 'furnace-i18n/rules/nl';
import cldrTest from '../../helpers/cldr';
import {module,test} from 'ember-qunit';

var result = {
	one: 'one',
	other: 'other'
};

var path = 'result';
var countryCode = 'nl';

module('Unit | CLDR Rules | Dutch ('+countryCode+')');

test('one', function(assert) {
	cldrTest(assert, 1, 'one', rules, result, path, countryCode);
});

test('other', function(assert) {
	cldrTest(assert, 0, 'other', rules, result, path, countryCode);
	cldrTest(assert, 2, 'other', rules, result, path, countryCode);
});

test('assertion is thrown if no valid keys exist', function(assert) {
	var badResult = {foo: 'bar'};
	var count = 0;
	var oldAssert = Ember.assert;
	Ember.assert = function() {
		count += 1;
	};

	rules(0, badResult, path, countryCode);
	assert.equal(count, 1);
	Ember.assert = oldAssert;
});

test('assertion is thrown if non-numeric value is passed ', function(assert) {
	var count = 0;
	var oldAssert = Ember.assert;
	Ember.assert = function() {
		count += 1;
	};

	rules('0', result, path, countryCode);
	assert.equal(count, 1);
	Ember.assert = oldAssert;
});
