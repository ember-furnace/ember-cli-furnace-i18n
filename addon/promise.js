import Ember from 'ember';
/**
 * @module furnace
 * @submodule furnace-i18n
 */

/**
 * Object to abstract translation keys to be fulfilled by a promise  
 * 
 * @class Promise
 * @namespace Furnace.I18n
 * @extends Ember.ObjectProxy
 */
export default Ember.ObjectProxy.extend(Ember.PromiseProxyMixin)