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
  document.querySelector('#console').innerHTML = 'hello' + JSON.stringify(result);
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
