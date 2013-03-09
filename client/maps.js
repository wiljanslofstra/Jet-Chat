/* jQuery googleMap Copyright Dylan Verheul <dylan@dyve.net>
 * Licensed like jQuery, see http://docs.jquery.com/License
 */

$.googleMap = {
	maps: {},
	marker: function(m) {
		if (!m) {
			return null;
		} else if (m.lat == null && m.lng == null) {
			return $.googleMap.marker($.googleMap.readFromGeo(m));
		} else {
			var marker = new GMarker(new GLatLng(m.lat, m.lng));
			if (m.txt) {
				GEvent.addListener(marker, "click", function() {
    				marker.openInfoWindowHtml(m.txt);
  				});
			}
			return marker;
		}
	},
	readFromGeo: function(elem) {
		var latElem = $(".latitude", elem)[0];
		var lngElem = $(".longitude", elem)[0];
		if (latElem && lngElem) {
			return { lat:parseFloat($(latElem).attr("title")), lng:parseFloat($(lngElem).attr("title")), txt:$(elem).attr("title") }
		} else {
			return null;
		}
	},
	mapNum: 1
};

$.fn.googleMap = function(lat, lng, zoom, options) {

	// If we aren't supported, we're done
	if (!window.GBrowserIsCompatible || !GBrowserIsCompatible()) return this;

	// Default values make for easy debugging
	if (lat == null) lat = 37.4419;
	if (lng == null) lng = -122.1419;
	if (!zoom) zoom = 13;

	// Sanitize options
	if (!options || typeof options != 'object')	options = {};
	options.mapOptions = options.mapOptions || {};
	options.markers = options.markers || [];
	options.controls = options.controls || {};

	// Map all our elements
	return this.each(function() {
		// Make sure we have a valid id
		if (!this.id) this.id = "gMap" + $.googleMap.mapNum++;
		// Create a map and a shortcut to it at the same time
		var map = $.googleMap.maps[this.id] = new GMap2(this, options.mapOptions);
		// Center and zoom the map
       	map.setCenter(new GLatLng(lat, lng), zoom);
       	// Add controls to our map
       	for (var i = 0; i < options.controls.length; i++) {
	       	var c = options.controls[i];
	       	eval("map.addControl(new " + c + "());");
       	}
       	// If we have markers, put them on the map
       	var marker = null;
       	for (var i = 0; i < options.markers.length; i++) {
	       	if (marker = $.googleMap.marker(options.markers[i])) map.addOverlay(marker);
       	}
    });

};