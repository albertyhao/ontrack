//Push stuff
// const timervalue = '00:00:00';
const timerElements = Array.from(document.querySelectorAll(".timerDigit"));

// timerElements.forEach((t, i) => {
//   // t.addEventListener('click', timeInput);
//   t.setAttribute("contenteditable", true);

//   t.addEventListener('keydown', function(f){

//     if('0123456789'.includes(f.key)) {
//       t.innerHTML = "0"
//       t.addEventListener('keydown', function(e){
//         setTimeout(function() {
//           if(i < timerElements.length - 1) timerElements[i+1].focus();
//         }, 0)
//         t.innerHTML = f.key;
//       });
//    })
// });

timerElements.forEach(t => {
  t.addEventListener('focus', numbersOnly);
  function numbersOnly() {
    document.addEventListener('keydown',function(e){
      if(e.key === "Backspace"){

      } else if(!'0123456789'.includes(e.key)){
        t.blur();
      }
    })
  }
})


//       return;
//     }
//     e.preventDefault();
//     e.stopImmediatePropagation();
//     e.stopPropagation();
//     return false;

//   })
// });



// function timeInput(){

//   document.getElementById('time').style.border = '2px solid #736cdb';
//   document.getElementById('time').style.borderRadius = '10px';
//   document.getElementById('time').style.padding = '1px';
//   document.getElementById('time').style.color = 'gray';
// }
// document.querySelector('#editTimer').style.visibility = 'hidden';
// document.querySelector('.timer').addEventListener('mouseover', revealEdit);
// function revealEdit(){
//   document.querySelector('#editTimer').style.visibility = 'visible';
//   timerElements.forEach(t => {
//     t.style.color = 'lightgray';
//   })
// }
// document.querySelector('.timer').addEventListener('mouseout', hideEdit);
// function hideEdit(){
//   document.querySelector('#editTimer').style.visibility = 'hidden';
// }
timerElements.forEach(t => {
  t.addEventListener('click', byePlaceholder);
  function byePlaceholder(){
    t.removeAttribute('placeholder');
  }
  t.addEventListener('blur', addPlaceholder);
  function addPlaceholder(){

    t.setAttribute('placeholder', '00');
    if(t.value.length < 2 && t.value.length > 0){
      t.value = "0" + t.value;
    } else if(t.value.length < 1){
      t.value = "00"
    }
  }
})

document.getElementById("timer_clear").addEventListener('click', function(e) {
  timerElements.forEach(t => t.value = "00");
})

var countdown;

document.getElementById("timer_start").addEventListener('click', function(e) {

 timerElements.forEach(t => {
    if(t.value == ''){ // fixed the NaN timer error
      t.value = "00"
    }
  })
  var timeSend = timerElements[0].value +":"+ timerElements[1].value +":"+ timerElements[2].value

  console.log(timeSend)
  if (document.getElementById("timer_start").innerHTML == "Start" && timeSend !== "00:00:00" && document.querySelector('.dropdown-select').value !== "none") {
    confirmValidity()
    console.log("msg sent")
    chrome.runtime.sendMessage(chrome.runtime.id,
      {timer: timeSend}, null)

  timerElements.forEach(t => {
    t.style.border = '1.5px inset';
    t.setAttribute('disabled', true);

  })

    timerStart()
  } else if (document.getElementById("timer_start").innerHTML == "Stop") {
    chrome.runtime.sendMessage(chrome.runtime.id,
      {timerStop: true}, null)

    timerEnd()
  }



  var subjectDrop = document.getElementsByClassName("dropdown-select")[0];
    if(subjectDrop.value ==="none"){
      document.getElementById("subjectReq").style.visibility = "visible";
    }

subjectDrop.addEventListener('change', checkSubjectStatus);
  function checkSubjectStatus(){
    if(subjectDrop.value !== "none"){
      document.getElementById("subjectReq").style.visibility = "hidden";
    }
  }
})
function confirmValidity() {

  var hr = parseInt(timerElements[0].value)
  var min = parseInt(timerElements[1].value)
  var sec = parseInt(timerElements[2].value)

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

  timerElements[0].value = hr;
  timerElements[1].value = min;
  timerElements[2].value = sec;

}

function startTimer() {
  var hr = parseInt(timerElements[0].value)
  var min = parseInt(timerElements[1].value)
  var sec = parseInt(timerElements[2].value)

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

    timerElements[0].value = hr;
    timerElements[1].value = min;
    timerElements[2].value = sec;
  } else {
    timerEnd()
  }
}

function timerEnd() {
  timerElements.forEach(t => {
    t.style.border = '2px solid #736cdb';
    t.removeAttribute('disabled');
    t.value = "";
    t.setAttribute("placeholder", "00");
  })
  chrome.runtime.sendMessage(chrome.runtime.id,{timerStop: true}, null);
  document.querySelector(".container").innerHTML = `<div class = "dropdown">
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
</div>`;
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

  timerElements.forEach(t => {
    if(t.value === ''){
      t.value = "00";
    }
  })
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
    var p = resp.split(':');
    timerElements[0].value = p[0];
    timerElements[1].value = p[1];
    timerElements[2].value = p[2];
    timerElements.forEach(t => {
      t.style.border = '1.5px inset';
      t.setAttribute('disabled', true);

    })

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
  // document.getElementById('time').style.border = 'none';
  // document.getElementById('time').style.color = 'black';
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
      } else if(result.subject == "history"){
        currentSubject = "American History";
      } else if(result.subject == "collegeApps"){
        currentSubject = "College Apps"
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




//code for unblocking current site
chrome.storage.sync.set({qblock: []}, null);
var $unblock = document.querySelector('#unblock');
$unblock.addEventListener('click', unblockGoodSite);

function unblockGoodSite(){
  //Makes request for site text from content script and then makes request to background to check similarity
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {subject: "site text"}, function(response){
      var siteText = response.text;

      chrome.runtime.sendMessage(chrome.runtime.id, {subject: "check sim for unblock", txt: siteText}, function(response) {
        console.log(response)
        if(response.sim > 0.1){
          unblockSite();
        }
      })


    });
  });
}

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
// var hamburger = document.querySelector('#options');
// hamburger.addEventListener('click', openMenu);
// function openMenu(){
//   var table = document.querySelector('#table');
//   if(table.style.visibility === 'hidden'){
//     table.style.visibility = 'visible';
//   } else {
//     table.style.visibility = 'hidden';
//   }
//
// }
//Code for opening and closing settings menu
// var settingsButton = document.querySelector('#openSettings');
// settingsButton.addEventListener('click', openSettings);
// function openSettings(){
//   document.querySelector('#settings').style.visibility = 'visible';
//   document.querySelector('#table').style.visibility = 'hidden';
// }

// var exitSettings = document.querySelector('#exitSettings');
// exitSettings.addEventListener('click', exitSettingsPage);
// function exitSettingsPage(){
//   document.querySelector('#settings').style.visibility = 'hidden';
// }

document.getElementById("settingsTab").addEventListener('click', function(e) {
  document.getElementById("settings").style.visibility = "visible";
  document.getElementById("settings-icon").style.borderBottom = "3px solid rgb(113, 109, 218)";
  document.getElementById("whitelistPanel").style.visibility = "hidden";
  document.getElementById("whitelist-icon").style.borderBottom = "3px solid rgb(255, 255, 255)";
  document.getElementById("home").style.visibility = "hidden";
  document.getElementById("home-icon").style.borderBottom = "3px solid rgb(255, 255, 255)";
})

// var $whitelist = document.querySelector('#openWhitelistPanel');
// $whitelist.addEventListener('click', openWhitelist);
// function openWhitelist(){
//   document.querySelector('#overlay').style.visibility = 'visible';
//   document.querySelector('#whitelistPanel').style.visibility = 'visible';
//   document.querySelector('#table').style.visibility = 'hidden';
// }
//
// document.querySelector('#exitWhitelistPanel').addEventListener('click', exitWhitelist);
// function exitWhitelist(){
//   document.querySelector('#table').style.visibility = 'hidden';
//   document.querySelector('#overlay').style.visibility = 'hidden';
//   document.querySelector('#whitelistPanel').style.visibility = 'hidden';
//   document.querySelector('#warning').style.visibility = 'hidden';
//
//

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
    var eb = document.getElementsByName('enhanced');;
    var ebval;
    if(eb[i].checked === true){
      ebval = eb[i].value;

    }
  }
  chrome.storage.sync.set({mode: val}, null);
  chrome.runtime.sendMessage(chrome.runtime.id, {subject: "change mode", cutoff: val}, null);
  chrome.storage.sync.set({timerWidget: tval}, null);

  chrome.storage.sync.set({enhanced: ebval}, null);

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
    chrome.storage.sync.set({mode: "0.2"}, null);
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

document.querySelector("#enhancedWarning").addEventListener('click', warning);
function warning(){
  alert("The enhanced block mode force you to finish your study session by taking away the stop button. Proceed with caution!")
}



//Welcome page js

chrome.storage.sync.get(['welcomed'], function(result){
  if(!result.welcomed){
    chrome.storage.sync.set({welcomed: "no"});
  } else {
    chrome.storage.sync.set({welcomed: result.welcomed});
  }
})

var welcomed;

chrome.storage.sync.get(['welcomed'], function(result){
  welcomed = result.welcomed;
  if(welcomed == 'no'){
    document.querySelector('#welcomeModal').style.visibility = 'visible';
  } else {
    document.querySelector('#welcomeModal').style.visibility = 'hidden';

  }
})



document.querySelector('#skipInfo').addEventListener('click', skipPage);
function skipPage(){

  document.querySelector('#welcomeModal').style.visibility = 'hidden';
  chrome.storage.sync.set({welcomed: "yes"})
}

document.querySelector('#user').addEventListener('blur', submitValidity);
document.querySelector('#mail').addEventListener('blur', submitValidity);

function submitValidity(){
  var $username = document.getElementById('user');
  var $email = document.getElementById('mail');
  if($username.value.length > 1 && $email.value.length > 10 && $email.value.includes('@')){
    injectWelcomeStyle();
    document.querySelector('#submitInfo').addEventListener('click', postInfo);
    function postInfo(){
      chrome.storage.sync.set({welcomed: "yes"});
      chrome.storage.sync.set({name: $username.value});
      chrome.storage.sync.set({email: $email.value})
      document.querySelector('#welcomeModal').style.visibility = 'hidden';
    }

  }
}

function injectWelcomeStyle(){
  var style = `
  #submitInfo {
    border: 2px solid #736cdb;
    padding: 6px 16px;
    border-radius: 12px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    text-decoration: none;
    outline: none;
    background: #fff;
    color: #736cdb;
    font-size: 11px;
  }
  #submitInfo:hover {
    background: #736cdb;
    color: #fff;
    border: 2px solid #736cdb;
    border-radius: 12px;
  }
  `
var s = document.createElement('style')
s.innerHTML = style;
document.head.appendChild(s)
}
