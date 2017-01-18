import Ember from 'ember';

export default Ember.Object.extend({
	mergedProperties: ['text','numeric','monetary','time','date'],

	key: 'default',
	
	text: {
		key: 'en',
		
		rules:'default'
	},
	
	_libraries: null,
	
	toString() {
		return this.key;
	},
	
	numeric: {
	
		decimalSymbol: '.',
		
		decimalLength: 2,
		
		groupingSymbol: ',',
			
		groupingLength: 3
	
	},
	
	monetary: {
		
		currency: 'USD',
		
		decimalSymbol: '.',
		
		decimalLength: 2,
		
		groupingSymbol: ',',
			
		groupingLength: 3,
		
		currencies : {
			USD: {
				sign: '$',
				name: 'US Dollar'
			},
			EUR: {
				sign:'€',
				name: 'Euro'
			}
			
		}
	
	},

	time: {
		
		clock: 24,
		
		short: '%H:%M',
		
		long: '%H:%M:%S'
						
	},
	
	date: {
		
		startOfWeek: 1,

		short: '%d/%m/%y',
		
		long: '%d/%m/%Y'
	},
	
	measurement: 'metric'
	
});