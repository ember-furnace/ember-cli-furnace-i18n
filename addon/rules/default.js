import base from 'furnace-i18n/rules/base';

export default function(value, result, path, countryCode) {
	return base(['one', 'other'], value, result, path, countryCode, function(value) {
		switch(value) {
			case 1: return 'one';
			default: return 'other';
		}
	});
}
