Meteor.startup(function () {
	Meteor.methods({
		
		/**
		 *  Add Karma
		 *  Add karma to given userId
		 */
		addKarma: function(id, userId) {
			if (id === userId) { 
				return false; 
			}
			var current = Meteor.users.findOne({_id:id});
			var karma = current.profile.karma;
			var karmaGiven = current.profile.karmaGiven;
			if ( _.contains(karmaGiven, userId)) {
				return false;
			} else {
				var update = Meteor.users.update({_id:id},{$set: { "profile.karma":karma+1}, $addToSet: { "profile.karmaGiven": userId}});
				return true;
			}
		},
		/**
		 *  Save File to Server
		 *  Add given file to the server with nodes filesystem
		 */
		saveFile: function(blob, name, path, encoding) {
			var path = cleanPath(path), fs = __meteor_bootstrap__.require('fs'),
				name = cleanName(name || 'file'), encoding = encoding || 'binary',
				chroot = Meteor.chroot || 'public';

			// Clean up the path. Remove any initial and final '/' -we prefix them-,
			// any sort of attempt to go to the parent directory '..' and any empty directories in
			// between '/////' - which may happen after removing '..'
			path = chroot + (path ? '/' + path + '/' : '/');

			// TODO Add file existance checks, etc...
			fs.writeFile(path + name, blob, encoding, function(err) {
				if (err) {
					throw (new Meteor.Error(500, 'Failed to save file.', err));
				} else {
					console.log('The file ' + name + ' (' + encoding + ') was saved to ' + path);
				}
			}); 

			function cleanPath(str) {
				if (str) {
				return str.replace(/\.\./g,'').replace(/\/+/g,'').
				  replace(/^\/+/,'').replace(/\/+$/,'');
				}
			}

			function cleanName(str) {
				return str.replace(/\.\./g,'').replace(/\//g,'');
			}
		}
	});
});