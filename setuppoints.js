var points_of_conc = [];
var points_of_accidents = [];
request_sent = 0;
var markers = [];
markers_concentarion = [];
var accidents_id = [];
var contentStrs = [];
var contentStrs_acc = [];
var crashes_ar = [];
var num_crash = 0;
var all_ac_showed = false;

function setup_points() {
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
		'<button name="show_acc" onclick="show_accidents('+i+', '+ year+', ' + id +')" id="button" style="visability: visible;">'+
		'Показать ДТП</button>'+
		'<button name="close_acc" onclick="delete_accidents('+ id +')" id="button" style="visability: visible;">'+
		'Скрыть ДТП</button>'+
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

	// (2) запрос на другой домен :)
	request.open('GET', server+'/concentration?year='+year+'&id='+id, true);
	
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
		'<p>Тип: '+ points_of_accidents[i].type+ '</p>'+
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
	all_ac_showed=true;
	
	var size_init = contentStrs_acc.length;
	
	for (var i =0;i<points_of_accidents.length;i++){
		var contentString = '<div id="content">'+
		'<div id="siteNotice">'+
		'</div>'+
		'<div id="bodyContent">'+
		'<p>Дата: '+ points_of_accidents[i].date+ '</p>'+
		'<p>Тип: '+ points_of_accidents[i].kind+ '</p>'+
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
}

function show_somth(bool){
	if (request_sent==1) return;
	if (bool){
		if (!all_ac_showed) {
			delete_points();
			setup_points();
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
		setup_points();
	}
	else {
		button_show.src='images/btn_point_show.png';
		all_ac_showed = true;;
		delete_points();
		show_all_ac();
	}
}