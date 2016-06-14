function sprintf() {
    function pad(str, len, chr, leftJustify) {
        var padding = (str.length >= len) ? '' : Array(1 + len - str.length >>> 0).join(chr);
        return leftJustify ? str + padding : padding + str;

    }

    function thousand_separate(value) {
        var value_str = value.toString();
        for (var i=10; i>0; i--) {
            if (value_str === (value_str = value_str.replace(/^(\d+)(\d{3})/, "$1"+sprintf.thousandsSeparator+"$2"))) {
            	break;
            }
        }
        return value_str; 
    }

    function justify(value, prefix, leftJustify, minWidth, zeroPad, htmlSpace) {
        var diff = minWidth - value.length;
        if (diff > 0) {
            var spchar = ' ';
            if (htmlSpace) { spchar = '&nbsp;'; }
            if (leftJustify || !zeroPad) {
                value = pad(value, minWidth, spchar, leftJustify);
            } else {
                value = value.slice(0, prefix.length) + pad('', diff, '0', true) + value.slice(prefix.length);
            }
        }
        return value;
    }

    function formatBaseX(value, base, prefix, leftJustify, minWidth, precision, zeroPad, htmlSpace) {
        // Note: casts negative numbers to positive ones
        var number = value >>> 0;
        prefix = prefix && number && {'2': '0b', '8': '0', '16': '0x'}[base] || '';
        value = prefix + pad(number.toString(base), precision || 0, '0', false);
        return justify(value, prefix, leftJustify, minWidth, zeroPad, htmlSpace);
    }

    function formatString(value, leftJustify, minWidth, precision, zeroPad, htmlSpace) {
        if (precision !== null) {
            value = value.slice(0, precision);
        }
        return justify(value, '', leftJustify, minWidth, zeroPad, htmlSpace);
    }

    var a = arguments, i = 0, format = a[i++];
    
    return format.replace(sprintf.regex, function(substring, valueIndex, flags, minWidth, _, precision, type) {
        if (substring === '%%') { return '%'; }
        // parse flags
        var leftJustify = false, positivePrefix = '', zeroPad = false, prefixBaseX = false, htmlSpace = false, thousandSeparation = false;
        var number,number_str,prefix,parts,textTransform;
        
        for (var j = 0; flags && j < flags.length; j++) {
        	switch (flags.charAt(j)) {
            case ' ': positivePrefix = ' '; break;
            case '+': positivePrefix = '+'; break;
            case '-': leftJustify = true; break;
            case '0': zeroPad = true; break;
            case '#': prefixBaseX = true; break;
            case '&': htmlSpace = true; break;
            case '\'': thousandSeparation = true; break;
        	}
        }

        // parameters may be null, undefined, empty-string or real valued
        // we want to ignore null, undefined and empty-string values

        if (!minWidth) {
            minWidth = 0;
        } 
        else if (minWidth === '*') {
            minWidth = +a[i++];
        } 
        else if (minWidth.charAt(0) === '*') {
            minWidth = +a[minWidth.slice(1, -1)];
        } 
        else {
            minWidth = +minWidth;
        }

        // Note: undocumented perl feature:
        if (minWidth < 0) {
            minWidth = -minWidth;
            leftJustify = true;
        }

        if (!isFinite(minWidth)) {
            throw new Error('sprintf: (minimum-)width must be finite');
        }

        if (!precision) {
            precision = 'fFeE'.indexOf(type) > -1 ? 6 : (type === 'd') ? 0 : void(0);
        } 
        else if (precision === '*') {
            precision = +a[i++];
        } 
        else if (precision.charAt(0) === '*') {
            precision = +a[precision.slice(1, -1)];
        } 
        else {
            precision = +precision;
        }

        // grab value using valueIndex if required?
        var value = valueIndex ? a[valueIndex.slice(0, -1)] : a[i++];

        switch (type) {
        case 's': {
            if (value == null) {
                return '';
            }
            return formatString(String(value), leftJustify, minWidth, precision, zeroPad, htmlSpace);
        }
        case 'c': return formatString(String.fromCharCode(+value), leftJustify, minWidth, precision, zeroPad, htmlSpace);
        case 'b': return formatBaseX(value, 2, prefixBaseX, leftJustify, minWidth, precision, zeroPad,htmlSpace);
        case 'o': return formatBaseX(value, 8, prefixBaseX, leftJustify, minWidth, precision, zeroPad, htmlSpace);
        case 'x': return formatBaseX(value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad, htmlSpace);
        case 'X': return formatBaseX(value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad, htmlSpace).toUpperCase();
        case 'u': return formatBaseX(value, 10, prefixBaseX, leftJustify, minWidth, precision, zeroPad, htmlSpace);
        case 'i': {
          number = parseInt(+value, 10);
          if (isNaN(number)) {
            return '';
          }
          prefix = number < 0 ? '-' : positivePrefix;
          number_str = thousandSeparation ? thousand_separate(String(Math.abs(number))): String(Math.abs(number));
          value = prefix + pad(number_str, precision, '0', false);
          //value = prefix + pad(String(Math.abs(number)), precision, '0', false);
          return justify(value, prefix, leftJustify, minWidth, zeroPad, htmlSpace);
              }
        case 'd': {
          number = Math.round(+value);
          if (isNaN(number)) {
            return '';
          }
          prefix = number < 0 ? '-' : positivePrefix;
          number_str = thousandSeparation ? thousand_separate(String(Math.abs(number))): String(Math.abs(number));
          value = prefix + pad(number_str, precision, '0', false);
          return justify(value, prefix, leftJustify, minWidth, zeroPad, htmlSpace);
              }
        case 'e':
        case 'E':
        case 'f':
        case 'F':
        case 'g':
        case 'G':
                  {
                   number = +value;
                  if (isNaN(number)) {
                      return '';
                  }
                   prefix = number < 0 ? '-' : positivePrefix;
                  var method = ['toExponential', 'toFixed', 'toPrecision']['efg'.indexOf(type.toLowerCase())];
                  textTransform = ['toString', 'toUpperCase']['eEfFgG'.indexOf(type) % 2];
                  number_str = Math.abs(number)[method](precision);
                  
                  // Apply the decimal mark properly by splitting the number by the
                  //   decimalMark, applying thousands separator, and then placing it
                  //   back in.
                  parts = number_str.toString().split('.');
                  parts[0] = thousandSeparation ? thousand_separate(parts[0]) : parts[0];
                  number_str = parts.join(sprintf.decimalMark);
                  
                  value = prefix + number_str;
                  var justified = justify(value, prefix, leftJustify, minWidth, zeroPad, htmlSpace)[textTransform]();
                  
                  return justified;
              }
        case 'p':
        case 'P':
        {
            // make sure number is a number
             number = +value;
            if (isNaN(number)) {
                return '';
            }
            prefix = number < 0 ? '-' : positivePrefix;

            parts = String(Number(Math.abs(number)).toExponential()).split(/e|E/);
            var sd = (parts[0].indexOf('.') !== -1) ? parts[0].length - 1 : String(number).length;
            var zeros = (parts[1] < 0) ? -parts[1] - 1 : 0;
            
            if (Math.abs(number) < 1) {
                if (sd + zeros  <= precision) {
                    value = prefix + Math.abs(number).toPrecision(sd);
                }
                else {
                    if (sd  <= precision - 1) {
                        value = prefix + Math.abs(number).toExponential(sd-1);
                    }
                    else {
                        value = prefix + Math.abs(number).toExponential(precision-1);
                    }
                }
            }
            else {
                var prec = (sd <= precision) ? sd : precision;
                value = prefix + Math.abs(number).toPrecision(prec);
            }
            textTransform = ['toString', 'toUpperCase']['pP'.indexOf(type) % 2];
            return justify(value, prefix, leftJustify, minWidth, zeroPad, htmlSpace)[textTransform]();
        }
        case 'n': return '';
        default: return substring;
        }
    });
}

sprintf.thousandsSeparator = ',';

sprintf.decimalMark = '.';

sprintf.regex = /%%|%(\d+\$)?([-+#0&\' ]*)(\*\d+\$|\*|\d+)?(\.(\*\d+\$|\*|\d+))?([nAscboxXuidfegpEGP])/g;

export default sprintf;