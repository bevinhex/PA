import Ember from 'ember';

export default Ember.Component.extend({
	classNames:'role-goal',
	willDestroyElement(){
	},
	didInsertElement(){
		console.log('didInsertElement')
		var self = this;
		$.fn.editable.defaults.mode = 'inline';
		var roleEdit = $(this.element.getElementsByClassName('role-editable'));
		roleEdit.editable({
			type:'text',
			display:function(){return false;},
			success:function(response,newValue){
				console.log('roleEdit')
				var role = self.get('role');
				role.set('name',newValue);
				role.save();
			}
		});
		var goalEdit = $(this.element.getElementsByClassName('goal-editable'));
		goalEdit.editable({
			type:'text',
			success:function(response,newValue){
				console.log('goalEdit')
				var id = $(this).data('id');
				var model = self.get('goals').findBy('id',id);
				model.set('name',newValue);
				model.save();
			}
		});
	},
	goals:function(){
		return this.get('all-goals').filterBy('roleId',this.get('role').id);
	}.property('all-goals.[]'),
	actions:{
		deleteRole(){
			var store = this.get('targetObject.store');

			var goals = this.get('goals');
			while(goals.length)
			{
				goals.pop().destroyRecord();
			}
			this.get('role').destroyRecord();
		},
		newGoal(){
			var store = this.get('targetObject.store');
			var allGoals = this.get('all-goals');
			var goal = store.createRecord('longterm-goal',{
                 roleId:this.get('role.id'),
                 name:'New goal'
            })
			goal.save();
         }
	}
});
