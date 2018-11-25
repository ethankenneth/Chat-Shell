
window.onload = init;
	var chatUser = null; // global to hold the user name
	var startDateTime = new Date(); // send to db so we only get data older than the current user involvement
	setInterval (getChatLog, 2500);	// Reload file every 2500 2.5 seconds

	function init() {
		// get or set the current user
		var welcomemsg = "";
		if(retrieveCookie('chatUser')) {
			alert ("Hello " + retrieveCookie('chatUser') + " welcome back!");
			chatUser = retrieveCookie('chatUser');
			welcomemsg = "Welcome, " + chatUser
		} else {
			// prompt login
			chatUser = prompt ("Please enter your name!");

			if(chatUser) {
				writeCookie('chatUser', chatUser);
				welcomemsg = "Welcome, " + chatUser
			}
		}
		document.getElementById("theUser").innerHTML = welcomemsg;
		// $('#theUser').html(welcomemsg); // jQuery
	}

	function removeChatUser(){
		//alert(removeChatUser);
		removeCookie('chatUser');
		chatUser = null;
		document.getElementById("theUser").innerHTML = "No Current User";
	}

	function getChatLog() {
		var oldscrollHeight = document.getElementById("chattexttbox").scrollHeight - 20; //get scrool height prior to request			// var oldscrollHeight = $("#chattexttbox").attr("scrollHeight") - 20; // jQuery

		var xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {

				var chatObject = xmlhttp.responseText; // return values go here

				if(chatObject){
				    try {
						chatObject = JSON.parse(chatObject);
						var chats = chatObject.chats;

						var chatText = "";

						for(var i = 0; i < chats.length; i++) {
							chatText += "(" + chats[i].dayte + ") " + chats[i].user + ": " + chats[i].message + "<br />";
						}

						document.getElementById("chattexttbox").innerHTML = chatText;

				    } catch(e) {
				        alert("Error occured while parsing the json response: error: "); // error in the above string (in this case, yes)!
				    }

				}

				var newscrollHeight = document.getElementById("chattexttbox").scrollHeight - 20;  //Scroll height after the request
				//var newscrollHeight = $("#chattexttbox").attr("scrollHeight") - 20; // jQuery

				if(newscrollHeight > oldscrollHeight){ // if the new scroll height is greater than the old scrool height
					//$("#chattexttbox").animate({ scrollTop: newscrollHeight }, 'normal'); //Autoscroll to bottom of div
					document.getElementById("chattexttbox").scrollTop = newscrollHeight; // assignme the new scroll height
				}
			}
		}
		//console.log(formatDateForMysql(startDateTime));
		//xmlhttp.open("GET", "http://dbachor.com/NCC/getChatLog.php?startDateTime=" + formatDateForMysql(startDateTime), true);
		xmlhttp.open("GET", "http://dbachor.com/NCC/getChatLogJSON.php?startDateTime=" + formatDateForMysql(startDateTime), true);
		xmlhttp.send();
	}//end function getChatLog

	function sendMessage() {

		if(!chatUser) { // if we do not have a name, we we force prompt to get a name
			init();
			return;
		}//end if (!chatUser)

		var msg = document.getElementById("msginput").value; // get the userID from the option tag		// var oldscrollHeight = $("#chattexttbox").attr("scrollHeight") - 20;
		var xmlhttp = new XMLHttpRequest();

		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {

				var resp = xmlhttp.responseText; // return values go here

				if(resp == 1){
					getChatLog();
				} else {
					alert(resp);
				}
			}//end if xmlhttp
		}//end onreadystatechange
		//xmlhttp.open("GET", "http://dbachor.com/NCC/post.php?user=" + chatUser + "&message=" + msg, true);
		xmlhttp.open("GET", "http://dbachor.com/NCC/post.php?user=" + chatUser + "&message=" + msg, true);
		xmlhttp.send();
		var msg = document.getElementById("msginput").value = "";
	} // end function getUserCourses
function writeCookie(cName, cValue, expDate, cPath, cDomain, cSecure) {
	if (cName && cValue != "") {
		var cString = cName + "=" + escape(cValue);

		if(expDate) cString += ";expires=" + expDate.toGMTString();
		if(cPath)   cString += ";path=" + cPath;
		if(cDomain)   cString += ";domain=" + cDomain;
		if(cSecure)   cString += ";secure=" + cSecure;

		//alert(cString);
		document.cookie = cString;
	}
}

function retrieveCookie(cName) {
	if(document.cookie){
		var cookieArray = document.cookie.split("; ");
		for(var i = 0; i < cookieArray.length; i++) {
			if(cookieArray[i].split("=")[0] == cName) {
				return unescape(cookieArray[i].split("=")[1]);
			}
		}
	}
}

function removeCookie(cName) {

	if (document.cookie) {
		var cookiesArray = document.cookie.split("; ");
		for(var i = 0; i < cookiesArray.length; i++) {

			if(cookiesArray[i].split("=")[0] == cName) {
				document.cookie = cName + "=;expires=Thu, 01-Jan-1970 00:00:01 GMT";
			}
		}
	}
}


function formatDateForMysql(date1) {
		return date1.getFullYear() + '-' +
			(date1.getMonth() < 9 ? '0' : '') + (date1.getMonth()+1) + '-' +
			(date1.getDate() < 10 ? '0' : '') + date1.getDate() + " " +
			date1.getHours() + ":" +
			date1.getMinutes() + ":" +
			date1.getSeconds();
}
