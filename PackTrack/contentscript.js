
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

  chrome.runtime.sendMessage("bmlihbbimpelghjgldjdooomledifedg", {msg: siteText}, function(response) {
    console.log(response.sim)
    if (response.res == "block this crapppppppppp") {
      // Blokc this crup
      document.write('')
    }
  })

}

chrome.runtime.sendMessage("*insert professional comment* (have a great day :D)", {msg: location.href}, function(response) {
  })

scrapeUserSite();
