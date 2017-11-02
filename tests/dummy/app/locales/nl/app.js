import I18n from 'furnace-i18n';

export default I18n.Translation.extend({
	foo: 'nl_bar',
	age: 'nl_You are %1$s years old',
	person: {
		one: 'nl_There is one person here',
		other: 'nl_There are many people here'
	},
	dependentPerson: {
		one: 'nl_There is %1$s dependent person here',
		other: 'nl_There are %1$s dependent people here'
	}
});
