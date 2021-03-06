import { test } from 'ember-qunit';
import moduleForAcceptance from '../helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | Helpers | I18n');

test('no arguments', function(assert) {
	visit('/');

	andThen(function() {
		var span = find('span.one');
		assert.equal(span.text(), 'bar');
	});
});

test('with bound arguments', function(assert) {
	visit('/');

	andThen(function() {
		var span = find('span.two');
		assert.equal(span.text(), 'You are 35 years old');
	});
});

test('with pluralization', function(assert) {
	visit('/');

	andThen(function() {
		var span = find('span.three');
		assert.equal(span.text(), 'There are many people here');
	});
});

test('with pluralization updated from a stream', function(assert){
	visit('/');
	andThen(function(){
		var span = find('span.four');
		assert.equal(span.text(), 'There is 1 dependent person here');
	});

	andThen(function(){
		click('.add-dependent');
	});

	andThen(function(){
		var span = find('span.four');
		assert.equal(span.text(), 'There are 2 dependent people here');
	});

});

test('changing application locale', function(assert) {
	visit('/');

	andThen(function() {
		var span = find('span.two');
		assert.equal(span.text(), 'You are 35 years old');
	});

	andThen(() => {
		this.application.set('locale', 'nl');
	});

	andThen(function() {
		var spanOne = find('span.one');
		assert.equal(spanOne.text(), 'nl_bar');

		var spanTwo = find('span.two');
		assert.equal(spanTwo.text(), 'nl_You are 35 years old');
	});
});

test('nl2br and html safety', function(assert) {
	visit('/');

	andThen(function() {
		var span = find('span.five');
		assert.equal(span.text(), 'TextShouldBreak<BR><div></div>');
		
		var brs = find('span.five br');
		assert.equal(brs.length,2, '2 breaks');
		
		span = find('span.six');
		assert.equal(span.text(), 'TextShouldBreak');
		
		brs = find('span.six br');
		assert.equal(brs.length,3, '3 breaks');
		
		var divs = find('span.six div');
		assert.equal(divs.length,1, '1 div');
	});
});
