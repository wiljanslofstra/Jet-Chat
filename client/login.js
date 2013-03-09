/*===================================
	LOGIN CONTROLLER
===================================*/

Session.set('logged_in', false);
Session.set('login', true);

Template.login.events({
	'click #twitter': twitterLogin,
	'click #facebook': facebookLogin
});

/**
 *	Logged In
 *	Return true if current user is logged in
 */
Template.login.isLoggedIn = function() {
	return (Meteor.userId() != null);
};

/**
 *	Twitter Login
 *	Handle twitter login system
 */
function twitterLogin(e,t) {
	e.preventDefault();
	Meteor.loginWithTwitter(function(error){
		if (error) {
			return console.log(error);
		}
		Session.set('logged_in', true);
	});
}

/**
 *	Facebook login
 *	Handle facebook login system
 */
function facebookLogin(e,t) {
	e.preventDefault();
	Meteor.loginWithFacebook(function(error){
		if (error) {
			return console.log(error);
		}
		Session.set('logged_in', true);
	});
}

