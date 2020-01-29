
var load = new Date ();
var $qblock;
var siteText;
var power = false;
var time;
var setTime;
var timerOrNot;
var sim;

function injectStyle(){
  var style = `
  
  #countdown {
    position: fixed;
    right: 5%;
    top: 5%;
    height: 40px;
    width: 40px;
    text-align: center;
    z-index: 100000;
  }
  
  #countdown-number {
    color: black;
    display: inline-block;
    line-height: 40px;
    display: none;
    z-index: 1000000000000000000000;
  }
  
  #spinny {
    position: absolute;
    top: -28px;
    right: -17px;
    width: 80px;
    height: 80px;
    transform: rotateY(-180deg) rotateZ(-90deg);
  }
  
  #spinny circle {
    stroke-dasharray: 113px;
    stroke-dashoffset: 0px;
    stroke-linecap: round;
    stroke-width: 3px;
    stroke: #736cdb;
    

    fill: none;
    
  }
  
  @keyframes countdown {
    from {
      stroke-dashoffset: 0px;
    }
    to {
      stroke-dashoffset: 113px;
    }
  }`
var s = document.createElement('style')
s.innerHTML = style;
document.head.appendChild(s)
}

function injectStyle2(){
  var style = `
  
  #countdown {
    position: fixed;
    right: 5%;
    top: 5%;
    height: 40px;
    width: 40px;
    text-align: center;
    z-index: 100000;
  }
  
  #countdown-number {
    color: black;
    display: inline-block;
    line-height: 40px;
    display: none;
    z-index: 1000000000000000000000;
  }
  
  #spinny {
    position: absolute;
    top: -28px;
    right: -17px;
    width: 80px;
    height: 80px;
    transform: rotateY(-180deg) rotateZ(-90deg);
  }
  
  #spinny circle {
    stroke-dasharray: 113px;
    stroke-dashoffset: 0px;
    stroke-linecap: round;
    stroke-width: 3px;
    stroke: white;
    

    fill: none;
    
  }
  
  @keyframes countdown {
    from {
      stroke-dashoffset: 0px;
    }
    to {
      stroke-dashoffset: 113px;
    }
  }`
var s = document.createElement('style')
s.innerHTML = style;
document.head.appendChild(s)
}

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
      chrome.runtime.sendMessage(chrome.runtime.id, {txt: siteText, subject: "check sim"}, function(response) {
       
        if(!response) return;
        sim = response.sim;
        if (response.res && response.res !== "power off" && whitelist.every(function(site){return site !== location.hostname}) && $qblock.every(function(site){return site !== location.hostname}) ) {
          // Blokc this crup
          
          document.write('<!DOCTYPE html><html><head></head><body></body></html>');
          window.document.title = "Off Task!"
          
          document.body.style.background = "linear-gradient(to top left,  #9d00ff, #008187) fixed";
          document.body.style.height = '100vh';
          document.body.style.margin = '0';
          document.body.style.overflow = 'hidden';
          
          var link = document.createElement('link');
          link.setAttribute('rel', "stylesheet");
          link.setAttribute('href', "https://fonts.googleapis.com/css?family=Montserrat&display=swap");
          document.head.appendChild(link);

          var link2 = document.createElement('link');
          link2.setAttribute('rel', "icon");
          link2.setAttribute('href', "https://nathan.wisen.space/9wwrvezffvk0txbgolidm9yg.png");
          link2.setAttribute('type', "image/x-icon");
          document.head.appendChild(link2);


          document.body.innerHTML = `
          <center>
            <img src="https://nathan.wisen.space/k8batqoxbjpkpio4b_4tcq0s.png" style="height: 15vh;">
            <p style="color:white; margin-top: 0; margin-bottom: 5vh; font-family: 'Montserrat', sans-serif; font-size: 2rem">This Page Doesn't Relate to What You're Working On</p>
            <div id="linkBox" style="font-family: 'Montserrat', sans-serif; border: 2px solid white; border-radius: 10px; padding-bottom: 1em; width: 40vmin;">
              <br>
              <select id="options" style="font-size: 1.5rem; color: white; background: none; border: none; outline: none; font-family: 'Montserrat', sans-serif; text-align-last: center;">
                <option>Helpful Links</option>
                <option>Unblock Page</option>
                <option>Exit Page</option>
              </select>
              <div id="helpfulLinks" style="display: block;"></div>
              <div id="unblockPage" style="display: none;">
                <p style="font-size: 1rem; color: white;">You may attempt to unblock this site if you feel that it shouldn't be flagged.</p>
                <button style="cursor: pointer; border: 2px solid white; padding: 6px 16px; text-decoration: none; outline: none; background: #736cdb; color: white; border-radius: 12px;">Unblock Page</button>
              </div>
              <div id="exitPage" style="display: none;">
                <button style="cursor: pointer; margin-top: 1.5em; position: relative; border: 2px solid white; padding: 6px 16px; text-decoration: none; outline: none; background: #736cdb; color: white; border-radius: 12px;">Exit Page</button>
              </div>
            </div>
            <br>
          </center>
          `;

  
          if(whitelist.length > 9 && whitelist.length < 14){
            for(i=9; i < whitelist.length; i++){
              var newLink = document.createElement('div');
              newLink.innerHTML = `
                <img style="height: 20px; display: inline;" src="//logo.clearbit.com/${whitelist[i].split(".")[1] + "." + whitelist[i].split(".")[2]}">
                <p style="display: inline; vertical-align: top; color: white; text-decoration: underline; cursor: pointer;">${whitelist[i]}</p>
              `;
              if(i == 9){
                newLink.style.paddingTop = "1.5em";
              }
              newLink.setAttribute('class', "link");
              document.querySelector('#helpfulLinks').appendChild(newLink);
            }
          } else if(whitelist.length > 14){
            for(i=9; i < 14; i++){
              var newLink = document.createElement('div');
              newLink.innerHTML = `
                <img style="height: 20px; display: inline;" src="//logo.clearbit.com/${whitelist[i].split(".")[1] + "." + whitelist[i].split(".")[2]}">
                <p style="display: inline; vertical-align: top; color: white; text-decoration: underline; cursor: pointer;">${whitelist[i]}</p>
              `;
              if(i == 9){
                newLink.style.paddingTop = "1.5em";
              }
              newLink.setAttribute('class', "link");
              document.querySelector('#helpfulLinks').appendChild(newLink);
            }
          }
          document.querySelectorAll('.link').forEach(i => {
            if(i.querySelector('p').innerText == "undefined"){
              i.style.display = "none";
            }
          })

          document.querySelectorAll('.link').forEach(i => i.querySelector('p').addEventListener("click", function(){
            window.location.href = "https://" + i.querySelector('p').innerText;
          }));

          document.addEventListener('input', function(event){
            if(event.target.id !== "options") return;
            if(event.target.value == "Helpful Links"){
              document.querySelector('#helpfulLinks').style.display = "block";
              document.querySelector('#unblockPage').style.display = "none";
              document.querySelector('#exitPage').style.display = "none";
            } else if(event.target.value == "Unblock Page"){
              document.querySelector('#helpfulLinks').style.display = "none";
              document.querySelector('#unblockPage').style.display = "block";
              document.querySelector('#exitPage').style.display = "none";
            } else {
              document.querySelector('#helpfulLinks').style.display = "none";
              document.querySelector('#unblockPage').style.display = "none";
              document.querySelector('#exitPage').style.display = "block";
            }
          })

          document.querySelector('#exitPage').addEventListener('click', function(){
            chrome.runtime.sendMessage(chrome.runtime.id, {subject: "close tab"}, null);
          })

          //code for unblocking current site

          var $unblock = document.querySelector('#unblockPage');
          $unblock.addEventListener('click', unblockGoodSite);

          function unblockGoodSite(){
            if(sim > 0.1){
              unblockSite();
            } else {
              alert("We detect that thie site has no correlation to your current subject.")
            }
          }

          function unblockSite(){
              var $hostname = location.hostname;
              chrome.storage.sync.get(['qblock'], function(result){
                var blankArray = result.qblock;
                blankArray.push($hostname);
                chrome.storage.sync.set({qblock: blankArray}, null);
              })
          

            location.reload();

          }

          
          injectStyle2();
          insertTimer();
          
          
          
        } else if(response.res == "power off"){
          var t = document.querySelector('#countdown');
          if(t){
            document.body.removeChild(t);
          }

          if(document.title == "Off Task!"){
            location.reload();
          }
          
          // console.log('power off');
        } else {
          if(timerOrNot == "on"){
            var t = document.querySelector('#countdown');
            if(!t){
              injectStyle();
              insertTimer();
            }
            
          } else {
            var t = document.querySelector('#countdown');
            if(t){
              document.body.removeChild(t);
            }
            
          }
          
        }

        // 
        
        // console.log(response.txt);
      })
    })
}

window.onblur = function(e) {
  // console.log(e);
  var final = new Date();
  var diff = final - load;
  try {
    chrome.runtime.sendMessage(chrome.runtime.id, {time: diff, site: location.href}, null);
  } catch(ex) {

  }
  
}

window.onfocus = function(e) {
  load = new Date ();
}



// chrome.runtime.onMessage.addListener(
//   function(req, sender, sendResponse) {
//     if (req.subject == "change subjects") {
//       // console.log("got it")
//       getCurrentTime();
//       scrapeUserSite();
//     }
//   }
// )

// chrome.runtime.onMessage.addListener(
//   function(req, sender, sendResponse) {
//     if (req.subject == "change subjects and end session") {
//       // console.log("got it")
//       location.reload();
//       scrapeUserSite();
      
//     }
//   }
// )

// chrome.runtime.onMessage.addListener(
//   function(req, sender, sendResponse) {
//     if (req.subject == "unblock") {
      
//       location.reload();
      
      
//     }
//   }
// )

chrome.runtime.onMessage.addListener(
  function(req, sender, sendResponse) {
    if (req.subject == "state change") {
      
      scrapeUserSite();
      
      
    }
  }
)


chrome.runtime.onMessage.addListener(
  function(req, sender, sendResponse) {
    if (req.subject == "timer on and off") {
      chrome.storage.sync.get(['timerWidget'], function(result){
        timerOrNot = result.timerWidget;
        // console.log(timerOrNot)
      })
      
      // console.log(timerOrNot);
    }
  }
)

function getTime(){
  try {
    chrome.runtime.sendMessage(chrome.runtime.id, {subject: "how much time left"}, function(res) {
      if(res){
        time = res;
        
      } else {
        return;
      }
    })
  }
  catch(ex) {
  
  }
}

setInterval(getTime, 1000);


if(!time){time = "00:00:00"}
if(!setTime){setTime = "00:00:00"}
// chrome.runtime.onMessage.addListener(
//   function(req, sender, sendResponse) {
//     if (req.timeSet) {
//       setTime = req.timeSet;
//       console.log(setTime);
      
//     }
//   }
// )

function getCurrentTime(){
  chrome.runtime.sendMessage(chrome.runtime.id, {subject: "current time"}, function(res) {
    if(res){
      setTime = res;
      // console.log(setTime)
    } else {
      return;
    }
  })
  
}
getCurrentTime();
function insertTimer(){
  
  var $10hrs = setTime.substr(0,1);
 
  var $hrs = setTime.substr(1,1);
  
  var $10min = setTime.substr(3,1);

  var $min = setTime.substr(4,1);
 
  var $10sec = setTime.substr(6,1);
 
  var $sec = setTime.substr(7,1);
  
  var seconds = parseInt($10hrs * 36000) + parseInt($hrs * 3600) + parseInt($10min * 600) + parseInt($min * 60) + parseInt($10sec * 10) + parseInt($sec);
  
  var timer = document.createElement('div');
  timer.id = "countdown";
  timer.innerHTML = `
  <svg height="54" width="54" fill="black" style="border-radius: 50%; margin-left: 10px;" viewBox="-46 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="m373.824219 170.601562 21.527343-21.53125c11.695313-11.691406 11.695313-30.722656 0-42.421874-11.695312-11.695313-30.726562-11.695313-42.421874 0l-22.984376 22.984374c-23.976562-16.699218-51.308593-28.257812-79.945312-33.804687v-29.828125h20c5.523438 0 10-4.476562 10-10v-26c0-16.542969-13.457031-30-30-30h-80c-16.542969 0-30 13.457031-30 30v26c0 5.523438 4.476562 10 10 10h20v29.828125c-28.632812 5.542969-55.96875 17.105469-79.945312 33.804687l-22.984376-22.984374c-11.691406-11.695313-30.722656-11.695313-42.421874 0-11.695313 11.695312-11.695313 30.726562 0 42.421874l21.527343 21.53125c-29.839843 37.167969-46.175781 83.464844-46.175781 131.398438 0 115.792969 94.207031 210 210 210s210-94.207031 210-210c0-47.933594-16.335938-94.230469-46.175781-131.398438zm-6.753907-49.8125c3.902344-3.898437 10.242188-3.894531 14.140626 0 3.894531 3.898438 3.894531 10.242188 0 14.140626l-20.664063 20.660156c-4.65625-4.78125-9.539063-9.339844-14.617187-13.65625zm-207.070312-90.789062c0-5.515625 4.484375-10 10-10h80c5.515625 0 10 4.484375 10 10v16h-100zm70 36v26.945312c-13.253906-1.242187-26.742188-1.242187-40 0v-26.945312zm-191.210938 54.789062c3.898438-3.894531 10.242188-3.898437 14.140626 0l21.140624 21.144532c-5.078124 4.316406-9.960937 8.875-14.617187 13.65625l-20.664063-20.660156c-3.894531-3.898438-3.894531-10.242188 0-14.140626zm171.210938 371.210938c-104.765625 0-190-85.234375-190-190 0-46.214844 16.777344-90.742188 47.238281-125.386719 8.390625-9.542969 17.753907-18.261719 27.828125-25.925781 25.246094-19.210938 55.128906-31.855469 86.417969-36.570312 9.363281-1.402344 18.957031-2.117188 28.515625-2.117188s19.152344.714844 28.511719 2.117188c31.292969 4.714843 61.175781 17.359374 86.425781 36.570312 10.070312 7.664062 19.433594 16.382812 27.824219 25.925781 30.460937 34.644531 47.238281 79.171875 47.238281 125.386719 0 104.765625-85.234375 190-190 190zm0 0"/><path d="m210 332c16.542969 0 30-13.457031 30-30 0-13.035156-8.359375-24.152344-20-28.28125v-71.71875c0-5.523438-4.476562-10-10-10s-10 4.476562-10 10v71.71875c-11.640625 4.128906-20 15.246094-20 28.28125 0 16.542969 13.457031 30 30 30zm0-40c5.515625 0 10 4.484375 10 10s-4.484375 10-10 10-10-4.484375-10-10 4.484375-10 10-10zm0 0"/><path d="m316.527344 196.5c-.15625-.183594-.3125-.367188-.488282-.539062-.1875-.191407-.386718-.363282-.585937-.535157-17.625-17.4375-39.398437-30.339843-63.027344-37.316406-5.300781-1.5625-10.859375 1.460937-12.421875 6.757813-1.5625 5.296874 1.460938 10.859374 6.757813 12.421874 17.507812 5.171876 33.839843 14.109376 47.761719 26.042969l-6.746094 6.746094c-3.902344 3.90625-3.902344 10.238281 0 14.144531 1.953125 1.953125 4.511718 2.929688 7.074218 2.929688 2.558594 0 5.117188-.976563 7.070313-2.929688l6.761719-6.761718c18.09375 21.039062 28.839844 46.9375 30.933594 74.539062h-9.617188c-5.523438 0-10 4.480469-10 10 0 5.523438 4.476562 10 10 10h9.617188c-2.09375 27.605469-12.839844 53.5-30.933594 74.539062l-6.761719-6.761718c-3.90625-3.902344-10.238281-3.902344-14.144531 0-3.90625 3.90625-3.90625 10.238281 0 14.144531l6.761718 6.761719c-21.039062 18.09375-46.9375 28.839844-74.539062 30.9375v-9.621094c0-5.523438-4.476562-10-10-10s-10 4.476562-10 10v9.617188c-27.601562-2.09375-53.5-12.839844-74.539062-30.933594l6.761718-6.761719c3.90625-3.90625 3.90625-10.238281 0-14.144531-3.90625-3.902344-10.238281-3.902344-14.144531 0l-6.761719 6.761718c-18.09375-21.039062-28.839844-46.9375-30.933594-74.539062h9.617188c5.523438 0 10-4.476562 10-10s-4.476562-10-10-10h-9.617188c2.09375-27.601562 12.839844-53.5 30.933594-74.539062l6.761719 6.761718c1.953125 1.953125 4.511719 2.929688 7.070313 2.929688 2.5625 0 5.121093-.976563 7.074218-2.929688 3.902344-3.90625 3.902344-10.238281 0-14.144531l-6.746094-6.746094c13.921876-11.9375 30.253907-20.871093 47.761719-26.042969 5.296875-1.5625 8.320313-7.125 6.757813-12.421874-1.5625-5.296876-7.117188-8.316407-12.421875-6.757813-23.625 6.972656-45.390625 19.871094-63.011719 37.300781-.207031.175782-.410156.355469-.601562.546875-.171876.171875-.324219.351563-.480469.53125-28.042969 28.304688-43.480469 65.742188-43.480469 105.511719 0 39.765625 15.4375 77.199219 43.472656 105.5.15625.183594.3125.367188.488282.539062.171874.175782.351562.328126.53125.484376 28.304687 28.039062 65.738281 43.476562 105.507812 43.476562 39.765625 0 77.199219-15.433594 105.5-43.46875.183594-.160156.367188-.316406.539062-.492188.171876-.167968.324219-.351562.480469-.527343 28.042969-28.304688 43.480469-65.742188 43.480469-105.511719 0-39.765625-15.4375-77.199219-43.472656-105.5zm0 0"/><path d="m210 172c5.519531 0 10-4.480469 10-10s-4.480469-10-10-10-10 4.480469-10 10 4.480469 10 10 10zm0 0"/></svg>
  <div id="countdown-number"></div>
  <svg id="spinny">
      <circle style="animation: countdown ${seconds + 1}s linear;" r="18" cx="20" cy="20"></circle>
      
  </svg>
  <div id="timeMarker" style="height: 25px; width: 75px; background-color: lightgray; border-radius: 7%;" ><p style="text-align: center; cursor: move !important; font-size: 1rem !important; font-weight: normal !important; line-height: 1.5 !important; color: #454546;">${time}</p></div>
  `;

  setInterval(function(){
    if(document.getElementById('timeMarker')){
      document.getElementById('timeMarker').getElementsByTagName('p')[0].innerHTML = `<p style="text-align: center;">${time}</p>`;
      if(document.getElementById('timeMarker').getElementsByTagName('p')[0].innerText == "00:00:00"){
        document.getElementById('timeMarker').getElementsByTagName('p')[0].innerHTML = `<p style="text-align: center; color: darkgreen;">Done <svg style="position: relative; top: 2px;" xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="darkgreen" stroke-width="3" stroke-linecap="square" stroke-linejoin="arcs"><polyline points="20 6 9 17 4 12"></polyline></svg></p>`;;
        
      }
    }
   
  }, 1000);
  document.body.appendChild(timer);
  // injectStyle();
  if(seconds <= 0){
    document.getElementsByTagName('circle')[0].style.stroke = 'lightgray';
    return;
  }
  var countdownNumberEl = document.getElementById('countdown-number');
  var countdown = seconds;
  countdownNumberEl.textContent = countdown;

  var x = setInterval(function() {
    if(--countdown === 0) {
      clearInterval(x);
      document.getElementsByTagName('circle')[0].style.stroke = 'lightgray';
    }
    countdownNumberEl.textContent = countdown;
  }, 1000);

  //Make the DIV element draggagle:
  dragElement(timer);
  timer.style.cursor = 'move';
  function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    
      /* otherwise, move the DIV from anywhere inside the DIV:*/
      elmnt.onmousedown = dragMouseDown;
  

    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // set the element's new position:
      elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
      elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    
    }

    function closeDragElement() {
      /* stop moving when mouse button is released:*/
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }
}
function insertMarkerTop(){
  var marker = document.createElement('div');
  marker.innerHTML = `<p style="text-align: center; cursor: pointer;">Time remaining: ${time}</p>`;
  setInterval(function(){marker.getElementsByTagName('p')[0].innerHTML = `<p style="text-align: center;">Time remaining: ${time}</p>`}, 1000);
  marker.style.position = 'fixed';
  marker.style.top = '25%';
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
    marker.innerHTML = `<p style="text-align: center; cursor: pointer;">Time remaining: ${time}</p>`
  }

  //Make the DIV element draggagle:
  dragElement(marker);
  marker.style.cursor = 'move';
  function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    
      /* otherwise, move the DIV from anywhere inside the DIV:*/
      elmnt.onmousedown = dragMouseDown;
  

    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // set the element's new position:
      elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
      elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    
    }

    function closeDragElement() {
      /* stop moving when mouse button is released:*/
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }
}



function insertMarkerTop(){
  var marker = document.createElement('div');
  marker.innerHTML = `<p style="position: relative; bottom: 5.5px; text-align: center; font-size: 1.3rem !important; line-height: 1.5; font-weight: normal !important; color: #454546;">Time remaining: ${time}</p>`;
  setInterval(function(){
    marker.getElementsByTagName('p')[0].innerHTML = `<p style="position: relative; bottom: 5.5px; text-align: center; font-size: 1.3rem !important; line-height: 1.5; font-weight: normal !important; color: #454546;">Time remaining: ${time}</p>`
    if(marker.getElementsByTagName('p')[0].innerText == "Time remaining: 00:00:00"){
      marker.getElementsByTagName('p')[0].innerHTML = `<p style="position: relative; bottom: 5.5px; text-align: center; font-size: 1.3rem !important; color: darkgreen; line-height: 1.5; font-weight: normal !important;">Study session completed</p>`;
    }
  }, 1000);
  marker.style.position = 'fixed';
  marker.style.top = '28%';
  marker.style.width = '300px';
  marker.style.height = '50px';
  marker.style.backgroundColor = '#f0f0f0';
  marker.style.left = '42%';
  marker.style.zIndex = '100';
  marker.style.boxShadow = '0 0 1px 1px lightgray';
  marker.style.borderRadius = '1%';
  // var currentSubject;
  document.body.appendChild(marker);
  // chrome.storage.sync.get(['subject'], function(result){
  //   if(result.subject == "none"){
  //     currentSubject = "None";
  //   } else if(result.subject == "biology"){
  //     currentSubject = "Biology";
  //   } else if(result.subject == "history"){
  //     currentSubject = "American History"
  //   } else if(result.subject == "collegeApps"){
  //     currentSubject = "College Apps"
  //   } else {
  //     currentSubject = "General Studying"
  //   }
  // })
  // marker.addEventListener('click', enlarge);
  // function enlarge(){
  //   marker.style.height = '150px';
  //   marker.innerHTML = `<b><h4 style="text-align: center;">Study session in progress</h4></b><p style="text-align: center;">Time remaining: ${time}</p><p style="text-align: center;">Current Subject: ${currentSubject}</p>`
    
    
    
  // }
  // marker.addEventListener('mouseout', shrink);
  // function shrink(){
  //   marker.style.height = '50px';
  //   marker.innerHTML = `<p style="text-align: center; cursor: pointer;">Time remaining: ${time}</p>`
  // }

  //Make the DIV element draggagle:
  dragElement(marker);
  marker.style.cursor = 'move';
  function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    
      /* otherwise, move the DIV from anywhere inside the DIV:*/
      elmnt.onmousedown = dragMouseDown;
  

    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // set the element's new position:
      elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
      elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    
    }

    function closeDragElement() {
      /* stop moving when mouse button is released:*/
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }
}

if(!timerOrNot){
  timerOrNot = "on";
}

scrapeUserSite();


chrome.storage.sync.get(['timerWidget'], function(result){
  timerOrNot = result.timerWidget;
  
})


function closeTab(){
  chrome.runtime.sendMessage(chrome.runtime.id, {subject: "close tab"}, null);
}

// setTimeout(closeTab, 5000);


chrome.runtime.onMessage.addListener(
  function(req, sender, sendResponse) {
    if (req.subject == "take away timer") {
      var c = document.querySelector('#countdown');
      document.body.removeChild(c);
      if(document.title == "Off Task!"){
        location.reload();
      }
    }
  }
)

if(document.querySelectorAll('#countdown').length > 1){
  document.body.removeChild(document.querySelectorAll('#countdown')[0]);
}


chrome.runtime.onMessage.addListener(
  function(req, sender, sendResponse) {
    if (req.subject == "site sim") {
      console.log(sim)
      sendResponse({sim: sim})
      // var tags = Array.from(document.querySelectorAll('*'));
      // var f = tags.filter(t => !['script', 'meta', 'link', 'input', 'html', 'body', 'head', 'style', 'img', 'iframe'].includes(t.tagName.toLowerCase()));
      // var t = f.map(
      //     e => Array.from(e.childNodes)
      //      .filter(c => c.nodeName === "#text")
      //   )
      //   .filter(x => x.length)
      //   .map(r =>
      //     r.map(w => w.textContent.trim())
      //     .filter(a => a && a.length > 10)
      //   )
      //   .filter(q => q.length);
      // var text = t.join(' ');
      // sendResponse({text: text})
      
    }
  }
)

//Cursor
// document.querySelectorAll('*').forEach(e => e.style.cursor = "url('https://kari.wisen.space/gekrinr_ubwcstpcbrnukdkz.png'), auto")

// document.querySelectorAll('*').forEach(e => e.style.cursor = "url('https://kari.wisen.space/qf2c3rvlcmkzagjdv0ko0db_.png'), auto")