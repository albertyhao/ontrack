
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
    console.log(whitelist);

    chrome.runtime.sendMessage(chrome.runtime.id, {msg: siteText}, function(response) {
      console.log('awiealwhduawhdjlaw')
      if (response.res == "block this crapppppppppp" && whitelist.every(function(site){return site !== location.hostname})) {
        // Blokc this crup
        document.body.style.background = "linear-gradient(to top left,  #9d00ff, #008187) fixed";
        document.body.style.height = "821px";
        document.body.innerHTML = `<center><p style="color:white; padding-top: 10vh; font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 3.25rem">It seems as if you are distracted!</p><br><img src="http://i66.tinypic.com/10ykqkk.png" border="0" alt="Image and video hosting by TinyPic"><br><br><p>${response.sim}</p></center>`;
      } else {
        console.log(response.sim);
      }
    })
  })
  
  

}
// Blokcing code for enhanced blocking
chrome.storage.sync.get(['blist'], function(result){
  var blacklist = result.blist;
  
  if(location.hostname == 'extensions' && blacklist[0] == 'extensions'){
    document.body.innerHTML = `Hey hey don't try to disable the extension you sneaky little rat...`;
  }
  
})
scrapeUserSite();
console.log('adwa')
