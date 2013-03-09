Template.controls.events({
	'click #logout': function(e,t) {
		e.preventDefault();
		// Logout current user
		Meteor.logout(function(err){
			if(err) {
				console.log(err);
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