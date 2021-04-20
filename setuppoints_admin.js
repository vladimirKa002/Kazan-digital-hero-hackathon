var points_of_conc = [];
var points_of_accidents = [];
request_sent = 0;
var markers = [];
var markers_concentarion = [];
var accidents_id = [];
var contentStrs = [];
var contentStrs_acc = [];
var crashes_ar = [];
var crash_ids = [];
var num_crash = 0;
var all_ac_showed = false;

function setup_points_admin() {
	if (request_sent==1) return;
	
	delete_points();
	
	var loading_f = document.getElementById("loading_f");
	loading_f.style.display='block';
	
	var list_years = document.getElementsByName("year_box");
	var year = '2017';
	year = document.getElementById("year_box").value;
	
	var XHR = ("onload" in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;

	var request = new XHR();

	// (2) запрос на другой домен :)
	request.open('GET', server+'/points?year='+year, true);
	
	request_sent=1;
	
	request.send();
	
	request.onload = function() {
	points_of_conc = JSON.parse(request.responseText);
	for (var i =0;i<points_of_conc.length;i++){
		var lng = points_of_conc[i].ltd;
		var lat = points_of_conc[i].lng;
		var position = {lat, lng};
		num_crash += points_of_conc[i].crashes.length;
		crash_ids.push(points_of_conc[i].crashes);
		var id = points_of_conc[i].id;
		var infowindow_place = new google.maps.InfoWindow();
		var image = './images/point_conc.png';
		var marker = new google.maps.Marker({
			position: position,
			icon: image,
			map: map
		});
		markers_concentarion.push(marker);
		var contentString = '<div id="content">'+
		'<div id="siteNotice">'+
		'</div>'+
		'<div id="bodyContent">'+
		'<button name="show_acc" onclick="show_accidents('+i+', '+ year+', ' + id +')" id="button_admin" style="visability: visible;">'+
		'Показать ДТП</button>'+
		'<button name="close_acc" onclick="delete_accidents('+ id +')" id="button_admin" style="visability: visible;">'+
		'Скрыть ДТП</button>'+
		'<button name="close_acc" onclick="loadImage('+year+', ' +id+')" id="button_admin_anlaysis" style="visability: visible;">'+
		'Анализ</button>'+
		'</div>'+
		'</div>';
		contentStrs.push(contentString);
		
		google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
                infowindow_place.setContent(contentStrs[i]);
                infowindow_place.open(map, marker);
            }
        })(marker, i));
	}
	loading_f.style.display='none';
	request_sent=0;
	};
}

function show_accidents(num, year, id){
	if (request_sent==1) return;
	
	if (all_ac_showed) delete_all_ac();
	delete_accidents(id);
	
	var loading_f = document.getElementById("loading_f");
	loading_f.style.display='block';
	
	var XHR = ("onload" in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;

	var request = new XHR();
	request.open('GET', server+'/concentration/all_info?year='+year+'&id='+id, true);
	
	request_sent=1;
	request.send();
	
	request.onload = function() {
	points_of_accidents = JSON.parse(request.responseText);
	
	var size_init = contentStrs_acc.length;
	
	for (var i =0;i<points_of_accidents.length;i++){
		var contentString = '<div id="content">'+
		'<div id="siteNotice">'+
		'</div>'+
		'<div id="bodyContent">'+
		'<p>Дата: '+ points_of_accidents[i].date+ '</p>'+
		'<p>Тип: '+ points_of_accidents[i].kind+ '</p>'+
		'<p>Улица: '+ points_of_accidents[i].street+ '</p>'+
		'<p>Дом: '+ points_of_accidents[i].house+ '</p>'+
		'<p>Погибло: '+ points_of_accidents[i].died+ '</p>'+
		'<p>Детей погибло: '+ points_of_accidents[i].kids_died+ '</p>'+
		'<p>Пострадавших: '+ points_of_accidents[i].injured+ '</p>'+
		'<p>Детей gострадавших: '+ points_of_accidents[i].injured_kids+ '</p>'+
		'<p>Условия покрытия: '+ points_of_accidents[i].road_cond+ '</p>'+
		'<p>Погода: '+ points_of_accidents[i].weather+ '</p>'+
		'<p>Свет: '+ points_of_accidents[i].light+ '</p>'+
		'<p>Покрытие: '+ points_of_accidents[i].road_kind+ '</p>'+
		'</div>'+
		'</div>';
		contentStrs_acc.push(contentString);
		var lng = points_of_accidents[i].ltd;
		var lat = points_of_accidents[i].lng;
		var position = {lat, lng};
		var infowindow_place = new google.maps.InfoWindow();
		var image = './images/accident.png';
		var marker = new google.maps.Marker({
			position: position,
			icon: image,
			map: map
		});
		markers.push(marker);
		accidents_id.push(id);
		
		var t= size_init+i;
		
		google.maps.event.addListener(marker, 'click', (function(marker, t) {
            return function() {
                infowindow_place.setContent(contentStrs_acc[t]);
                infowindow_place.open(map, marker);
            }
        })(marker, t));
	}
	loading_f.style.display='none';
	request_sent=0;
	};
}

function show_all_ac() {
	if (request_sent==1) return;
	
	var loading_f = document.getElementById("loading_f");
	loading_f.style.display='block';
	
	var list_years = document.getElementsByName("year_box");
	var year = '2017';
	year = document.getElementById("year_box").value;
	
	var XHR = ("onload" in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;

	var request = new XHR();

	// (2) запрос на другой домен :)
	request.open('GET', server+'/accidents/all_info?year='+year, true);
	
	request_sent=1;
	
	request.send();
	
	request.onload = function() {
	points_of_accidents = JSON.parse(request.responseText);
	
	var size_init = contentStrs_acc.length;
	
	for (var i =0;i<points_of_accidents.length;i++){
		var contentString = '<div id="content">'+
		'<div id="siteNotice">'+
		'</div>'+
		'<div id="bodyContent">'+
		'<p>Дата: '+ points_of_accidents[i].date+ '</p>'+
		'<p>Тип: '+ points_of_accidents[i].kind+ '</p>'+
		'<p>Улица: '+ points_of_accidents[i].street+ '</p>'+
		'<p>Дом: '+ points_of_accidents[i].house+ '</p>'+
		'<p>Погибло: '+ points_of_accidents[i].died+ '</p>'+
		'<p>Детей погибло: '+ points_of_accidents[i].kids_died+ '</p>'+
		'<p>Пострадавших: '+ points_of_accidents[i].injured+ '</p>'+
		'<p>Детей gострадавших: '+ points_of_accidents[i].injured_kids+ '</p>'+
		'<p>Условия покрытия: '+ points_of_accidents[i].road_cond+ '</p>'+
		'<p>Погода: '+ points_of_accidents[i].weather+ '</p>'+
		'<p>Свет: '+ points_of_accidents[i].light+ '</p>'+
		'<p>Покрытие: '+ points_of_accidents[i].road_kind+ '</p>'+
		'</div>'+
		'</div>';
		contentStrs_acc.push(contentString);
		var lng = points_of_accidents[i].ltd;
		var lat = points_of_accidents[i].lng;
		var position = {lat, lng};
		var infowindow_place = new google.maps.InfoWindow();
		var image = './images/accident.png';
		var marker = new google.maps.Marker({
			position: position,
			icon: image,
			map: map
		});
		markers.push(marker);
		
		var t= size_init+i;
		
		google.maps.event.addListener(marker, 'click', (function(marker, t) {
            return function() {
                infowindow_place.setContent(contentStrs_acc[t]);
                infowindow_place.open(map, marker);
            }
        })(marker, t));
	}
	all_ac_showed=true;
	loading_f.style.display='none';
	request_sent=0;
	};
}

function delete_accidents(id){
	for (let i = 0; i < markers.length; i++) {
		if (accidents_id[i]==id) {
			markers[i].setMap(null);
			accidents_id.splice(i, 1);
			markers.splice(i, 1);
			points_of_accidents=[];
			i--;
		}
  }
}

function delete_points(){
  for (let i = 0; i < markers.length; i++) {
	markers[i].setMap(null);
  }
  for (let i = 0; i < markers_concentarion.length; i++) {
	markers_concentarion[i].setMap(null);
  }
	contentStrs= [];
	contentStrs_acc=[];
	markers = [];
	markers_concentarion=[];
	points_of_accidents=[];
	points_of_conc = [];
	accidents_id=[];
	crash_ids=[];
}

function show_somth(bool){
	if (request_sent==1) return;
	if (bool){
		if (!all_ac_showed) {
			delete_points();
			setup_points_admin();
		}
		else {
			delete_points();
			show_all_ac();
		}
		return;
	}
	var button_show = document.getElementById("button_show");
	if (all_ac_showed) {
		button_show.src='images/btn_acc_show.png';
		all_ac_showed = false;
		delete_points();
		setup_points_admin();
	}
	else {
		button_show.src='images/btn_point_show.png';
		all_ac_showed = true;;
		delete_points();
		show_all_ac();
	}
}

function imgLoad(url) {
    'use strict';
    // Create new promise with the Promise() constructor;
    // This has as its argument a function with two parameters, resolve and reject
    return new Promise(function (resolve, reject) {
        // Standard XHR to load an image
        var request = new XMLHttpRequest();
        request.open('GET', url);
        request.responseType = 'blob';
        
        // When the request loads, check whether it was successful
        request.onload = function () {
            if (request.status === 200) {
                // If successful, resolve the promise by passing back the request response
                resolve(request.response);
            } else {
                // If it fails, reject the promise with a error message
                reject(new Error('Image didn\'t load successfully; error code:' + request.statusText));
            }
        };
      
        request.onerror = function () {
            // Also deal with the case when the entire request fails to begin with
            // This is probably a network error, so reject the promise with an appropriate message
            reject(new Error('There was a network error.'));
        };
      
        // Send the request
        request.send();
    });
}

function loadImage(year, id) {
    'use strict';
    // Get a reference to the body element, and create a new image object
    var container = document.querySelector('image_container');
	container.style.visability='visible';
	var myImage = new Image();
  
    myImage.crossOrigin = ""; // or "anonymous"
    
    // Call the function with the URL we want to load, but then chain the
    // promise then() method on to the end of it. This contains two callbacks
    imgLoad(server+'/graph?year='+year+'&id='+id).then(function (response) {
        // The first runs when the promise resolves, with the request.reponse specified within the resolve() method.
        var imageURL = window.URL.createObjectURL(response);
        myImage.src = imageURL;
        container.appendChild(myImage);
        // The second runs when the promise is rejected, and logs the Error specified with the reject() method.
    }, function (Error) {
        console.log(Error);
    });
}