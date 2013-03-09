var files = new Meteor.Collection("files");

/*===================================
	MESSAGES CONTROLLER
===================================*/

/**
 *  Autorun
 *  Check for changes on the messages publish
 */
Meteor.autorun(function() {
  Meteor.subscribe('messages',
    Session.get('current_room'));
});

Template.messages.events({
	'keyup #message-text': keyUpMessage,
	'click .icon-heart-empty': giveKarma,
	'click .icon-map-marker': mapOpen,
	'change #file-upload': fileUpload
});

/**
 *  Room name
 *  Return the current room name if any
 */
Template.messages.room_name = function() {
	// Get currentRoom id from session
	var curRoomId = Session.get('current_room');

	// Find current room
	var curRoom = rooms.findOne({_id:curRoomId});

	// If has no room return nothing, else return room name
	if (curRoom != undefined) {
		return curRoom.name;
	} else { return false; }
};

/**
 *  In Room?
 *  Returns true if user is currently in an room
 */
Template.messages.in_room = function() {
	return (Session.equals('in_room',true));
};

/**
 *  Messages
 *  Return all messages to the view
 */
Template.messages.messages = function() {
	// Get current room
	var curRoom = rooms.findOne({_id:Session.get('current_room')});

	// if curRoom is defined return messages
	if (curRoom != undefined) {
		return curRoom.messages;
	} else { return false; }
};

/**
 *  Current User
 *  Return the current user
 */
Template.messages.user = function() {
	return this.author;
};

/**
 *  Rendered
 *  Called after the messages template has rendered
 */
Template.messages.rendered = function() {
	// Get current geolocation position
	var pos = navigator.geolocation.getCurrentPosition(handle_geolocation_query);

	// Calculate message list height
	calcMessageListHeight();

	// Message list object
	var messageList = $('.message-list');

	// Get the cursor to the current room
	var query = rooms.find({_id:Session.get('current_room')});

	// Observe changes to current room
	var handle = query.observeChanges({
		added: function (id, user) {
			var messageListHeight = messageList.height();

      		messageList.animate({scrollTop: messageListHeight}, 0);
		}
	});
}

/**
 *  GeoLocation
 *  Handle geolocation, is called from the rendered function
 */
function handle_geolocation_query(pos) {
	// Get positions and dump them into this awesome object
	var position = {lat: pos.coords.latitude, long: pos.coords.longitude};

	// Add the geolocation data to the current user
	var curUser = Meteor.users.update({ _id:Meteor.userId },{ $set:{"profile.geo.lat":position.lat, "profile.geo.long":position.long} });
}

/**
 *  View geolocation
 *  Return geolocation for author of message
 */
Template.messages.geoLocation = function() {
	// Get geolocaton of current author
	var author = this.author;
	var user = Meteor.users.findOne({"profile.name":author});

	// Return true if author has geolocation, else false
	if (user != undefined && user.profile.geo.lat != null && user.profile.geo.long != null) {
		return true;
	} else {
		return false;
	}
}

/**
 *  Latitude
 *  Return the latitude value to the view
 */
Template.messages.lat = function() {
	// Get current author latitude position
	var author = this.author;
	var user = Meteor.users.findOne({"profile.name":author});
	var geoLat = user.profile.geo.lat;
	return geoLat;
}

/**
 *  Longitude
 *  Return the longitude to the view
 */
Template.messages.long = function() {
	// Get current author longitude position
	var author = this.author;
	var user = Meteor.users.findOne({"profile.name":author});
	var geoLong = user.profile.geo.long;
	return geoLong;
}

/**
 *  Get Author
 *  Get the current username, of anonymous is none is given
 */
function getAuthor() {
	var username = (Meteor.user()) ? Meteor.user().profile.name : 'Anonymous';
	return username;
}

/**
 *  Key Up Event Handler
 *  Test for an 'enter' on the message input field, and add to collection
 */
function keyUpMessage(e,t) {
	if (e.which === 13) {
		// Get the input value
		var messageVal = e.target.value;
		
		// Add message to room collection
		var author = rooms.update({_id:Session.get('current_room')},
			{$addToSet:{messages:{message:messageVal,author:getAuthor()}}});

		// Set value to empty string
		e.target.value = '';
	}
}

/**
 *  Give Karma
 *  Give clicked message author +1 karma
 */
function giveKarma(e,t) {
	var author = this.author;

	// Get all users
	var user = Meteor.users.find({}).fetch();

	// Loop through users
	for(var i = 0; i < user.length; i++) {
		
		// If current user is same as the author
		if(user[i].profile.name === author) {
			
			// Get current id
			var thisId = user[i]._id;
			
			// Call addKarma method on the server
			Meteor.call('addKarma', thisId, Meteor.userId(), function(err,res){
				// If all goes well change heart icon
				if(res === true) {
					e.target.className = 'icon-heart hearted';
				}
			});
		}
	}
}

/**
 * 	TODO ==================
 *  File Upload
 *  Handle file upload
 */
function fileUpload(e,t) {

	// Loop through all files selected by input field
	_.each(e.srcElement.files, function(file) {
		Meteor.saveFile(file, file.name);
    });

}

/**
 *  Map Open
 *  Create google map instance on click
 */
function mapOpen(e,t) {
	// Find #map element
	var target = $(e.target).find('#map');

	// Toggle visibility
	target.toggle();

	// Get data attributes of lat and long
	var lat = target.data('lat'),
		longi = target.data('long');

	// Add the googlemaps in #map element
	target.googleMap(lat, longi, 15);
}

/**
 *  Resize event
 *  Calculate message list height on resize
 */
$(document).ready(function(){
	$(window).resize(function(e) {
		calcMessageListHeight();
	});

	calcMessageListHeight();
});



