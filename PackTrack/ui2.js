const timerElements = Array.from(document.querySelectorAll(".timerDigit"));

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
    } else if(t.value.length == 0){
      t.value = ""
      t.setAttribute('placeholder', '00');
    }
  }
})


document.getElementById("timer_clear").addEventListener('click', function(e) {
  timerElements.forEach(t => {
    t.value = "";
    t.setAttribute('placeholder', '00');
  });
})

var countdown;

document.getElementById("timer_start").addEventListener('click', function(e) {

 timerElements.forEach(t => {
    if(t.value == ''){ // fixed the NaN timer error
      t.value = "00"
    }
  })
  var timeSend = timerElements[0].value +":"+ timerElements[1].value +":"+ timerElements[2].value

  // console.log(timeSend)
  if (document.getElementById("timer_start").innerHTML == "Start" && timeSend !== "00:00:00" && document.querySelector('.dropdown-select').value !== "none") {
    confirmValidity()
    // console.log("msg sent")
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
      document.getElementById("subjectReq").style.visibility = "visible"
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
  chrome.storage.sync.set({qblock: []}, null);
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
      chrome.tabs.update(tabIds[i], {url: tabs[i].url}, null);

    }
  });


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
    var $new = result.wlist.filter(i => !["www.netflix.com", "www.youtube.com"].includes(i));
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
  chrome.runtime.sendMessage(chrome.runtime.id, {subject: "change subject"}, null);
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


}




document.getElementById("settingsTab").addEventListener('click', function(e) {
  document.getElementById("settings").style.visibility = "visible";
  document.getElementById("settings-icon").style.borderBottom = "3px solid rgb(113, 109, 218)";
  document.getElementById("schedulePanel").style.visibility = "hidden";
  document.getElementById("schedule-icon").style.borderBottom = "3px solid rgb(255, 255, 255)";
  document.getElementById("home").style.visibility = "hidden";
  document.getElementById("home-icon").style.borderBottom = "3px solid rgb(255, 255, 255)";
  document.getElementById("achievements").style.visibility = "hidden";
  document.getElementById("trophy").style.borderBottom = "3px solid white";
})


document.getElementById("scheduleTab").addEventListener('click', function(e) {
  document.getElementById("settings").style.visibility = "hidden";
  document.getElementById("settings-icon").style.borderBottom = "3px solid rgb(255, 255, 255)";
  document.getElementById("schedulePanel").style.visibility = "visible";
  document.getElementById("schedule-icon").style.borderBottom = "3px solid rgb(113, 109, 218)";
  document.getElementById("home").style.visibility = "hidden";
  document.getElementById("home-icon").style.borderBottom = "3px solid rgb(255, 255, 255)";
  document.getElementById("achievements").style.visibility = "hidden";
  document.getElementById("trophy").style.borderBottom = "3px solid white";
})

document.getElementById("homeTab").addEventListener('click', function(e) {
  document.getElementById("settings").style.visibility = "hidden";
  document.getElementById("settings-icon").style.borderBottom = "3px solid rgb(255, 255, 255)";
  document.getElementById("schedulePanel").style.visibility = "hidden";
  document.getElementById("schedule-icon").style.borderBottom = "3px solid rgb(255, 255, 255)";
  document.getElementById("home").style.visibility = "visible";
  document.getElementById("home-icon").style.borderBottom = "3px solid rgb(113, 109, 218)";
  document.getElementById("achievements").style.visibility = "hidden";
  document.getElementById("trophy").style.borderBottom = "3px solid white";
})

document.getElementById("achievementsTab").addEventListener('click', function(e) {
  document.getElementById("settings").style.visibility = "hidden";
  document.getElementById("settings-icon").style.borderBottom = "3px solid rgb(255, 255, 255)";
  document.getElementById("schedulePanel").style.visibility = "hidden";
  document.getElementById("schedule-icon").style.borderBottom = "3px solid rgb(255, 255, 255)";
  document.getElementById("home").style.visibility = "hidden";
  document.getElementById("home-icon").style.borderBottom = "3px solid white";
  document.getElementById("achievements").style.visibility = "visible";
  document.getElementById("trophy").style.borderBottom = "3px solid rgb(113, 109, 218)";

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
  chrome.storage.sync.set({break: document.querySelector('#break').value}, null);
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

chrome.storage.sync.get(['break'], function(result){
  if(!result.break){
    chrome.storage.sync.set({break: "5"}, null);
  } else {
    chrome.storage.sync.set({break: result.break}, null);
    document.querySelector('#break').value = result.break;
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






//Feedback form
var $go = document.querySelector('#go');
var $later = document.querySelector('#later');
var $survey = document.querySelector('#survey');
var $surveyModal = document.querySelector('#surveyModal');


chrome.storage.sync.get(['survey'], function(result){

  var surveyStatus = result.survey;
  if(surveyStatus == "completed"){
    $survey.style.visibility = "hidden";
    $surveyModal.style.visibility = "hidden";
  } else {
    $survey.style.visibility = "visible";
    $surveyModal.style.visibility = "visible";
  }


  if(!surveyStatus){

    chrome.storage.sync.set({'survey': "incomplete"}, null);
    surveyStatus = "incomplete";
  } else if(surveyStatus){

    chrome.storage.sync.get(['survey'], function(result){
      surveyStatus = result.survey;
    })
  }




  $go.addEventListener('click', function(){
    chrome.storage.sync.set({'survey': "completed"}, null);
    surveyStatus = "completed";
    $survey.style.visibility = "hidden";
    $surveyModal.style.visibility = "hidden";
    window.open("http://bit.ly/37hwNrS", "_blank");


  });

  $later.addEventListener('click', function(){
    chrome.storage.sync.set({'survey': "completed"}, null);
    surveyStatus = "completed";
    $survey.style.visibility = "hidden";
    $surveyModal.style.visibility = "hidden";
  })



})


document.querySelector('#tutorial').querySelectorAll('a').forEach(i => i.addEventListener('click', function(){
  window.open(i.getAttribute('href'), "_blank");
}))


//Achievements feature

chrome.storage.sync.get(['sessions'], function(result){
  if(!result.sessions){
    chrome.storage.sync.set({sessions: 0}, null)
    document.querySelector('#sessions').innerText = "0";
  } else {
    chrome.storage.sync.set({sessions: result.sessions}, null)
    document.querySelector('#sessions').innerText = result.sessions;
  }
})

chrome.storage.sync.get(['studyTime'], function(result){
  if(!result.studyTime){
    chrome.storage.sync.set({studyTime: "00:00:00"}, null)
    document.querySelector('#studyTime').innerText = "0h 0m 0s"
  } else {
    chrome.storage.sync.set({studyTime: result.studyTime}, null)
    document.querySelector('#studyTime').querySelectorAll('span')[0].innerText = String(parseInt(result.studyTime.split(':')[0]))
    document.querySelector('#studyTime').querySelectorAll('span')[1].innerText = String(parseInt(result.studyTime.split(':')[1]))
    document.querySelector('#studyTime').querySelectorAll('span')[2].innerText = String(parseInt(result.studyTime.split(':')[2]))

    //Setting badges based on hours accumulated
    var totalTime = 3600*parseInt(result.studyTime.split(':')[0]) + 60*parseInt(result.studyTime.split(':')[1]) + parseInt(result.studyTime.split(':')[2]);
    if(totalTime < 18000){
      chrome.storage.sync.set({badge: "none"}, null);
      document.querySelector('#badge').querySelector('img').setAttribute('src', "https://nathan.wisen.space/None%20badge_00000.png");
      document.querySelector('#currentBadge').innerText = "none";
    } else if (totalTime < 36000){
      //wood
      chrome.storage.sync.set({badge: "wood"}, null);
      document.querySelector('#badge').querySelector('img').setAttribute('src', "https://nathan.wisen.space/Wood%20Badge_00016.png");
      document.querySelector('#currentBadge').innerText = "Wood";
      document.querySelector('#currentBadge').style.color = "brown";
    } else if (totalTime < 90000){
      //bronze
      chrome.storage.sync.set({badge: "bronze"}, null);
      document.querySelector('#badge').querySelector('img').setAttribute('src', "https://nathan.wisen.space/Bronze%20Badge.png");
      document.querySelector('#currentBadge').innerText = "Bronze";
      document.querySelector('#currentBadge').style.color = "light brown";
    } else if (totalTime < 360000){
      //silver
      chrome.storage.sync.set({badge: "silver"}, null);
      document.querySelector('#badge').querySelector('img').setAttribute('src', "https://nathan.wisen.space/Silver%20Badge_00029.png");
      document.querySelector('#currentBadge').innerText = "Silver";
      document.querySelector('#currentBadge').style.color = "gray";
    } else if (totalTime < 900000){
      //gold
      chrome.storage.sync.set({badge: "gold"}, null);
      document.querySelector('#badge').querySelector('img').setAttribute('src', "https://nathan.wisen.space/gold%20(5)_00044.png");
      document.querySelector('#currentBadge').innerText = "Gold";
      document.querySelector('#currentBadge').style.color = "#fcba03";
    } else if (totalTime < 3600000){
      //plat
      chrome.storage.sync.set({badge: "platinum"}, null);
      document.querySelector('#badge').querySelector('img').setAttribute('src', "https://nathan.wisen.space/Plat%20Badge%20Final_00000.png");
      document.querySelector('#currentBadge').innerText = "Platinum";
      document.querySelector('#currentBadge').style.color = "#9193B8";

    } else if (totalTime >= 3600000){
      //diamond
      chrome.storage.sync.set({badge: "diamond"}, null);
      document.querySelector('#badge').querySelector('img').setAttribute('src', "https://nathan.wisen.space/Diamond%20Badge%20Blue_00000.png");
      document.querySelector('#badge').querySelector('img').style.height = "130px";
      document.querySelector('#currentBadge').innerText = "Diamond";
      document.querySelector('#currentBadge').style.color = "blue";
    }
  }
})

var noneBadge = "https://nathan.wisen.space/None%20badge_00000.png";
var woodBadge = "https://nathan.wisen.space/Wood%20Badge_00016.png";
var bronzeBadge = "https://nathan.wisen.space/Bronze%20Badge.png"
var silverBadge = "https://nathan.wisen.space/Silver%20Badge_00029.png"
var goldBadge = "https://nathan.wisen.space/gold%20(5)_00044.png"
var platBadge = "https://nathan.wisen.space/Plat%20Badge%20Final_00000.png"
var diamondBadge = "https://nathan.wisen.space/Diamond%20Badge%20Blue_00000.png"
var $0Badge = noneBadge;
var $1Badge = woodBadge;
var $2Badge = bronzeBadge;
var $3Badge = silverBadge;
var $4Badge = goldBadge;
var $5Badge = platBadge;
var $6Badge = diamondBadge;

chrome.storage.sync.get(['badge'], function(result){
  if(!result.badge){
    chrome.storage.sync.set({badge: "none"}, null);
    document.querySelector('#badge').querySelector('img').setAttribute('src', "https://nathan.wisen.space/None%20badge_00000.png");
  }
  document.querySelector('#badgeName').innerText = result.badge;


  document.querySelector('#bestBadge').setAttribute('src', window[result.badge + "Badge"])

  //Carousel
  document.querySelector('#previousBadge').addEventListener('click', function(){
    var number;
    if(result.badge == "none"){
      number = 0;
    } else if(result.badge == "wood"){
      number = 1;
    } else if(result.badge == "bronze"){
      number = 2;
    } else if(result.badge == "silver"){
      number = 3;
    } else if(result.badge == "gold"){
      number = 4;
    } else if(result.badge == "platinum"){
      number = 5;
    } else if(result.badge == "diamond"){
      number = 6;
    }

    document.querySelector('#bestBadge').setAttribute('src', window["$" + JSON.stringify(number - 1) + "Badge"]);



  })
})

document.querySelector('#studyTime').querySelectorAll('span').forEach(i => {

    i.style.color = "#736cdb"


})


document.querySelector('#badge').querySelector('img').addEventListener('click', openCollection);
function openCollection(){
  document.querySelector('#badgeCollection').style.visibility = "visible";
}




//Google analytics

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-150162735-1']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();



function trackButton(e){
  if(e.target.innerText == "STOP"){
    _gaq.push(['_trackEvent', document.querySelector('.dropdown-select').value, document.querySelectorAll('.timerDigit')[0].value + ":" + document.querySelectorAll('.timerDigit')[1].value + ":" + document.querySelectorAll('.timerDigit')[2].value])
  } else {
    _gaq.push(['_trackEvent', "none", "stop session"])
  }
}

document.querySelector('#timer_start').addEventListener('click', trackButton);


//Schedule code

var $yr = new Date().getFullYear();
var $month = new Date().getMonth();
var $day = new Date().getDate();


chrome.storage.sync.get(['schedule'], function(result){

  if(!result.schedule || result.schedule.length == 0){
    chrome.storage.sync.set({schedule: ["none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none"]}, null);
  } else {

    chrome.storage.sync.set({schedule: result.schedule}, null);
    chrome.runtime.sendMessage(chrome.runtime.id, {subject: "schedule running or not"}, function(resp){

      //If it's not running
      if(resp == "off"){
        for(i=0; i<14; i++){
          document.querySelectorAll('.scheduleSubject')[i].value = result.schedule[i];
        }
        //Make stop button a start button
        document.querySelector('#startSchedule').innerHTML = "Start";
        document.querySelector('#clearSchedule').removeAttribute('disabled');
      } else {
        for(i=0; i<14; i++){
          document.querySelectorAll('.scheduleSubject')[i].value = result.schedule[i];
        }
        document.querySelectorAll('.scheduleSubject').forEach(i => i.replaceWith(i.options[i.selectedIndex].text));
        //Make start button a stop button
        document.querySelector('#startSchedule').innerHTML = "Stop";
        document.querySelector('#clearSchedule').setAttribute('disabled', true);
      }




    })



  }
})

document.querySelector('#clearSchedule').addEventListener('click', clearSchedule);
function clearSchedule(){
  console.log("cleared")
  document.querySelectorAll('.scheduleSubject').forEach(i => i.value = "none");
  chrome.storage.sync.set({schedule: ["none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none"]}, null);
}


document.querySelector('#startSchedule').addEventListener('click', startSchedule);

function startSchedule(){

  if(document.querySelector('#startSchedule').innerHTML == "Start"){
    //Disable break input in settings
    document.querySelector('#break').setAttribute('disabled', true);

    //Make start button a stop button
    document.querySelector('#startSchedule').innerHTML = "Stop";
    document.querySelector('#clearSchedule').setAttribute('disabled', true);

    //Tell background that schedule will start running now
    if(new Date($yr, $month, $day, 22, 0) - Date.now() < 0){
      var scheduleLength = new Date($yr, $month, $day + 1, 22, 0) - Date.now();
    } else if(new Date($yr, $month, $day, 22, 0) - Date.now() >= 0){
      var scheduleLength = new Date($yr, $month, $day, 22, 0) - Date.now();
    }

    chrome.runtime.sendMessage(chrome.runtime.id, {subject: "schedule length", length: scheduleLength}, null);

    //Storing the set subjects as the schedule
    var $scheduled = [];
    document.querySelectorAll('.scheduleSubject').forEach(i => $scheduled.push(i.value));
    chrome.storage.sync.set({schedule: $scheduled}, null);



    //Tell background about every scheduled session
    document.querySelectorAll('.session').forEach(i => {
      if(i.querySelectorAll('td')[1].innerText !== "none" && i.querySelectorAll('td')[1].innerText !== "None"){


        var $hr = parseInt(i.querySelectorAll('td')[0].getAttribute("start"));
        var timeDiff = new Date($yr, $month, $day, $hr, 0) - Date.now();
        var $rawSubject = i.querySelectorAll('td')[1].innerText;
        var $subject;
        if($rawSubject == "None" || $rawSubject == "Physics" || $rawSubject == "Biology" || $rawSubject == "Chemistry" || $rawSubject == "Economics" || $rawSubject == "Calculus" || $rawSubject == "Whitelist"){
          $subject = $rawSubject.toLowerCase();
        } else if($rawSubject == "American History"){
          $subject = "history"
        } else if($rawSubject == "Linear Algebra"){
          $subject = "linearAlgebra"
        } else if($rawSubject == "College Apps"){
          $subject = "collegeApps"
        }
        console.log(timeDiff)

        if(timeDiff >= 0){

          chrome.storage.sync.get(['break'], function(result){
            var $break = result.break;
            var sessionLength = msToTime(3600000 - 60000*parseInt($break));
            console.log("create" + sessionLength + " study session for " + $subject + " that will start in " +  msToTime(timeDiff));
            chrome.runtime.sendMessage(chrome.runtime.id, {subject: "schedule", timeLength: sessionLength, time: timeDiff, topic: $subject}, null);


          })


        } else if(timeDiff > -3600000){
          var $timeRemaining = 3600000 + timeDiff;
          console.log("study session starts now and will run for " + $timeRemaining/60000 + " min")
          chrome.storage.sync.get(['break'], function(result){
            var shortenedSession = msToTime($timeRemaining - 60000*parseInt(result.break))
            startScheduledSession(shortenedSession, $subject);
          })
        }

        //Changing all selects into the subject
        document.querySelectorAll('.scheduleSubject').forEach(i => i.replaceWith(i.options[i.selectedIndex].text));
      }


    })
  } else if(document.querySelector('#startSchedule').innerHTML == "Stop"){
    if(document.getElementById("timer_start").innerHTML == "Stop"){


      chrome.runtime.sendMessage(chrome.runtime.id,{timerStop: true}, null)
      timerEnd();
    }

    //Enable the break input in settings
    document.querySelector('#break').removeAttribute('disabled');

    //Make stop button a start button
    document.querySelector('#startSchedule').innerHTML = "Start";
    document.querySelector('#clearSchedule').removeAttribute('disabled');

    //Tell background to stop schedule and clear all sessions
    chrome.runtime.sendMessage(chrome.runtime.id, {subject: "stop schedule"}, null);

    //Turn all the selects back into selects and have the last used schedule
    document.querySelectorAll('.session').forEach(i => i.querySelectorAll('td')[1].innerHTML =
    `<select class="scheduleSubject">
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
</select>`
)
    chrome.storage.sync.get(['schedule'], function(result){
      for(i=0; i<14; i++){
        document.querySelectorAll('.scheduleSubject')[i].value = result.schedule[i];
      }
    })




  }

}

function msToTime(duration) {
  var seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  hours = (hours < 10) ? "0" + hours : hours;
  minutes = (minutes < 10) ? "0" + minutes : minutes;
  seconds = (seconds < 10) ? "0" + seconds : seconds;

  return hours + ":" + minutes + ":" + seconds;
}

function startScheduledSession(time, subj){
  chrome.runtime.sendMessage(chrome.runtime.id, {timer: time}, null);

  timerElements.forEach(t => {
    t.style.border = '1.5px inset';
    t.setAttribute('disabled', true);

  })

  timerElements[0].value = time.split(':')[0];
  timerElements[1].value = time.split(':')[1];
  timerElements[2].value = time.split(':')[2];

  chrome.storage.sync.set({subject: subj}, null);
  scheduleStart();
}


function scheduleStart(){

  chrome.runtime.sendMessage(chrome.runtime.id, {subject: "change subject"}, null);

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


}
