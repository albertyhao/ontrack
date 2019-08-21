var load = new Date ();

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
}

chrome.runtime.sendMessage("hifbilbgboinpggahojciiiahcdkmhmh", {site: location.href}, function(response) {
  })

window.onblur = function(e) { 
  console.log(e); 
  var final = new Date();
  var diff = final - load; 
  console.log("BOING")
  chrome.runtime.sendMessage("hifbilbgboinpggahojciiiahcdkmhmh", {time: diff, site: location.href}, function(response) {
  })
}

window.onfocus = function(e) {
  load = new Date ();
}



scrapeUserSite();
