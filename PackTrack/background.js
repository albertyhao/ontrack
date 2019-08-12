// chrome.webNavigation.onCompleted.addListener(function() {
//      alert("I love hulu!");
//  }, {url: [{urlMatches : 'https://www.hulu.com'}]});
// //use for the blacklist

//  chrome.webNavigation.onCompleted.addListener(function() {
//    var s = document.createElement('script');
//    // TODO: add "script.js" to web_accessible_resources in manifest.json
//    s.src = chrome.extension.getURL('injectBackground.js');
//    s.onload = function() {
//        this.remove();
//    };
//    (document.head || document.documentElement).appendChild(s);

//   }, {url: [{urlMatches : 'https://www.hulu.com'}]});


var similarity = chrome.extension.getViews({
    type: "popup"
});
for (var i = 0; i < similarity.length; i++) {
    similarity[i].document.getElementById('similarity').innerHTML = "My Custom Value";
}


  

