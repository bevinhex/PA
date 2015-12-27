import Ember from 'ember';

export default Ember.Component.extend({
	classNames:'table-cell',
	didInsertElement(){
		$(this.element.getElementsByClassName('event')).tooltip();	
	},
	dragStart(event){
		event.dataTransfer.setData('text/data',$(event.target).data('id'));
	},
	dragOver(event){
		event.preventDefault();
	},
	drop(event){
		var id = event.dataTransfer.getData('text/data');
		var goals = this.get('goals');
		var model = goals.findBy('id',id)
		model.set('calendarLoc',this.get('id'));
		var self = this;
		model.save()
			.then(function(){
				$(self.element.getElementsByClassName('event')).tooltip();	
		});
	},
	myGoals: Ember.computed('goals.@each.calendarLoc',function(){
		return this.get('goals').filterBy('calendarLoc',this.get('id'));
	}),
	id:Ember.computed('rowId', 'colId', function() {
	    return this.get('rowId')+this.get('colId')
	})
		
});
