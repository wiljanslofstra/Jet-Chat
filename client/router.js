Meteor.Router.add({
	// Get room by given id
	// TODO: Use room name instead of id
	'/room/:id': function(id) {
		Session.set('current_room',id);
		Session.set('in_room',true);
		return 'messages';
	}
});