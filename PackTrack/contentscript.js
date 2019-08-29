
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

var siteText;
var power = false;
function scrapeUserSite() {
  var tags = Array.from(document.querySelectorAll('*'));
  var f = tags.filter(t => !['script', 'meta', 'link', 'input', 'html', 'body', 'head', 'style', 'img', 'iframe'].includes(t.tagName.toLowerCase()));
  var t = f.map(
      e => Array.from(e.childNodes)
       .filter(c => c.nodeName === "#text")
    )
    .filter(x => x.length)
    .map(r =>
      r.map(w => w.textContent.trim())
      .filter(a => a && a.length > 10)
    )
    .filter(q => q.length);
  siteText = t.join(' ');

  // var whitelist = document.querySelector('#whitelist').innerText;
  // chrome.storage.sync.set({wlist: whitelist});

  chrome.storage.sync.get(['wlist'], function(result){
    var whitelist = result.wlist;
    if (!whitelist){
      whitelist = [];
    } else {
      console.log(whitelist);
    }

    chrome.runtime.sendMessage(chrome.runtime.id, {txt: siteText}, function(response) {
      if(!response) return;
      if (response.res && whitelist.every(function(site){return site !== location.hostname}) ) {
        // Blokc this crup
        document.body.style.background = "linear-gradient(to top left,  #9d00ff, #008187) fixed";
        document.body.style.height = "821px";
        document.body.innerHTML = `<center><p style="color:white; padding-top: 10vh; font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 3.25rem">It seems as if you are distracted!</p><br><img src="http://i66.tinypic.com/10ykqkk.png" border="0" alt="Image and video hosting by TinyPic"><br><br><p>${response.sim}</p></center>`;
      }

      console.log(response.sim);
      console.log(response.txt);
      console.log(siteText);
    })
  })
  
  

}
// Blokcing code for enhanced blocking
chrome.storage.sync.get(['blist'], function(result){
  var blacklist = result.blist || [];
  
  if(location.hostname == 'extensions' && blacklist[0] == 'extensions'){
    document.body.innerHTML = `Hey hey don't try to disable the extension you sneaky little rat...`;
  }
  
})

chrome.runtime.onMessage.addListener(
  function(req, sender, sendResponse) {
    if (req.subject == "change subjects" && power == true) {
      scrapeUserSite()
    }
  }
)

chrome.runtime.onMessage.addListener(
  function(req, sender, sendResponse){
    if(req.subject == "turn on"){
      power = true;
      console.log("extension on")
      scrapeUserSite();
    } else {
      power = false;
      console.log("extension off")
    }
  }
)



console.log('adwa')