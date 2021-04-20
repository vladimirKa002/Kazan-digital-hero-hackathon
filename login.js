function check(){
    // получаем значение поля key
    var login_t = document.getElementById("login").value;
    var password_t = document.getElementById("password").value;
	
	
	var XHR = ("onload" in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;

	var request = new XHR();

	request.open('GET', server+'/login?login='+login_t+'&password='+password_t, true);
	
	request.onload = function() {
		var obj = JSON.parse(request.responseText);
		if (obj.access) {
			location.href = "./Safe way admin.html";
			return true;
		}
		else {
			alert ("Login was unsuccessful");
			return false;
		}
	};
	
	request.send();
	return false;
	
}