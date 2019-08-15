// chrome.webNavigation.onCompleted.addListener(function() {
//      alert("I love hulu!");
// //  }, {url: [{urlMatches : 'https://www.hulu.com'}]});
// // use for the blacklist

//  chrome.webNavigation.onCompleted.addListener(function() {
//    var s = document.createElement('script');
//    // TODO: add "script.js" to web_accessible_resources in manifest.json
//    s.src = chrome.extension.getURL('injectBackground.js');
//    s.onload = function() {
//        this.remove();
//    };
//    (document.head || document.documentElement).appendChild(s);

//   }, {url: [{urlMatches : 'https://www.hulu.com'}]});

chrome.runtime.onMessage.addListener(
  function(req, sender, sendResponse) {
  	if (req.site) {
  		console.log('HI')
		chrome.storage.sync.get(['customerid'], function(result){
			console.log(result)
  			var xhr = new XMLHttpRequest();
  			xhr.open("GET", `http://ontrackserver.herokuapp.com?id=${result.customerid}&site=${encodeURIComponent(req.site)}`, true);
 			xhr.send(); 
		})
  	}
 

})