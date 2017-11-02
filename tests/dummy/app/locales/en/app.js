import I18n from 'furnace-i18n';

export default I18n.Translation.extend({
	foo: 'bar',
	age: 'You are %1$s years old',
	person: {
		one: 'There is one person here',
		other: 'There are many people here'
	},
	dependentPerson: {
		one: 'There is %1$s dependent person here',
		other: 'There are %1$s dependent people here'
	}
});
