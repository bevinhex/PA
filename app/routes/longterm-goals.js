import Ember from 'ember';

export default Ember.Route.extend({
	model:function(){
		return Ember.RSVP.hash({
			roles:this.store.findAll('role'),
			goals:this.store.findAll('longterm-goal')
		});
	},
	setupController(controller,model){
		this._super(...arguments);
		Ember.set(controller,'roles',model.roles)
		Ember.set(controller,'goals',model.goals)
	},
	actions:{
		newRole(){
			var role = this.store.createRecord('role',{
                 name:'New role'
            });
			role.save();
		}
	}
});
