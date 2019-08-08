chrome.runtime.sendMessage("agdppcjhkldbkgiopgcokdkfokjnfogj", {greeting: "hello"}, function(response) {
	console.log(response.farewell)
})


console.log('p')

chrome.storage.sync.get(['customerid'], function(){
      var xhr = new XMLHttpRequest();
      xhr.open("GET", `http://ontrackserver.herokuapp.com?id=${result}&site=${location.href}`, true);
      xhr.send(); 
    })

// // var s = document.createElement('script');
// // s.src = chrome.extension.getURL('blacklist.js');
// // (document.head||document.documentElement).appendChild(s);
// // s.onload = function() {
// //     s.parentNode.removeChild(s);
// // };

// var s = document.createElement('script');
// s.src = chrome.extension.getURL('script.js');
// (document.head||document.documentElement).appendChild(s);
// s.onload = function() {
//     s.parentNode.removeChild(s);
// }; // This initializes the script onto the pages