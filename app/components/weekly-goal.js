import Ember from 'ember';

export default Ember.Component.extend({
	classNames:'weekly-goal',
	priorityList:function(){
		var source = [];
		for(var i=0;i<this.get('all-goals.length');i++)
		{
			source.push({value:i,text:String(i)})
		}
		return source;
	}.property('all-goals.length'),
	didInsertElement(){
		var self = this;
		$.fn.editable.defaults.mode = 'inline';
		$.fn.editable.defaults.toggle = 'dblclick';
		$.fn.editable.defaults.autotext = 'always';
		
		//xeditable goal
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
		//xeditable priority
		this.calcPriorities();
	},
	goals:function(){
		return this.get('all-goals').filterBy('roleId',this.get('role').id);
	}.property('all-goals.[]'),
	actions:{
		newGoal(){
			var store = this.get('targetObject.store');
			var allGoals = this.get('all-goals');
			var goal = store.createRecord('weekly-goal',{
                 roleId:this.get('role.id'),
                 content:'New goal',
				 priority:0
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
				//xeditable priority
				self.sortPriorities(goal,0)
				self.calcPriorities();
			});
         },
		deleteGoal(id){
			var model = this.get('goals').findBy('id',id);
			this.sortPriorities(model,-1);
			//this.calcPriorities();
			model.destroyRecord();
		}

	},
	calcPriorities(){
		var self = this;
		var priorityEdit = $(this.element.getElementsByClassName('priority-editable'));
		priorityEdit.editable({
			type:'select',
			display:function(){return false;},
			source:function(){return self.get('priorityList')},
			success:function(response,newValue){
			    var id = $(this).data('id');
			    var model = self.get('goals').findBy('id',id);
				//sort anyother model priorities, skip input model for newValue
				self.sortPriorities(model,newValue)
			    model.set('priority',newValue);
			    model.save();
			}
		})
	},
	sortPriorities(currentModel,newPriority)
	{
		var goals = this.get('all-goals').sortBy('priority');

		//give new priority to every model, start from 0
		var lastPriority = 0;
		for(var i=0;i<goals.length;i++)
		{
			// i is proirity
			if(goals[i].get('id') == currentModel.get('id'))
			{
				//skip currentModel
				continue;
			}
			//skip currentModel priority too
			if(lastPriority == newPriority)
			{
				lastPriority++;
			}
			goals[i].set('priority',lastPriority);
			goals[i].save();
			lastPriority ++;
		}
	}
});
