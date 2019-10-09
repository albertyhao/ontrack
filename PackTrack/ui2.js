

document.addEventListener('keypress', function(e) {
  if (document.getElementById("timer_start").innerHTML == "Start") {
    var nums = "0123456789"
    if (nums.includes(e.key)) {
      addNumToTimer(parseInt(e.key))
    }
  }
})

function addNumToTimer(n) {
  var time = document.getElementById("time").innerHTML
  time = time.replace(":", "").replace(":", "");
  time = time.substr(1) + n;
  time = time.substr(0, 2) + ":" + time.substr(2, 2) + ":" + time.substr(4, 2)
  document.getElementById("time").innerHTML = time
}

document.getElementById("timer_clear").addEventListener('click', function(e) {
  document.getElementById("time").innerHTML = "00:00:00"
})

var countdown;
var originalSubject;

document.getElementById("timer_start").addEventListener('click', function(e) {
  if (document.getElementById("timer_start").innerHTML == "Start" && document.querySelector('#time').innerHTML !== "00:00:00" && document.querySelector('.dropdown-select').value !== "none") {
    confirmValidity()

    chrome.runtime.sendMessage(chrome.runtime.id,
      {timer: document.getElementById("time").innerHTML}, null)

    timerStart()
  } else if (document.getElementById("timer_start").innerHTML == "Stop") {
    chrome.runtime.sendMessage(chrome.runtime.id,
      {timerStop: true}, null)

    timerEnd()
  }
})

function confirmValidity() {
  var time = document.getElementById("time").innerHTML

  var hr = parseInt(time.substr(0, 2))
  var min = parseInt(time.substr(3, 2))
  var sec = parseInt(time.substr(6, 2))

  if (sec > 59) {
    var add = Math.floor(sec / 60)
    sec = sec % 60
    min += add
  }

  if (min > 59) {
    var add = Math.floor(min / 60)
    min = min % 60
    hr += add
  }

  if (sec / 10 < 1) {
    sec = "0" + String(sec)
  } else {
    sec = String(sec)
  }

  if (min / 10 < 1) {
    min = "0" + String(min)
  } else {
    min = String(min)
  }

  if (hr / 10 < 1) {
    hr = "0" + String(hr)
  } else {
    hr = String(hr)
  }

  document.getElementById("time").innerHTML = hr + ":" + min + ":" + sec
}

function startTimer() {
  var time = document.getElementById("time").innerHTML

  var hr = parseInt(time.substr(0, 2))
  var min = parseInt(time.substr(3, 2))
  var sec = parseInt(time.substr(6, 2))

  if (sec !== 0 || min !== 0 || hr !== 0) {
    sec -= 1
    if (sec < 0) {
      sec = 59
      min -= 1
      if (min < 0) {
        min = 59
        hr -= 1
      }
    }

    if (sec / 10 < 1) {
      sec = "0" + String(sec)
    } else {
      sec = String(sec)
    }

    if (min / 10 < 1) {
      min = "0" + String(min)
    } else {
      min = String(min)
    }

    if (hr / 10 < 1) {
      hr = "0" + String(hr)
    } else {
      hr = String(hr)
    }

    document.getElementById("time").innerHTML = hr + ":" + min + ":" + sec
  } else {
     
    // document.querySelector(".container").innerHTML = `<h1 style="color: #736cdb; text-align: center; font-size: 20px;">Break</h1>`
 
    
    // document.getElementById("time").innerHTML = "00:05:00"
    // clearInterval(countdown)
    // countdown = setInterval(breakStart, 1000);
  }
}

function breakStart() {
  var time = document.getElementById("time").innerHTML

  var hr = parseInt(time.substr(0, 2))
  var min = parseInt(time.substr(3, 2))
  var sec = parseInt(time.substr(6, 2))

  if (sec !== 0 || min !== 0 || hr !== 0) {
    sec -= 1
    if (sec < 0) {
      sec = 59
      min -= 1
      if (min < 0) {
        min = 59
        hr -= 1
      }
    }

    if (sec / 10 < 1) {
      sec = "0" + String(sec)
    } else {
      sec = String(sec)
    }

    if (min / 10 < 1) {
      min = "0" + String(min)
    } else {
      min = String(min)
    }

    if (hr / 10 < 1) {
      hr = "0" + String(hr)
    } else {
      hr = String(hr)
    }

    document.getElementById("time").innerHTML = hr + ":" + min + ":" + sec
  } else {
    clearInterval(countdown)
    chrome.runtime.sendMessage(chrome.runtime.id, {ogSubject: true}, function(resp) {
      var currentSubject;
      if(resp.subject == "biology"){
        currentSubject = "Biology";
      } else if(resp.subject == "history"){
        currentSubject = "American History";
      } else if(resp.subject == "collegeApps"){
        currentSubject = "College Apps"
      } else if(resp.subject == "break") {
        currentSubject = "Break"
      } else if(resp.subject == "whitelist"){
        currentSubject = "Whitelist";
      } else if(resp.subject == "physics"){
        currentSubject = "Physics"
      } else if(resp.subject == "chemistry") {
        currentSubject = "Chemistry"
      } else if(resp.subject == "economics"){
        currentSubject = "Economics"
      } else if(resp.subject == "calculus"){
        currentSubject = "Calculus"
      } else if(resp.subject == "linearAlgebra") {
        currentSubject = "Linear Algebra"
      } 
      else {
        
      }


      document.querySelector(".container").innerHTML = `<h1 style="color: #736cdb; text-align: center; font-size: 20px;">${currentSubject}</h1>`
    })
    // document.querySelector(".container").innerHTML = `<h1 style="color: #736cdb; text-align: center; font-size: 20px;">${originalSubject}</h1>`
    countdown = setInterval(startTimer, 1000);
  }
}

function timerEnd() {

  chrome.runtime.sendMessage(chrome.runtime.id,{timerStop: true}, null);
  document.querySelector(".container").innerHTML = `
  <div class = "dropdown">
           <select class = "dropdown-select">
             <option value="none">None</option>
             <option value="physics">Physics</option>
             <option value="biology">Biology</option>
             <option value="chemistry">Chemistry</option>
             <option value="history">American History</option>
             <option value="economics">Economics</option>
             <option value="calculus">Calculus</option>
             <option value="linearAlgebra">Linear Algebra</option>
             <option value="collegeApps">College Apps</option>
             <option value="whitelist">Whitelist</option>
           </select>
         </div>
  `;
  document.getElementById("timer_start").innerHTML = "Start"
  document.getElementById("timer_clear").style.display = "inline"
  document.querySelector('.dropdown-select').options[0].selected = true;

  chrome.storage.sync.set({subject: document.querySelector('.dropdown-select').value}, null);

  chrome.runtime.sendMessage(chrome.runtime.id, {subject: "change subject"}, null);

  clearInterval(countdown)

  // Code to reload every tab except the one user is on
  var tabIds = [];
  chrome.tabs.query({}, function (tabs) {
    for (var i = 0; i < tabs.length; i++) {
      tabIds.push(tabs[i].id);
      chrome.tabs.executeScript(tabIds[i], {file: 'contentscript.js'});
    }
  });

//   chrome.tabs.query({}, function (tabs) {
//     for (var i = 0; i < tabs.length; i++) {
//       if(tabs[i].title == "Off Task!"){
//         chrome.tabs.update(tabs[i].id, {url: tabs[i].url});
//       } else {
//         var c = document.querySelector('#countdown');
//         document.body.removeChild(c);
//       }

//       }
//   });
//   //Code to enable enhanced block selection
  var ebnodes = document.getElementsByName('enhanced');
  for(i=0; i<2; i++){
    ebnodes[i].disabled = false;
  }

  document.getElementById("timer_start").disabled = false;
  document.getElementById("timer_start").style.visibility = 'visible';
  document.querySelector('#enhancedWarning').style.display = 'block';

}

chrome.runtime.onMessage.addListener(
  function(req, sender, sendResponse) {
    if (req.endTimer) {
      timerEnd()
    }
  }
)

chrome.runtime.onMessage.addListener(
  function(req, sender, sendResponse) {
    if (req.breakTimer) {
      document.querySelector(".container").innerHTML = `<h1 style="color: #736cdb; text-align: center; font-size: 20px;">Break</h1>`
 
    
      document.getElementById("time").innerHTML = "00:05:00"
      clearInterval(countdown)
      countdown = setInterval(breakStart, 1000);
    }
  }
)

chrome.runtime.sendMessage(chrome.runtime.id, {timeRequest: true}, function (resp) {
  if (resp && resp !== "00:00:00") {
    document.getElementById("time").innerHTML = resp;

    countdown = setInterval(startTimer, 1000)
    //Checks whether enhanced block is on
    var enhancedMode;
    chrome.storage.sync.get(['enhanced'], function(result){
      enhancedMode = result.enhanced;
      if(enhancedMode == "on"){
        document.getElementById("timer_start").disabled = true;
        document.getElementById("timer_start").style.visibility = 'hidden';

      } else {
        document.getElementById("timer_start").disabled = false;
        document.getElementById("timer_start").style.visibility = 'visible';
      }
    })
    document.getElementsByName('enhanced').forEach(e => e.disabled = true);
    document.querySelector('#enhancedWarning').style.display = 'none';
    document.getElementById("timer_start").innerHTML = "Stop"
    document.getElementById("timer_clear").style.display = "none"
    document.getElementById("selection").innerHTML = "Study session in progress"
    chrome.storage.sync.get(['subject'], function(result){
      var currentSubject;
      if(result.subject == "biology"){
        currentSubject = "Biology";
      } else if(result.subject == "history"){
        currentSubject = "American History";
      } else if(result.subject == "collegeApps"){
        currentSubject = "College Apps"
      } else if(result.subject == "break") {
        currentSubject = "Break"
      } else if(result.subject == "whitelist"){
        currentSubject = "Whitelist";
      } else if(result.subject == "physics"){
        currentSubject = "Physics"
      } else if(result.subject == "chemistry") {
        currentSubject = "Chemistry"
      } else if(result.subject == "economics"){
        currentSubject = "Economics"
      } else if(result.subject == "calculus"){
        currentSubject = "Calculus"
      } else if(result.subject == "linearAlgebra") {
        currentSubject = "Linear Algebra"
      } 
      else {
        
      }
      document.querySelector(".container").innerHTML = `<h1 style="color: #736cdb; text-align: center; font-size: 20px;">${currentSubject}</h1>`
    })
  }
})


//Getting customer ID for data
chrome.storage.sync.get(['customerid'], function(result) {

  if (!result || Object.keys(result).length === 0) {
    result = ((new Date()*1) + Math.random())
    result = (result + '').replace('.', 'a');
    // document.querySelector('#console').innerHTML = JSON.stringify(result);
    chrome.storage.sync.set({customerid: result}, function(){
      var xhr = new XMLHttpRequest();
      xhr.open("GET", `http://ontrackserver.herokuapp.com?id=${result}`, true);
      xhr.send();
    })
  }
})



chrome.storage.sync.get(['wlist'], function(result){
  if(!result.wlist){
    chrome.storage.sync.set({wlist: ["www.google.com", "www.joinontrack.com", "spcs.instructure.com", "mail.google.com", "drive.google.com", "sheets.google.com", "docs.google.com", "slides.google.com", "forms.google.com"]}, null);
  } else {
    var $new = result.wlist.filter(i => i !== "www.netflix.com");
    chrome.storage.sync.set({wlist: $new}, null);
  }
})

document.getElementById('wlistSite').addEventListener('click', saveWhitelist);

function saveWhitelist(){
  if(document.querySelector('#whitelist').value.split('.').length < 2){
    document.getElementById('warning').style.visibility = 'visible';
  } else {
    chrome.storage.sync.get(['wlist'], function(result){
      var blankArray = result.wlist;
      blankArray.push(document.querySelector('#whitelist').value);
      chrome.storage.sync.set({wlist: blankArray}, null);
      document.querySelector('#whitelist').value = "";
    })
    document.getElementById('warning').style.visibility = 'hidden';
  }



}

//Code for saving subject


// var subjectButton = document.querySelector('#submit');
// subjectButton.addEventListener('click', setSubject);

chrome.storage.sync.get(['subject'], function(result){
  if(!result.subject || !document.querySelector('.dropdown-select').value){
    chrome.storage.sync.set({subject: "none"}, null);
  } else {
    document.querySelector('.dropdown-select').value = result.subject;
  chrome.storage.sync.set({subject: document.querySelector('.dropdown-select').value}, null);
  }

})

function timerStart(){

  chrome.storage.sync.set({subject: document.querySelector('.dropdown-select').value}, null);
  // chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  //   chrome.tabs.sendMessage(tabs[0].id, {subject: "study session start"}, null);
  // });
  chrome.runtime.sendMessage(chrome.runtime.id, {subject: "change subject"}, null);
  // chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  //   chrome.tabs.sendMessage(tabs[0].id, {subject: "change subjects"}, null);
  // });
  var tabIds = [];
  chrome.tabs.query({}, function (tabs) {
    for (var i = 0; i < tabs.length; i++) {
      tabIds.push(tabs[i].id);
      chrome.tabs.executeScript(tabIds[i], {file: 'contentscript.js'});
    }
  });




  countdown = setInterval(startTimer, 1000)
  document.getElementById("timer_start").innerHTML = "Stop"
  document.getElementById("timer_clear").style.display = "none"
  document.getElementById("selection").innerHTML = "Study session in progress"
  chrome.storage.sync.get(['subject'], function(result){
    var currentSubject;
    if(result.subject == "biology"){
      currentSubject = "Biology";
    } else if(result.subject == "physics"){
      currentSubject = "Physics"
    } else if(result.subject == "collegeApps"){
      currentSubject = "College Apps"
    } else if(result.subject == "chemistry"){
      currentSubject = "Chemistry"
    } else if(result.subject == "history"){
      currentSubject = "American History"
    } else if(result.subject == "economics"){
      currentSubject = "Economics"
    } else if(result.subject == "calculus"){
      currentSubject = "Calculus"
    } else if(result.subject == "linearAlgebra"){
      currentSubject = "Linear Algebra"
    } else {
      currentSubject = "Whitelist";
    }
    document.querySelector(".container").innerHTML = `<h1 style="color: #736cdb; text-align: center; font-size: 20px;">${currentSubject}</h1>`
  })

  document.getElementsByName('enhanced').forEach(e => e.disabled = true);
  document.querySelector('#enhancedWarning').style.display = 'none';


  //Checks whether enhanced block is on
  var enhancedMode;
  chrome.storage.sync.get(['enhanced'], function(result){
    enhancedMode = result.enhanced;
    if(enhancedMode == "on"){
      document.getElementById("timer_start").disabled = true;
      document.getElementById("timer_start").style.visibility = 'hidden';

    } else {
      document.getElementById("timer_start").disabled = false;
      document.getElementById("timer_start").style.visibility = 'visible';
    }
  })



  //Code to make enhanced block unclickable
  // var ebnodes = document.getElementsByName('enhanced');
  // for(i=0; i<2; i++){
  //   ebnodes[i].disabled = true;
  // }
  //Code to reload every tab except the one user is on
  // var tabUrls = [];
  // chrome.tabs.query({}, function (tabs) {
  //   for (var i = 0; i < tabs.length; i++) {
  //     tabUrls.push(tabs[i].url);
  //     }
  // });
  // var currentTabNum;
  // chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  //   currentTabNum = tabUrls.indexOf(tabs[0].url);
  // });

  // chrome.tabs.query({}, function (tabs) {
  //   for (var i = 0; i < tabs.length; i++) {
  //     if(i === currentTabNum){
  //       continue;
  //     }
  //     chrome.tabs.update(tabs[i].id, {url: tabs[i].url});
  //     }
  // });
}



//code for unblocking current site
chrome.storage.sync.set({qblock: []}, null);
var $unblock = document.querySelector('#unblock');
$unblock.addEventListener('click', unblockSite);

function unblockSite(){
  var getLocation = function(href){
    var l = document.createElement('a');
    l.href = href;
    return l;
  }
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var l = getLocation(tabs[0].url);
    var $hostname = l.hostname;
    chrome.storage.sync.get(['qblock'], function(result){
      var blankArray = result.qblock;
      blankArray.push($hostname);
      chrome.storage.sync.set({qblock: blankArray}, null);
    })
});

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {subject: "unblock"}, null);
  });

}

document.getElementById("settingsTab").addEventListener('click', function(e) {
  document.getElementById("settings").style.visibility = "visible";
  document.getElementById("settings-icon").style.borderBottom = "3px solid rgb(113, 109, 218)";
  document.getElementById("whitelistPanel").style.visibility = "hidden";
  document.getElementById("whitelist-icon").style.borderBottom = "3px solid rgb(255, 255, 255)";
  document.getElementById("home").style.visibility = "hidden";
  document.getElementById("home-icon").style.borderBottom = "3px solid rgb(255, 255, 255)";
})

document.getElementById("whitelistTab").addEventListener('click', function(e) {
  document.getElementById("settings").style.visibility = "hidden";
  document.getElementById("settings-icon").style.borderBottom = "3px solid rgb(255, 255, 255)";
  document.getElementById("whitelistPanel").style.visibility = "visible";
  document.getElementById("whitelist-icon").style.borderBottom = "3px solid rgb(113, 109, 218)";
  document.getElementById("home").style.visibility = "hidden";
  document.getElementById("home-icon").style.borderBottom = "3px solid rgb(255, 255, 255)";
})

document.getElementById("homeTab").addEventListener('click', function(e) {
  document.getElementById("settings").style.visibility = "hidden";
  document.getElementById("settings-icon").style.borderBottom = "3px solid rgb(255, 255, 255)";
  document.getElementById("whitelistPanel").style.visibility = "hidden";
  document.getElementById("whitelist-icon").style.borderBottom = "3px solid rgb(255, 255, 255)";
  document.getElementById("home").style.visibility = "visible";
  document.getElementById("home-icon").style.borderBottom = "3px solid rgb(113, 109, 218)";
})

//Opening and closing tutorial menu
var openTut = document.querySelector('#openTutorial');
openTut.addEventListener('click', openTutorial);
function openTutorial(){
  document.querySelector('#tutorial').style.visibility = "visible";
}

document.querySelector('#exitTutorial').addEventListener('click', closeTutorial);
function closeTutorial(){
  document.querySelector('#tutorial').style.visibility = "hidden";
}

//Code for grabbing settings data

var $saveSettings = document.querySelector('#saveSettings');
$saveSettings.addEventListener('click', saveSettings);
function saveSettings(){
  var i;
  for(i=0; i<3; i++){
    var radios = document.getElementsByName('mode');
    var val;
    if(radios[i].checked === true){
      val = radios[i].value;
    }

  }
  for(i=0; i<2; i++){
    var tradios = document.getElementsByName('timer');;
    var tval;
    if(tradios[i].checked === true){
      tval = tradios[i].value;
    }
  }

  for(i=0; i<2; i++){
    var eb = document.getElementsByName('enhanced');
    var ebval;
    if(eb[i].checked === true){
      ebval = eb[i].value;

    }
  }
  
  for(i=0; i<2; i++){
    var p = document.getElementsByName('pomodoro');
    var pval;
    if(p[i].checked === true){
      pval = p[i].value;
    }
  }
  chrome.storage.sync.set({mode: val}, null);
  chrome.runtime.sendMessage(chrome.runtime.id, {subject: "change mode", cutoff: val}, null);

  chrome.storage.sync.set({timerWidget: tval}, null);

  chrome.storage.sync.set({enhanced: ebval}, null);

  chrome.storage.sync.set({timer: pval}, null);
  chrome.runtime.sendMessage(chrome.runtime.id, {subject: "pomodoro", value: pval}, null);

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {subject: "timer on and off"}, null);
  });



  var tabIds = [];
  chrome.tabs.query({}, function (tabs) {
    for (var i = 0; i < tabs.length; i++) {
      tabIds.push(tabs[i].id);
      chrome.tabs.executeScript(tabIds[i], {file: 'contentscript.js'});
    }
  });

}

chrome.storage.sync.get(['mode'], function(result){
  if(!result.mode){
    chrome.storage.sync.set({mode: "0.4"}, null);
  } else {
    chrome.storage.sync.set({mode: result.mode}, null);
    checkSetting1(result.mode);
  }
})

chrome.storage.sync.get(['timerWidget'], function(result){
  if(!result.timerWidget){
    chrome.storage.sync.set({timerWidget: "on"}, null);
  } else {
    chrome.storage.sync.set({timerWidget: result.timerWidget}, null);
    checkSetting2(result.timerWidget);
  }
})

chrome.storage.sync.get(['enhanced'], function(result){

  if(!result.enhanced){
    chrome.storage.sync.set({enhanced: "off"}, null);
  } else {
    chrome.storage.sync.set({enhanced: result.enhanced}, null);
    checkSetting3(result.enhanced);
  }
})

chrome.storage.sync.get(['timer'], function(result){

  if(!result.timer){
    chrome.storage.sync.set({timer: "normal"}, null);
  } else {
    chrome.storage.sync.set({timer: result.timer}, null);
    checkSetting4(result.timer);
  }
})

function checkSetting1(val) {
  var rs =document.getElementsByName('mode');

	rs.forEach(r => {
		if(r.value === val) {
			r.checked = true;
        }
    });
}

function checkSetting2(val) {

  var ts = document.getElementsByName('timer');


  ts.forEach(t => {
    if(t.value === val) {
      t.checked = true;
        }
    });

}

function checkSetting3(val) {

  var eb = document.getElementsByName('enhanced');

  eb.forEach(e => {
    if(e.value === val) {
      e.checked = true;
        }
    });
}

function checkSetting4(val) {
  var ps =document.getElementsByName('pomodoro');

	ps.forEach(p => {
		if(p.value === val) {
			p.checked = true;
        }
    });
}

document.querySelector("#enhancedWarning").addEventListener('click', warning);
function warning(){
  alert("The enhanced block mode will not allow you to stop your study session before time is up. Proceed with caution!")
}
