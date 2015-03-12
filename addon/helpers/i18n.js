import streamCreate from 'furnace-i18n/lib/stream';

export default function i18nHelper(params, hash, options, env) {
	var path = params.shift();
	var container = this.container;
	var stream = container.lookup('i18n:stream');
	if(hash.attributes) {
		var attributes=hash.attributes.value();
		if(attributes && attributes.length) {
			for(var i=0;i<attributes.length;i++) {
				var index=i;
				var attrStream = streamCreate(function() {
					var attributes=hash.attributes.value();
					return attributes[index];
				});
				attrStream.subscribeTo(hash.attributes);
				params.push(attrStream);
			}
		}
	}
	var _stream=stream(path,params);
	
	this.on('willClearRender',function(){
		_stream.destroy();
	});
	return _stream;
}
