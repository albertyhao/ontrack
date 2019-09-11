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
console.log(countdown);
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
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {subject: "study session start"}, null);
  });
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
    timerEnd()
  }
}

function timerEnd() {
 
  chrome.runtime.sendMessage(chrome.runtime.id,{timerStop: true}, null);
  
  document.getElementById("timer_start").innerHTML = "Start"
  document.getElementById("timer_clear").style.display = "inline"
  document.querySelector('.dropdown-select').options[0].selected = true;

  chrome.storage.sync.set({subject: document.querySelector('.dropdown-select').value}, null);

  chrome.runtime.sendMessage(chrome.runtime.id, {subject: "change subject"}, null);
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {subject: "change subjects"}, null);
  });

  clearInterval(countdown)
  
}

chrome.runtime.onMessage.addListener(
  function(req, sender, sendResponse) {
    if (req.endTimer) {
      timerEnd()
    }
  }
)

chrome.runtime.sendMessage(chrome.runtime.id, {timeRequest: true}, function (resp) {
  if (resp) {
    document.getElementById("time").innerHTML = resp;

    countdown = setInterval(startTimer, 1000)
    document.getElementById("timer_start").innerHTML = "Stop"
    document.getElementById("timer_clear").style.display = "none"
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
    chrome.storage.sync.set({wlist: ["www.google.com", "www.joinontrack.com", "spcs.instructure.com"]}, null);
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
// function setSubject(){
//   // chrome.storage.sync.get(['subject'], function(result){
//   //   var $subject = result.subject;
//   //   $subject = document.querySelector('.dropdown-select').value;
//   //   chrome.storage.sync.set({subject: $subject}, null);
//   // })
// chrome.storage.sync.set({subject: document.querySelector('.dropdown-select').value}, null);

// chrome.runtime.sendMessage(chrome.runtime.id, {subject: "change subject"}, null);
// chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//   chrome.tabs.sendMessage(tabs[0].id, {subject: "change subjects"}, null);
// });
// }
function timerStart(){
  chrome.storage.sync.set({subject: document.querySelector('.dropdown-select').value}, null);

  chrome.runtime.sendMessage(chrome.runtime.id, {subject: "change subject"}, null);
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {subject: "change subjects"}, null);
  });

  countdown = setInterval(startTimer, 1000)
  document.getElementById("timer_start").innerHTML = "Stop"
  document.getElementById("timer_clear").style.display = "none"
}
//Code for turning on/off extension



// var $powerButton = document.querySelector('#power');
// chrome.storage.sync.get(['on'], function(result){
//   if(result.on === false){
//     $powerButton.innerHTML = "Turn Extension On";
//   } else {
//     $powerButton.innerHTML = "Turn Extension Off";

//   }
// })
// $powerButton.addEventListener('click', powerOnOff);
// function powerOnOff(){
//   if($powerButton.innerText == "Turn Extension On"){
//     $powerButton.innerHTML = "Turn Extension Off";
//     chrome.storage.sync.set({on: true}, null);
//     var final = new Date();
//     chrome.storage.sync.set({on: true}, null);   
//     chrome.storage.sync.set({ontime: final}, null);    
//     chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//       chrome.tabs.sendMessage(tabs[0].id, {subject: "turn on"}, null);
//     });
//   } else {
//     $powerButton.innerHTML = "Turn Extension On";
//     var final = new Date();
//     chrome.storage.sync.set({on: false}, null);
//     chrome.storage.sync.set({offtime: final}, null);
//     chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//       chrome.tabs.sendMessage(tabs[0].id, {subject: "turn off"}, null);
//     });
//   }
// }



// Code for enhanced blocking mode
// chrome.storage.sync.set({blist: []}, null);
// var $button = document.querySelector('#superBlock');
//      $button.addEventListener('click', toggleSuperBlock);
//      function toggleSuperBlock(){
//        if($button.innerText == 'Turn on enhanced mode!'){
//         $button.innerText = "Turn off enhanced mode!";
//         chrome.storage.sync.get(['blist'], function(result){
//           var $blacklist = result.blist;
//           $blacklist.push('extensions');
//           chrome.storage.sync.set({blist: $blacklist}, null);
//         })

//        } else {
//          $button.innerText = "Turn on enhanced mode!";
//        }

//      }

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

//Open menu with hamburger
var hamburger = document.querySelector('#options');
hamburger.addEventListener('click', openMenu);
function openMenu(){
  var table = document.querySelector('#table');
  if(table.style.visibility === 'hidden'){
    table.style.visibility = 'visible';
  } else {
    table.style.visibility = 'hidden';
  }
  
}
//Code for opening and closing settings menu
var settingsButton = document.querySelector('#openSettings');
settingsButton.addEventListener('click', openSettings);
function openSettings(){
  document.querySelector('#settings').style.visibility = 'visible';
  document.querySelector('#table').style.visibility = 'hidden';
}

var exitSettings = document.querySelector('#exitSettings');
exitSettings.addEventListener('click', exitSettingsPage);
function exitSettingsPage(){
  document.querySelector('#settings').style.visibility = 'hidden';
}

var $whitelist = document.querySelector('#openWhitelistPanel');
$whitelist.addEventListener('click', openWhitelist);
function openWhitelist(){
  document.querySelector('#overlay').style.visibility = 'visible';
  document.querySelector('#whitelistPanel').style.visibility = 'visible';
  document.querySelector('#table').style.visibility = 'hidden';
}

document.querySelector('#exitWhitelistPanel').addEventListener('click', exitWhitelist);
function exitWhitelist(){
  document.querySelector('#table').style.visibility = 'hidden';
  document.querySelector('#overlay').style.visibility = 'hidden';
  document.querySelector('#whitelistPanel').style.visibility = 'hidden';
  document.querySelector('#warning').style.visibility = 'hidden';
  
}

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
  for(i=0; i<3; i++){
    var radios = document.getElementsByName('mode');
    var val;
    if(radios[i].checked === true){
      val = radios[i].value;
    }
    
  }
  chrome.storage.sync.set({mode: val}, null);
  chrome.runtime.sendMessage(chrome.runtime.id, {subject: "change mode", cutoff: val}, null);
  
  
  
}

chrome.storage.sync.get(['mode'], function(result){
  if(!result.mode){
    chrome.storage.sync.set({mode: "0.4"}, null);
  } else {
    chrome.storage.sync.set({mode: result.mode}, null);
    checkSetting(result.mode);
  }
})

function checkSetting(val) {
	var rs =document.getElementsByName('mode');
	rs.forEach(r => {
		if(r.value === val) {
			r.checked = true;
        }
    });
}

