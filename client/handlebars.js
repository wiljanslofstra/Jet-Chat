
// Check if is admin
Handlebars.registerHelper('isAdmin', function(showError) {
	var user = Meteor.user();

	if(user != undefined) {
	  if(isAdmin(user)){
	    return true;
	  } else { return false; }
	}
});

// Get current username
Handlebars.registerHelper('username', function(showError) {
	if(Meteor.user()) {
		return Meteor.user().profile.name;
	} else {
		return false;
	}
});

// Function to retrieve isAdmin of current user
function isAdmin(user) {
	if (user.profile.isAdmin && user.profile.isAdmin === true) {
		return true;
	} else { return false; }
}

