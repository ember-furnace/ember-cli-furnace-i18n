import Ember from 'ember';

var AbstractAdapterMixin = Ember.Mixin.create({
	lookupLocale() {
		Ember.assert('furnace-i18n: adapter method lookupLocale not implemented!');
	},
	
	lookupLibrary() {
		Ember.assert('furnace-i18n: adapter method lookupLibrary not implemented!');
	}
	
});

var LocalAdapterMixin = Ember.Mixin.create(AbstractAdapterMixin,{
	singletons: true,
	
	lookupLocale(localeKey) {
		return Ember.getOwner(this).lookup('locale:' + localeKey,{singleton: this.singletons});
	},

	lookupLibrary(locale,path) {
		return Ember.getOwner(this).lookup('locale:' + locale.get('text.key')+'.'+path,{singleton: this.singletons}) || null;
	}
})

var AjaxAdapterMixin = Ember.Mixin.create(AbstractAdapterMixin,{
	ajax : Ember.inject.service(),
	
	locales: 'adhoc',
	
	libraries: 'adhoc',
	
	_cache : null,
	
	_queues : null,
	
	_promise : null,
	
	init() {
		this._super(...arguments);
		this._cache={};
		this._queues=Ember.A();
	},
	
	lookupLocale(localeKey) {
		var adapter=this;
		var service=this.get('service');
		var locale= Ember.getOwner(this).lookup('locale:' + localeKey);
		if(locale && this.locales==='adhoc') {
			return locale;
		}
		if(!locale && this.locales==='never') {
			throw new Error('No locale for '+localeKey);
		}


		var promise = this.get('ajax').request('locales/'+localeKey).then(function(data){			
			if(data.locale) {
				if(data.locale.libraries) {
					adapter._cache[localeKey]=data.locale.libraries;
					delete data.locale.libraries;
				}
			}
			if(!locale) {
				locale=Locale.create(Ember.getOwner(adapter).ownerInjection(),{
					key:localeKey
				});
				Ember.merge(locale,data.locale);
				return locale;
			} else {
				Ember.merge(locale,data.locale);
				locale._libraries={};
				service._didUpdateLocale(locale);
			}
		});
		
		if(!locale) {			
			return promise;
		}
		return locale;
	},
	
	lookupLibrary(locale,path) {
		var local=Ember.getOwner(this).lookup('locale:' + locale.get('text.key')+'.'+path);
		
		var key=locale.get('key');		
		var cache=this._cache;
		if(!cache[key]) {
			cache[key]={};
		}	
		if(!cache[key][path]) {
			if((this.libraries==='adhoc' && !local) || this.libraries==='always') {
				var queue = this._appendToQueue(key,path);
				return queue.promise.then(function() {
					Ember.merge(local,cache[key][path]);
					return local;
				});
			} else{
				cache[key][path]={};
			}
		}
		if(!local) {
			local={};
		} 
		Ember.merge(local,cache[key][path]);
		return local;
	},
	
	_createQueue(localeKey,path) {
		var adapter=this;
		var queue={			
			processed: false,
			paths: Ember.A(),
			localeKey: localeKey
		};
		queue.paths.push(path);
		this._queues.push(queue);
		queue.promise = new Ember.RSVP.Promise(function(resolve,reject) {
			Ember.run.schedule('actions',adapter,adapter._processQueue,queue,resolve,reject);
		});
		return queue;
	},
	
	_appendToQueue(localeKey,path) {
		var queue=this._queues.find(function(queue) {
			return (queue.localeKey===localeKey && queue.paths.includes(path));
		});
		if(queue) {
			return queue;
		} else {
			queue=this._queues.find(function(queue) {
				return (queue.localeKey===localeKey && queue.processed===false);
			});	
			if(queue) {
				queue.paths.push(path);
				return queue;
			}
		}
		return this._createQueue(localeKey,path);
	},
	
	_processQueue(queue,resolve,reject) {
		var adapter=this;
		queue.processed=true;
		this.get('ajax').request('locales/'+queue.localeKey+'?paths[]='+queue.paths.join('&paths[]=')).then(function(data){
			adapter.handleLibraryResponse(queue,data);
			resolve();
		}).catch(function(e) {
			reject(e);
		}).finally(function(test) {
			adapter._queues.removeObject(queue);
		});
	},
	
	handleLibraryResponse(queue,payload) {
		if(!payload.locale) {
			throw new Error('Invalid response, missing locale information');
		}
		if(payload.locale.key && payload.locale.key!==queue.localeKey) {
			throw new Error('Invalid response, got key "'+payload.locale.key+'" for key "'+queue.localeKey+'"');
		}
		for(var key in payload.locale.libraries) {
			this._cache[queue.localeKey][key]=payload.locale.libraries[key];
		}
	}
});

export {AbstractAdapterMixin,LocalAdapterMixin,AjaxAdapterMixin}