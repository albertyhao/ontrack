
var load = new Date ();
var $qblock;
var siteText;
var power = false;
var time;
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

  chrome.storage.sync.get(['qblock'], function(result){
    if(!result.qblock){
      $qblock = [];
    } else {
      $qblock = result.qblock;
    }
  })

  chrome.storage.sync.get(['wlist'], function(result){
    var whitelist = result.wlist;
    if (!whitelist){
      whitelist = [];
    } else {
      // console.log(whitelist);
    }
      chrome.runtime.sendMessage(chrome.runtime.id, {txt: siteText}, function(response) {
        if(!response) return;
        if (response.res && response.res !== "power off" && whitelist.every(function(site){return site !== location.hostname}) && $qblock.every(function(site){return site !== location.hostname}) ) {
          // Blokc this crup
          var cant = document.styleSheets.length
          for(var i=0;i<cant;i++){
              document.styleSheets[i].disabled=true;
          }
          document.body.style.background = "linear-gradient(to top left,  #9d00ff, #008187) fixed";
          document.body.style.height = '960px';
          document.body.innerHTML = `<center><p style="color:white; padding-top: 10vh; font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 3.25rem">It seems as if you are distracted!</p><br></center>`;
          insertMarker();
        } else if(response.res == "power off"){
          console.log('power off');
        } else {
          insertMarker();
        }
  
        console.log(response.sim);
        // console.log(response.txt);
      })
    })
}



window.onblur = function(e) {
  // console.log(e);
  var final = new Date();
  var diff = final - load;
  chrome.runtime.sendMessage(chrome.runtime.id, {time: diff, site: location.href}, null);
}





window.onfocus = function(e) {
  load = new Date ();
}






chrome.runtime.onMessage.addListener(
  function(req, sender, sendResponse) {
    if (req.subject == "change subjects") {
      // console.log("got it")
      location.reload();
      scrapeUserSite();
      
    }
  }
)

chrome.runtime.onMessage.addListener(
  function(req, sender, sendResponse) {
    if (req.subject == "unblock") {
      
      location.reload();
      
      
    }
  }
)

function getTime(){
  chrome.runtime.sendMessage(chrome.runtime.id, {subject: "how much time left"}, function(res) {
    if(res){
      time = res;
      
    } else {
      return;
    }
  })
}

setInterval(getTime, 1000);


if(!time){time = "00:00:00"}

function insertMarker(){
  var marker = document.createElement('div');
  marker.innerHTML = `<p style="text-align: center;">Time remaining: ${time}</p>`;
  setInterval(function(){marker.getElementsByTagName('p')[0].innerHTML = `<p style="text-align: center;">Time remaining: ${time}</p>`}, 1000);
  marker.style.position = 'fixed';
  marker.style.bottom = '0';
  marker.style.width = '300px';
  marker.style.height = '50px';
  marker.style.backgroundColor = '#f0f0f0';
  marker.style.left = '42%';
  marker.style.zIndex = '100';
  marker.style.borderTop = '4px solid #736cdb';
  marker.style.borderLeft = '4px solid #736cdb';
  marker.style.borderRight = '4px solid #736cdb';
  var currentSubject;
  document.body.appendChild(marker);
  chrome.storage.sync.get(['subject'], function(result){
    if(result.subject == "none"){
      currentSubject = "None";
    } else if(result.subject == "biology"){
      currentSubject = "Biology";
    } else if(result.subject == "history"){
      currentSubject = "American History"
    } else if(result.subject == "collegeApps"){
      currentSubject = "College Apps"
    } else {
      currentSubject = "General Studying"
    }
  })
  marker.addEventListener('click', enlarge);
  function enlarge(){
    marker.style.height = '150px';
    marker.innerHTML = `<b><h4 style="text-align: center;">Study session in progress</h4></b><p style="text-align: center;">Time remaining: ${time}</p><p style="text-align: center;">Current Subject: ${currentSubject}</p>`
    
    
    
  }
  marker.addEventListener('mouseout', shrink);
  function shrink(){
    marker.style.height = '50px';
    marker.innerHTML = `<p style="text-align: center;">Time remaining: ${time}</p>`
  }
}
chrome.runtime.onMessage.addListener(
  function(req, sender, sendResponse) {
    if (req.subject == "study session start") {
      console.log('hello');
      insertMarker();
      
    }
  }
)
// chrome.runtime.onMessage.addListener(
//   function(req, sender, sendResponse){
//     if(req.subject == "turn on"){
//       power = true;
//       console.log("extension on")
//       scrapeUserSite();
//     } else {
//       power = false;
//       console.log("extension off")
//       location.reload();
//     }
//   }
// )
// console.log('did it get this far?')
scrapeUserSite();