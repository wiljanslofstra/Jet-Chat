var rooms = new Meteor.Collection("rooms");

/*===================================
  ROOMS CONTROLLER
===================================*/

Meteor.subscribe('rooms');

Template.rooms.events({
  'click #add-name': showRoomNameField,
  'keyup #room-name': addRoom,
  'click .rooms-list li': clickRoom
});

/**
 *  All rooms
 *  Return all rooms
 */
Template.rooms.rooms = function() {
  return rooms.find({},{sort: {name: 1}});
};

/**
 *  Add room
 *  Return true if add_room is active
 */
Template.rooms.add_room = function(){
  return (Session.equals('add_room',true));
};

/**
 *  Current room
 *  Return true if current item is the current room
 */
Template.rooms.isCurrentRoom = function() {
  var roomLinkId = this._id;
  var selectedRoomId = Session.get('current_room');
  if (roomLinkId === selectedRoomId) {
    return true;
  } else {
    return false;
  }
};

/**
 *  Show Room Name Field
 *  Shows the input field to create a room
 */
function showRoomNameField(e,t) {
  focusText($('#room-name'));
  Session.set('add_room',true);
}

function focusText(i) {
  i.focus();
  i.select();
}

/**
 *  Create Room
 *  Logic for creating a room
 */
function addRoom(e,t) {
  if(e.which === 13) {
    var roomValue = e.target.value;
    rooms.insert({name:roomValue});
    Session.set('add_room',false);
  }
}

/**
 *  Click Room
 *  Route to the room id
 */
function clickRoom(e,t) {
  var roomId = e.target.id;

  Meteor.Router.to('/room/' + roomId);
  Session.set('current_room', roomId);
}

/**
 *  List Height
 *  Calculate the height of the messages list
 */
function calcMessageListHeight() {
  var messageList = $('.message-list'),
      docHeight = $(window).height() - 204;

  messageList.height(docHeight);
}
