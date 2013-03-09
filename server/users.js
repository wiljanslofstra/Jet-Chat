/*===================================
	USER MODEL
===================================*/

Accounts.onCreateUser(function(options,user){
	
	// Add a few fields to the user
	user.profile = options.profile || {};
	user.profile.karma = 0;
	user.profile.karmaGiven = [];
	user.profile.geo = {lat:null,long:null};

	// Check if email is given
	if (options.email) {
		user.profile.email = options.email;
	}

	// Check if profile name is given, else use username
	if (!user.profile.name) {
		user.profile.name = user.username;
	}

	// If user profile name is Wiljan Slofstra, make admin !!!
	if ( user.profile.name == 'Wiljan Slofstra' ) {
		user.profile.isAdmin = true;
	}

	// Return the user, why not?
	return user;
});