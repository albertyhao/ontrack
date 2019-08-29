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

document.getElementById("timer_start").addEventListener('click', function(e) {
  if (document.getElementById("timer_start").innerHTML == "Start") {
    confirmValidity()

    countdown = setInterval(startTimer, 1000)
    document.getElementById("timer_start").innerHTML = "Stop"
    document.getElementById("timer_clear").style.display = "none"
  } else if (document.getElementById("timer_start").innerHTML == "Stop") {
    clearInterval(countdown)
    document.getElementById("timer_start").innerHTML = "Start"
    document.getElementById("timer_clear").style.display = "inline"
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

  if (sec != 0 || min != 0 || hr != 0) {
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
    document.getElementById("timer_start").innerHTML = "Start"
    document.getElementById("timer_start").style.display = "inline"
  }
}



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

var $wlist = document.getElementById('wlistSite');

$wlist.addEventListener('click', saveWhitelist);
chrome.storage.sync.get(['wlist'], function(result){
  chrome.storage.sync.set({wlist: result.wlist});
})

function saveWhitelist(){

  chrome.storage.sync.get(['wlist'], function(result){
    var blankArray = result.wlist;
    blankArray.push(document.querySelector('#whitelist').value);
    chrome.storage.sync.set({wlist: blankArray}, null);
    document.querySelector('#whitelist').value = "";
  })




}

// //Code for saving subject


var subjectButton = document.querySelector('#submit');
subjectButton.addEventListener('click', setSubject);
chrome.storage.sync.get(['subject'], function(result){
  document.querySelector('.dropdown-select').value = result.subject;
  chrome.storage.sync.set({subject: document.querySelector('.dropdown-select').value}, null);
})
function setSubject(){
  // chrome.storage.sync.get(['subject'], function(result){
  //   var $subject = result.subject;
  //   $subject = document.querySelector('.dropdown-select').value;
  //   chrome.storage.sync.set({subject: $subject}, null);
  // })
chrome.storage.sync.set({subject: document.querySelector('.dropdown-select').value}, null);

chrome.runtime.sendMessage(chrome.runtime.id, {subject: "change subject"}, null);
chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  chrome.tabs.sendMessage(tabs[0].id, {subject: "change subjects"}, null);
});
}




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
