import Ember from 'ember';
import Locale from '../locale';
import {AjaxAdapterMixin} from 'furnace-i18n/mixins/adapters';
export default Ember.CoreObject.extend(AjaxAdapterMixin);