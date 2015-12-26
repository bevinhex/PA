import Ember from 'ember';

export function times(params/*, hash*/) {
	console.log(params)
  return params;
}

export default Ember.Helper.helper(times);
