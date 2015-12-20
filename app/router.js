import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('mission-statement',{path:'/'});
  this.route('longterm-goals');
  this.route('weekly-goals');
});

export default Router;
