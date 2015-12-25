import Ember from 'ember';

export default Ember.Route.extend({
	model(){
		return Ember.RSVP.hash({
			roles:this.store.findAll('role'),
			goals:this.store.findAll('weekly-goal')
		});
	},
	setupController(controller,model){
		this._super(...arguments);
		Ember.set(controller,'roles',model.roles)
		Ember.set(controller,'goals',model.goals)
	},
});
