tracker_active = false;

function start_track() {
	var but_tracker = document.getElementById("but_tracker_img");
	if (tracker_active) {
		but_tracker.src='images/but_tracker.png';
		tracker_active = false;
		return;
	}
	else {
		but_tracker.src='images/but_tracker_active.png';
		tracker_active = true;
	}
		
	const initialPosition = { lat: 55.785795, lng: 49.121864 };
	const marker = createMarker({ map, position: initialPosition });

	let watchId = trackLocation({
    onSuccess: ({ coords: { latitude: lat, longitude: lng } }) => {
		marker.setPosition({lat, lng});
        
		var b = false;
		var i =0;
		var dist=0;
		for (i =0;i<markers_concentarion.length;i++){
			dist = distanceTo(lat, lng, markers_concentarion[i].position.lat(), markers_concentarion[i].position.lng());

			if (dist<=100) {
				b = true;
				break;
			}
		}
		if (b) document.getElementById("alert").style.visibility = "visible";
    },
    onError: err => {
    }
  });
}

function distanceTo(lat1, lon1, lat2, lon2) {
      var rlat1 = Math.PI * lat1/180;
      var rlat2 = Math.PI * lat2/180;
      var rlon1 = Math.PI * lon1/180;
      var rlon2 = Math.PI * lon2/180;
      var theta = lon1-lon2;
      var rtheta = Math.PI * theta/180;
      var dist = Math.sin(rlat1) * Math.sin(rlat2) + Math.cos(rlat1) * Math.cos(rlat2) * Math.cos(rtheta);
      dist = Math.acos(dist);
      dist = dist * 180/Math.PI;
      dist = dist * 60 * 1.1515;
      return dist* 1.609344;
}

const createMarker = ({ map, position }) => {
  return new google.maps.Marker({ map, position });
};

const trackLocation = ({ onSuccess, onError = () => { } }) => {
  if ('geolocation' in navigator === false) {
    alert("Error");
  }

  return navigator.geolocation.watchPosition(onSuccess, onError, {
    timeout: 4000,
    maximumAge: 0
  });
};

const getPositionErrorMessage = code => {
  switch (code) {
    case 1:
      return 'Permission denied.';
    case 2:
      return 'Position unavailable.';
    case 3:
      return 'Timeout reached.';
  }
}

function close_alert(){
  document.getElementById("alert").style.visibility = "hidden";
}
