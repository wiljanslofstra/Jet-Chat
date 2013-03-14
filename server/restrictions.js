Meteor.startup(function () {
	/**
	 * Rooms restrictions
	 * Allow everyone to insert a new room
	 * Only admin: update and remove rooms
	 */
	rooms.allow({
		insert: function(userId, doc) {
			return true;
		},
		update: function(userId, docs, fields, modifier) {
			// TODO: Test for admin or current user
			return true;
		},
		remove: function(userId, docs) {
			// TODO: Test for admin or current user
			return onlyIfAdmin(userId);
		}
	});

	/**
	 *  All actions to the users collection needs admin access
	 */
	Meteor.users.allow({
		remove: function(userId,docs) {
			return onlyIfAdmin(userId);
		},
		update: function(userId, docs, fields, modifier) {
			return onlyIfAdmin(userId);
		},
		insert: function(userId, docs) {
			return onlyIfAdmin(userId);
		}
	});
});

/**
 *  function to check for admin access
 */
function onlyIfAdmin(userId) {
	var isAdmin = isAdminById(userId);
	if (isAdmin) {
		return true;
	}
	return false;
}

/**
 *  Check for admin access by id
 */
function isAdminById(userId) {
	var user = Meteor.users.findOne({_id: userId});
	if (user && user.profile.isAdmin) {
		return true;
	}
	return false;
}

