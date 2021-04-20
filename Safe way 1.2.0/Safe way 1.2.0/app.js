/*AIzaSyDaBedHCtSd1IgXvVKJqDF2PQKciEjjChc*/
/*AIzaSyBIETB6uHrfhWM7KFzpiwuCEHletEXU2sk - developer*/

function initMap() {
  const map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 55.785795, lng: 49.121864 },
    zoom: 10
  });
  const card = document.getElementById("pac-card");
  const input = document.getElementById("pac-input");
  const login_but = document.getElementById("login_but");
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(login_but);
  map.controls[google.maps.ControlPosition.TOP_RIGHT].push(card);
  const autocomplete = new google.maps.places.Autocomplete(input);
  
  autocomplete.bindTo("bounds", map);
  
  const infowindow = new google.maps.InfoWindow();
  const infowindowContent = document.getElementById("infowindow-content");
  infowindow.setContent(infowindowContent);
  
  
  //Here will be the data set of
  //all points which will be predefined
		var features = [
          {
            position: {lat: 55.780795, lng: 49.127864},
            type: 'normal',
			message: "Amount of accidents: 0"
          }, {
            position: {lat: 55.787795, lng: 49.177864},
            type: 'middle',
			message: "Amount of accidents: 0"
          }, {
            position: {lat: 55.780795, lng: 49.197864},
            type: 'middle',
			message: "Amount of accidents: 0"
          }, {
            position: {lat: 55.790795, lng: 49.127864},
            type: 'critical',
			message: "Amount of accidents: 0"
          }, {
            position: {lat: 55.700795, lng: 49.1677864},
            type: 'normal',
			message: "Amount of accidents: 0"
          }, {
            position: {lat: 55.720795, lng: 49.167864},
            type: 'critical',
			message: "Amount of accidents: 0"
          }
        ];

		var contentStrs = [];
		for (var i =0;i<features.length;i++){
			var contentString = '<div id="content">'+
			'<div id="siteNotice">'+
			'</div>'+
			'<h3 class="firstHeading">Place: '+ features[i].type+'</h3>'+
			'<div id="bodyContent">'+
			'<p>'+ features[i].message+ '</p>'+
			'</div>'+
			'</div>';
			contentStrs.push(contentString);
		}
		
		var markers = [];
		for (var i =0;i<features.length;i++) {

		var image = './images/marker_'+features[i].type+'.png';
		var infowindow_place = new google.maps.InfoWindow();
		var marker = new google.maps.Marker({
			position: features[i].position,
			icon: image,
			map: map
		});
		markers.push(marker);
		
		google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
                infowindow_place.setContent(contentStrs[i]);
                infowindow_place.open(map, marker);
            }
        })(marker, i));
		
	}
  
  autocomplete.addListener("place_changed", () => {
    infowindow.close();
    marker.setVisible(false);
    const place = autocomplete.getPlace();

    if (!place.geometry) {
      window.alert("No details available for input: '" + place.name + "'");
      return;
    }
	
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(10);
    }
    marker.setPosition(place.geometry.location);
    marker.setVisible(true);
    let address = "";

    if (place.address_components) {
      address = [
        (place.address_components[0] &&
          place.address_components[0].short_name) ||
          "",
        (place.address_components[1] &&
          place.address_components[1].short_name) ||
          "",
        (place.address_components[2] &&
          place.address_components[2].short_name) ||
          ""
      ].join(" ");
    }
    infowindowContent.children["place-icon"].src = place.icon;
    infowindowContent.children["place-name"].textContent = place.name;
    infowindowContent.children["place-address"].textContent = address;
    infowindow.open(map, marker);
  });
  
  var infoWindow_use_loc = new google.maps.InfoWindow;

        // Try HTML5 geolocation.
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };

            infoWindow_use_loc.setPosition(pos);
            infoWindow_use_loc.setContent('Location found.');
            infoWindow_use_loc.open(map);
            map.setCenter(pos);
          }, function() {
            handleLocationError(true, infoWindow_use_loc, map.getCenter());
          });
        } else {
          // Browser doesn't support Geolocation
          handleLocationError(false, infoWindow_use_loc, map.getCenter());
        }
}

function handleLocationError(browserHasGeolocation, infoWindow_use_loc, pos) {
        infoWindow_use_loc.setPosition(pos);
        infoWindow_use_loc.setContent(browserHasGeolocation ?
                              'Error: The Geolocation service failed.' :
                              'Error: Your browser doesn\'t support geolocation.');
        infoWindow_use_loc.open(map);
      }