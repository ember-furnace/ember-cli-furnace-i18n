import {module,test} from 'ember-qunit';
import { numberToLocale } from 'furnace-i18n/utils/numbers';
module('Unit | Numbers | NumberToLocale');

function testInput(assert,locale,input,result,description="Common value") {
	var opts={};
	assert.equal(numberToLocale(input,opts,locale),result,`${description} ${input}`);
}

test('EN', function(assert) {
	testInput(assert,'en',0,"0");
//	testInput(assert,'en',.01,"0.01");
//	testInput(assert,'en',1,"1");
//	testInput(assert,'en',1.01,"1.01");
//	testInput(assert,'en',1000,"1,000");
//	testInput(assert,'en',1000.1,"1,000.1");
//	testInput(assert,'en',1000000,"1,000,000");
});

test('NL', function(assert) {
	testInput(assert,'nl',0,"0");
//	testInput(assert,'nl',.01,"0,01");
//	testInput(assert,'nl',1,"1");
//	testInput(assert,'nl',1.01,"1,01");
//	testInput(assert,'nl',1000,"1.000");
//	testInput(assert,'nl-NL',1000.1,"1.000,1");
//	testInput(assert,'nl',1000000,"1.000.000");
});

