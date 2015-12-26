import DS from 'ember-data';

export default DS.Model.extend({
  roleId: DS.attr('string'),
  priority: DS.attr('number'),
  content: DS.attr('string'),
  calendarLoc:DS.attr('string')
});
