import Ember from 'ember';
function I18nString(str,values) {
	this.str = '' + str;
	if(values!==undefined) {
		Ember.assert('2nd argument of I18nString should be an array',values instanceof Array);
		this.values=values;
	} else {
		this.values=null;
	}
	
	String.call(this,this.str);
	this.toString =  function () {
		return this.str;
	};
}

export default I18nString;