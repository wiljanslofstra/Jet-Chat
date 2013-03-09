var rooms = new Meteor.Collection("rooms");
var files = new Meteor.Collection("files");

/**
 *  Publish the rooms collection
 */
Meteor.publish("rooms", function(){
	return rooms.find({});
});

/**
 *  Publish the rooms.messages collection
 */
Meteor.publish("messages", function(room_id){
	return rooms.find({_id:room_id});
});