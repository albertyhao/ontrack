// chrome.storage.sync.get(['customerid'], function(){
//   var xhr = new XMLHttpRequest();
//   xhr.open("GET", `http://ontrackserver.herokuapp.com?id=${result}&site=${location.href}`, true);
//   xhr.send();
// })
var stopWords = ['i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', "you're", "you've", "you'll", "you'd", 'your', 'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', "she's", 'her', 'hers', 'herself', 'it', "it's", 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves', 'what', 'which', 'who', 'whom', 'this', 'that', "that'll", 'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', "don't", 'should', "should've", 'now', 'd', 'll', 'm', 'o', 're', 've', 'y', 'ain', 'aren', "aren't", 'couldn', "couldn't", 'didn', "didn't", 'doesn', "doesn't", 'hadn', "hadn't", 'hasn', "hasn't", 'haven', "haven't", 'isn', "isn't", 'ma', 'mightn', "mightn't", 'mustn', "mustn't", 'needn', "needn't", 'shan', "shan't", 'shouldn', "shouldn't", 'wasn', "wasn't", 'weren', "weren't", 'won', "won't", 'wouldn', "wouldn't"]
var textBookText;
var newSubject;
// This code sets up the txtbook var in chrome local storage
chrome.storage.local.get(['txtbook'], function(result){
  result.txtbook = "";
  chrome.storage.local.set({txtbook: ""}, null);
})

// chrome.storage.sync.get(['txtbook'], function(result) {
//   // console.log('Value currently is ' + result.key);
// });

function getWordsFromFile(fileToLoad) {
  
  var xhr = new XMLHttpRequest();
  // document.getElementById('console').innerHTML = text2;

  xhr.open("GET", chrome.extension.getURL(fileToLoad), true);
  // document.getElementById('console').innerHTML = "2";


  xhr.addEventListener("load", function() {

    var result = xhr.responseText;
   // "result" should be the textbook entry for the subject
    // document.querySelector('#textBook').innerHTML = result;


    textBookText = result;
   
    chrome.storage.local.set({txtbook: textBookText}, null);

    
    

  });

  xhr.send();
}

function setNewSubject(){
  //Getting subject from chrome storage
  chrome.storage.sync.get(['subject'], function(result){
    newSubject = result.subject;
    console.log(newSubject);
    if(newSubject == "physics"){
      getWordsFromFile("physics.txt");
    } else if(newSubject == "biology"){
      getWordsFromFile("biology.txt");
      console.log(textBookText);
    } else if(newSubject == "history"){
      getWordsFromFile("history.txt");
    } else {
      console.log('help me plz')
    }
  })
}



// getWordsFromFile('physics.txt');

chrome.runtime.onMessage.addListener(
  function(req, sender, sendResponse) {
    if (req.subject) {
      
      setNewSubject();

      chrome.runtime.sendMessage(chrome.runtime.id, {redo: true}, null)
    } else {
      function doSim() {
        if(!textBookText) {
          setTimeout(doSim, 1000);
          return;
        }
        var sim = getSim(req.txt, textBookText)
        console.log(sim);
        console.log(sender.tab.url.split('.').slice(-1)[0]);
        if (newSubject == "collegeApps"){
          if (sender.tab.url.split('.').slice(-1)[0].substring(0,3) !== "edu"){
            sendResponse({res: true, sim: sim, txt: textBookText})
          } else {
            sendResponse({res: false, sim: sim})
          }
        } else {
          if (sim < 0.4) {
            sendResponse({res: true, sim: sim, txt: textBookText})
          } else {
            sendResponse({res: false, sim: sim})
          }
        }
        
      }
      doSim();
    }
  }
)

// chrome.runtime.onMessage.addListener(
//   function(req, sender, sendResponse) {
//     if (req.txt) {
//       // console.log(sender.tab ?
//       //   "from a content script:" + sender.tab.url:
//       //   "from the extension");
//       function doSim() {
//         if(!textBookText) {
//           setTimeout(doSim, 1000);
//           return;
//         }
//         var sim = getSim(req.txt, textBookText)
//         console.log(sim);

//         if (sim < 2) {
//           sendResponse({res: true, sim: sim, txt: textBookText})
//         } else {
//           sendResponse({res: false, sim: sim})
//         }
//       }
//       doSim();
        
//     }
    
//   });



// chrome.webNavigation.onCompleted.addListener(function() {
//      alert("I love hulu!");
//  }, {url: [{urlMatches : 'https://www.hulu.com'}]});
// use for the blacklist

//  chrome.webNavigation.onCompleted.addListener(function() {
//    var s = document.createElement('script');
//    // TODO: add "script.js" to web_accessible_resources in manifest.json
//    s.src = chrome.extension.getURL('injectBackground.js');
//    s.onload = function() {
//        this.remove();
//    };
//    (document.head || document.documentElement).appendChild(s);

//   }, {url: [{urlMatches : 'https://grant.wisen.space/test.html'}]});


//Cos Sim begins
function genFreq(string) {
  string = string.toLowerCase();
  string = string.replace(/[^\w\s]|_/g, "");
  // string = string.replace("\n", " ");
  // var sentences = string.split('.');
  // for (i=0; i < sentences.length; i++){
  //   var wordCount = sentences[i].split(" ").map(w => w.length > 1);
  //   var cleanSentences = [];
  //   if(wordCount > 4){
  //     cleanSentences.push(sentences[i]);
  //   }
  // }

  // var betterString = cleanSentences.join(" ");
  
  var wordArray = string.split(" ");
  var termFreqDict = {};
  for(i=0; i < wordArray.length; i++) {
    // wordArray[i] = stemmer(wordArray[i]);
    var w = wordArray[i];
    if(w !== w.replace(/[^\w\s]|_/g, ""))
      continue;
    if(wordArray[i] in termFreqDict){
      termFreqDict[wordArray[i]] = termFreqDict[wordArray[i]] + 1;

    } else {
      termFreqDict[wordArray[i]] = 1;
    }
  }
  return termFreqDict;
}

function union_arrays (x, y) {
  var obj = {};
  for (var i = x.length-1; i >= 0; -- i)
    obj[x[i]] = x[i];
  for (var i = y.length-1; i >= 0; -- i)
    obj[y[i]] = y[i];
  var res = []
  for (var k in obj) {
    if (obj.hasOwnProperty(k))  // <-- optional
      res.push(obj[k]);
  }
  return res;
}

function getSim(str1, str2){
  str1 = str1.split(" ").filter(w => !stopWords.includes(w)).join(" ");
  str2 = str2.split(" ").filter(w => !stopWords.includes(w)).join(" ");

  var dict1 = genFreq(str1)
  var dict2 = genFreq(str2)

  var str1Words = str1.toLowerCase().replace(/[^\w\s]|_/g, "").split(" ");
  var str2Words = str2.toLowerCase().replace(/[^\w\s]|_/g, "").split(" ");
  // str1Words = str1Words.map(word => stemmer(word));
  // str2Words = str2Words.map(word => stemmer(word));


  var allWords = union_arrays(str1Words, str2Words);

  var allDict = {};


  allWords.forEach(word => {
    var a = dict1[word] || 0;
    var b = dict2[word] || 0;
    allDict[word] = [a,b]
  })


  var dict1Norm = 0;
  var dict2Norm = 0;
  var sim = 0;
  debugger;
    for(key in allDict){
        dict1Norm += (allDict[key][0])**2
        dict2Norm += (allDict[key][1])**2
      }
    for(key in allDict){
        allDict[key][0] = (allDict[key][0])/Math.sqrt(dict1Norm)
        allDict[key][1] = (allDict[key][1])/Math.sqrt(dict2Norm)
      }
    for(key in allDict){
        sim += (allDict[key][0]*allDict[key][1])
      }
    console.log('SIM SIM', sim)
    return sim
   
}

setNewSubject();