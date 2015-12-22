import Ember from 'ember';

export default Ember.Controller.extend({
	actions:{
		tinymceChanged(){
			this.model.save();
		}
	}
});
