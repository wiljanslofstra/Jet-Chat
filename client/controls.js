Template.controls.events({
	'click #logout': function() {
		// Logout current user
		Meteor.logout(function(err){
			if(error) {
				console.log(error);
			}
		});
	}
});

/**
 *  Check if user is logged in
 */
Template.controls.isLoggedIn = function() {
	return (Meteor.userId() != null);
}