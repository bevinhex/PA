import Ember from 'ember';
import DS from 'ember-data';

export default DS.RESTAdapter.extend({
	host:'http://localhost:2403',
	shouldReloadAll(){return true;},
	pathForType:function(type){
		return Ember.String.dasherize(type);
	}
});
