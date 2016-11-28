function I18nString() {
	this.str = '' + arguments[0];
	String.call(this,this.str);
	this.toString =  function () {
	    return this.str;
	};
}

export default I18nString;