import Ember from 'ember';
import i18n from 'furnace-i18n';
export function initialize(instance) {
	i18n.initialize(instance);
	
};

export default {
  name: 'i18n',
  initialize: initialize
};
