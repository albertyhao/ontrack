document.getElementById("dropdown").addEventListener("mouseover", function() {
	document.getElementById("dropdown-content").style.display = "block";
})

function hide() {
	document.getElementById("dropdown-content").style.display = "none";
}

function addtowhitelist() {
	var whitelistURL = {
		url: document.querySelector('#whitelistinput').value
	}
	push({
	type: "POST",
	url: '/whitelist',
	data: JSON.stringify(whitelistURL),
	complete: function(resp) {
	  console.log('RESPONSE', resp.responseText);
	},
	dataType: 'json',
	contentType: 'application/json'
	});
}

function blacklistURL() {
	var blacklistURL = {
		url: document.querySelector('#blacklistURL').value
	}
	push({
	type: "POST",
	url: '/blacklistURL',
	data: JSON.stringify(blacklistURL),
	complete: function(resp) {
	  console.log('RESPONSE', resp.responseText);
	},
	dataType: 'json',
	contentType: 'application/json'
	});
}

function blacklistkeyword() {
	var whitelistURL = {
		url: document.querySelector('#blacklistkeyword').value
	}
	push({
	type: "POST",
	url: '/blacklistkeyword',
	data: JSON.stringify(blacklistkeyword),
	complete: function(resp) {
	  console.log('RESPONSE', resp.responseText);
	},
	dataType: 'json',
	contentType: 'application/json'
	});
}

document.querySelector('#whitelistbutton').addEventListener('click', addtowhitelist);
document.querySelector('#blacklistURL').addEventListener('click', blacklistURL);
document.querySelector('#blacklistkeyword').addEventListener('click', blacklistkeyword);
