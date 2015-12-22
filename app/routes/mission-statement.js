import Ember from 'ember';

export default Ember.Route.extend({
	model(){
		return this.store.findAll('mission-statement').then(function(statements){
			return statements.get('firstObject');
		});
	}
});
