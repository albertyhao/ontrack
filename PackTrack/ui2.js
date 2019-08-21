
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


document.getElementById('wlistSite').addEventListener('click', saveWhitelist);

function saveWhitelist(){
  
  chrome.storage.sync.get(['wlist'], function(result){
    var $whitelist = result.wlist;
    $whitelist.push(document.querySelector('#whitelist').value);

    chrome.storage.sync.set({wlist: $whitelist}, null);
  })
  
}
// Code for enhanced blocking mode
chrome.storage.sync.set({blist: []}, null);
var $button = document.querySelector('#superBlock');
     $button.addEventListener('click', toggleSuperBlock);
     function toggleSuperBlock(){
       if($button.innerText == 'Turn on enhanced mode!'){
        $button.innerText = "Turn off enhanced mode!";
        chrome.storage.sync.get(['blist'], function(result){
          var $blacklist = result.blist;
          $blacklist.push('extensions');
          chrome.storage.sync.set({blist: $blacklist}, null);
        })
        
       } else {
         $button.innerText = "Turn on enhanced mode!";
       }
       
     }
