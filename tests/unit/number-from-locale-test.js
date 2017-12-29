import {module,test} from 'ember-qunit';
import { numberFromLocale } from 'furnace-i18n/utils/numbers';
module('Unit | Numbers | NumberFromLocale');

function testInput(assert,decimal,grouping,input,result,description="Common input") {
	var test=numberFromLocale(input,decimal,grouping);
	if(isNaN(result)) {
		assert.ok(isNaN(test),`${description} "${input}" => ${result}`);
	} else {
		assert.equal(test,result,`${description} "${input}" => ${result}`);
	}
}

function testDefaults(assert,d,g) {
	testInput(assert,d,g,`0`,0);
	testInput(assert,d,g,`00`,0);
	testInput(assert,d,g,`0 0`,0);
	
	testInput(assert,d,g,`g1`,NaN);
	testInput(assert,d,g,`garbage1`,NaN);
	
	testInput(assert,d,g,`1garbage1`,NaN);
	testInput(assert,d,g,`1-garbage1`,NaN);
	
	testInput(assert,d,g,`1`,1);
	testInput(assert,d,g,`0${d}1`,0.1);
	
	testInput(assert,d,g,`0${d}`,0);
	testInput(assert,d,g,`1${d}`,1);
	
	testInput(assert,d,g,`0${g}`,0);
	testInput(assert,d,g,`1${g}`,1);
	
	testInput(assert,d,g,`10`,10);
	testInput(assert,d,g,`100`,100);
	testInput(assert,d,g,`1000`,1000);
	testInput(assert,d,g,`1${g}000`,1000);
	testInput(assert,d,g,`1000${g}000`,1000000);
	testInput(assert,d,g,`10${g}00${g}000`,1000000);
	testInput(assert,d,g,`1${g}000${g}000`,1000000);
	testInput(assert,d,g,`1${g}0 00${g}000`,1000000);
	testInput(assert,d,g,`1${d}000${g}000`,1);
	
	testInput(assert,d,g,`-1`,-1);
	testInput(assert,d,g,`-0${d}1`,-0.1);
	testInput(assert,d,g,`-10`,-10);
	testInput(assert,d,g,`-100`,-100);
	testInput(assert,d,g,`-1000`,-1000);
	testInput(assert,d,g,`-1${g}000`,-1000);
	testInput(assert,d,g,`-1000${g}000`,-1000000);
	testInput(assert,d,g,`-10${g}00${g}000`,-1000000);
	testInput(assert,d,g,`-1${g}000${g}000`,-1000000);
	testInput(assert,d,g,`-1${g}0 00${g}000`,-1000000);
	testInput(assert,d,g,`-1${d}000${g}000`,-1);
}

function testDGMixup(assert,d,g,mixupChar) {
	if(mixupChar===undefined) {
		mixupChar=g;
	}
	testInput(assert,d,g,`0${mixupChar}1`,0.1,'Fix grouping/decimal mixup');
	testInput(assert,d,g,`0${mixupChar}01`,0.01,'Fix grouping/decimal mixup');
	testInput(assert,d,g,`1${mixupChar}01`,1.01,'Fix grouping/decimal mixup');
	testInput(assert,d,g,`1${mixupChar}0001`,1.0001,'Fix grouping/decimal mixup');
	testInput(assert,d,g,`1${mixupChar}000`,1000,'Do not fix grouping/decimal mixup (proper grouping)');
	testInput(assert,d,g,`1${mixupChar}001`,1001,'Do not fix grouping/decimal mixup (proper grouping)');
	
	testInput(assert,d,g,`1${mixupChar}000`,1000,"Switched grouping/decimal");
	testInput(assert,d,g,`1000${mixupChar}000`,1000000,"Switched grouping/decimal");
	testInput(assert,d,g,`10${mixupChar}00${mixupChar}000`,1000000,"Switched grouping/decimal");
	testInput(assert,d,g,`1${mixupChar}000${mixupChar}000`,1000000,"Switched grouping/decimal");
	testInput(assert,d,g,`1${mixupChar}0 00${mixupChar}000`,1000000,"Switched grouping/decimal");
	
	testInput(assert,d,g,`-0${mixupChar}1`,-0.1,'Fix grouping/decimal mixup');
	testInput(assert,d,g,`-0${mixupChar}01`,-0.01,'Fix grouping/decimal mixup');
	testInput(assert,d,g,`-1${mixupChar}01`,-1.01,'Fix grouping/decimal mixup');
	testInput(assert,d,g,`-1${mixupChar}0001`,-1.0001,'Fix grouping/decimal mixup');
	testInput(assert,d,g,`-1${mixupChar}000`,-1000,'Do not fix grouping/decimal mixup (proper grouping)');
	testInput(assert,d,g,`-1${mixupChar}001`,-1001,'Do not fix grouping/decimal mixup (proper grouping)');
	
	testInput(assert,d,g,`-1${mixupChar}000`,-1000,"Switched grouping/decimal");
	testInput(assert,d,g,`-1000${mixupChar}000`,-1000000,"Switched grouping/decimal");
	testInput(assert,d,g,`-10${mixupChar}00${mixupChar}000`,-1000000,"Switched grouping/decimal");
	testInput(assert,d,g,`-1${mixupChar}000${mixupChar}000`,-1000000,"Switched grouping/decimal");
	testInput(assert,d,g,`-1${mixupChar}0 00${mixupChar}000`,-1000000,"Switched grouping/decimal");
}

test('Point decimals, Comma grouping', function(assert) {
	var d='.';
	var g=',';
	
	testDefaults(assert,d,g);
	
	testDGMixup(assert,d,g);
});

test('Point decimals, Space grouping', function(assert) {
	var d='.';
	var g=' ';
	
	testDefaults(assert,d,g);
	
	testDGMixup(assert,d,g,',');
});


test('Comma decimals, Point grouping', function(assert) {
	var d=',';
	var g='.';
	
	testDefaults(assert,d,g);
	
	testDGMixup(assert,d,g);
});

test('Comma decimals, Space grouping', function(assert) {
	var d=',';
	var g=' ';
	
	testDefaults(assert,d,g);
	
	testDGMixup(assert,d,g,'.');
});

