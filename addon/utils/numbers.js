var zeros=new RegExp('^0+$');

export function numberFromLocale(number,decimalSymbol,groupingSymbol) {
	if(typeof number==='number') {
		return number;
	} else if(typeof number!=='string') {
		number=number.toString();
	}
	
	// Fix comma/decimal mixup
	let mixupSymbol=(decimalSymbol==='.' ? ',' : '.');
	
	// Grouping symbol is a valid symbol in our string and should just be removed
	// We also ignore spaces as a common grouping method
	let filterMatches='\\'+groupingSymbol+' ';
	
	if(number.indexOf(decimalSymbol)===-1) {
		// If we don't have an occurance of the decimal symbol, assume our grouping symbol
		// is switched when it does not appear to be grouping
		let sets=number.split(mixupSymbol);
		if(sets.length<3 && (sets.length===1 || sets[1].length!==3)) {
			if(groupingSymbol===mixupSymbol) {
				filterMatches='\\'+decimalSymbol;
			} else {
				filterMatches+='\\'+decimalSymbol;
			}
			groupingSymbol=decimalSymbol;
			decimalSymbol=mixupSymbol;
		} else if(groupingSymbol!==mixupSymbol) {
			// Occurence of mixupSymbol should be regarded as a grouping symbol
			filterMatches+='\\'+mixupSymbol;
		}
	} else if(number.indexOf(decimalSymbol)<number.indexOf(mixupSymbol)) {
		// If our mixup symbol occurs after the decimal symbol, assume they were switched
		// but only when we have one occurence of mixupSymbol and it as significance
		let sets=number.split(mixupSymbol);
		if(sets.length===2 && !zeros.test(sets[1])) {
			if(groupingSymbol===mixupSymbol) {
				filterMatches='\\'+decimalSymbol;
			} else {
				filterMatches+='\\'+decimalSymbol;
			}
			groupingSymbol=decimalSymbol;
			decimalSymbol=mixupSymbol;
		}
	}
	return Number(number.replace(new RegExp('['+filterMatches+' ]','g'),'').replace(decimalSymbol,'.'));
}
	
export function numberToLocale(number,opts,localeKey) {
	if(typeof number!=='number') {
		number=Number(number);
	}
	// FIXME: do not use default toLocaleString as we can't define the grouping or decimal symbol.
	// Developers should be able to fine tune their locales as they see fit and should not be bound
	// by ECMA/browser interpretation of locales. Furthermore, numbers display could be user configurable
	// using some some sort of user-defined locale.
	return number.toLocaleString(localeKey,opts);
}