import Ember from 'ember';

export default Ember.Component.extend({
	classNames:'role-goal',
	didInsertElement(){
		var self = this;
		$.fn.editable.defaults.mode = 'inline';
		var roleEdit = $(this.element.getElementsByClassName('role-editable'));
		roleEdit.editable({
			type:'text',
			display:function(){return false;},
			success:function(response,newValue){
				var role = self.get('role');
				role.set('name',newValue);
				role.save();
			}
		});
		var goalEdit = $(this.element.getElementsByClassName('goal-editable'));
		goalEdit.editable({
			type:'text',
			display:function(){return false;},
			success:function(response,newValue){
				var id = $(this).data('id');
				var model = self.get('goals').findBy('id',id);
				model.set('content',newValue);
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

			//destroy longterm goals within to this role
			var goals = this.get('goals');
			while(goals.length)
			{
				goals.pop().destroyRecord();
			}

			//destroy weekly records belong to this role
			store.query('weekly-goal',{roleId:this.get('role.id')})
				.then(function(models){
				models.forEach(function(item)
				{
					item.destroyRecord();
				});
			});

			//destroy the role 
			this.get('role').destroyRecord();
		},
		newGoal(){
			var store = this.get('targetObject.store');
			var allGoals = this.get('all-goals');
			var goal = store.createRecord('longterm-goal',{
                 roleId:this.get('role.id'),
                 content:'New goal',
            })
			var self = this;
			goal.save().then(function(){
				var goalEdit = $(self.element.getElementsByClassName('goal-editable'));
				goalEdit.editable({
					type:'text',
					display:function(){return false;},
					success:function(response,newValue){
						var id = $(this).data('id');
						var model = self.get('goals').findBy('id',id);
						model.set('content',newValue);
						model.save();
					}
				});
			});
         },
		deleteGoal(id){
			var model = this.get('goals').findBy('id',id);
			model.destroyRecord();
		}

	}
});
