import Locale from 'furnace-i18n/locale';
export default Locale.extend({
	name: 'English',
	
	key: 'en',
	
	time: {
		
		clock: 12,	
		
		short: '%I:%M %p',
		
		long: '%I:%M:%S %p'
		
	},
	
	date: {
		
		startOfWeek: 0,
		
		short: '%m/%d/%y',
		
		long: '%m/%d/%Y'
	},
	
	measurement: 'imperial'
});