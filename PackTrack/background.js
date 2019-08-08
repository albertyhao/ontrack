chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.greeting == "hello")
      sendResponse({farewell: "goodbye"});
  });



// chrome.webNavigation.onCompleted.addListener(function() {
//      alert("I love hulu!");
//  }, {url: [{urlMatches : 'https://www.hulu.com'}]});
// use for the blacklist

 chrome.webNavigation.onCompleted.addListener(function() {
   var s = document.createElement('script');
   // TODO: add "script.js" to web_accessible_resources in manifest.json
   s.src = chrome.extension.getURL('injectBackground.js');
   s.onload = function() {
       this.remove();
   };
   (document.head || document.documentElement).appendChild(s);

  }, {url: [{urlMatches : 'https://grant.wisen.space/test.html'}]});