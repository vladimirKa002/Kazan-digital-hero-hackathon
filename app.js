server = 'http://c33dc9d1fdec.ngrok.io';

function initMap() {
  window.map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 55.785795, lng: 49.121864 },
    zoom: 10
  });
  const card = document.getElementById("pac-card");
  const input = document.getElementById("pac-input");
  const login_but = document.getElementById("login_but");
  const show_but = document.getElementById("show_but");
  const select_year = document.getElementById("select_year");
  const loading_f = document.getElementById("loading_f");
  const login_form = document.getElementById("login_form");
  const chart = document.getElementById("myChart");
  const toolbar = document.getElementById("toolbar");
  const alert_f = document.getElementById("alert");
  
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(alert_f);
  
  map.controls[google.maps.ControlPosition.LEFT_CENTER].push(toolbar);
  map.controls[google.maps.ControlPosition.CENTER].push(login_form);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(select_year);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(loading_f);
  map.controls[google.maps.ControlPosition.TOP_RIGHT].push(card);
  const autocomplete = new google.maps.places.Autocomplete(input);
  map.controls[google.maps.ControlPosition.CENTER].push(chart);
  
  autocomplete.bindTo("bounds", map);
  
  const infowindow = new google.maps.InfoWindow();
  const infowindowContent = document.getElementById("infowindow-content");
  infowindow.setContent(infowindowContent);
  
  autocomplete.addListener("place_changed", () => {
    infowindow.close();
    marker.setVisible(false);
    const place = autocomplete.getPlace();

    if (!place.geometry) {
      window.alert("Нет данных для ввода: '" + place.name + "'");
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
            infoWindow_use_loc.setContent('Местоположение найдено.');
            infoWindow_use_loc.open(map);
            map.setCenter(pos);
          }, function() {
            handleLocationError(true, infoWindow_use_loc, map.getCenter());
          });
        } else {
          // Browser doesn't support Geolocation
          handleLocationError(false, infoWindow_use_loc, map.getCenter());
        }
	
	setup_points();
	closeloginForm();
}

logging = 0;

function closeloginForm(){
	logging = 0;
	document.getElementById("login_form").style.visibility = "hidden";
}

function showloginForm(){
	if (logging > 0) return;
	logging++;
	document.getElementById("login_form").style.visibility = "visible";
}

function handleLocationError(browserHasGeolocation, infoWindow_use_loc, pos) {
        infoWindow_use_loc.setPosition(pos);
        infoWindow_use_loc.setContent(browserHasGeolocation ?
                              'Ошибка: Служба геолокации не подключилась.' :
                              '');
        infoWindow_use_loc.open(map);
}