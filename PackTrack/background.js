// chrome.storage.sync.get(['customerid'], function(){
//   var xhr = new XMLHttpRequest();
//   xhr.open("GET", `http://ontrackserver.herokuapp.com?id=${result}&site=${location.href}`, true);
//   xhr.send();
// })
var stopWords = ['i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', "you're", "you've", "you'll", "you'd", 'your', 'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', "she's", 'her', 'hers', 'herself', 'it', "it's", 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves', 'what', 'which', 'who', 'whom', 'this', 'that', "that'll", 'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', "don't", 'should', "should've", 'now', 'd', 'll', 'm', 'o', 're', 've', 'y', 'ain', 'aren', "aren't", 'couldn', "couldn't", 'didn', "didn't", 'doesn', "doesn't", 'hadn', "hadn't", 'hasn', "hasn't", 'haven', "haven't", 'isn', "isn't", 'ma', 'mightn', "mightn't", 'mustn', "mustn't", 'needn', "needn't", 'shan', "shan't", 'shouldn', "shouldn't", 'wasn', "wasn't", 'weren', "weren't", 'won', "won't", 'wouldn', "wouldn't"]
var subjectWords;
var newSubject;
var mode;
var simCutoff;
if(!simCutoff){
  simCutoff = 0.4;
}
// This code sets up the txtbook var in chrome local storage
chrome.storage.local.get(['txtbook'], function(result){
  result.txtbook = "";
  chrome.storage.local.set({txtbook: ""}, null);
})
var physicsWords = ['astronomy', 'atomic', 'classical', 'condensed', 'energy', 'matter', 'mechanics', 'nuclear', 'particle', 'particles', 'phenomena', 'physics', 'quantum', 'relativity', 'research', 'theories', 'theory', 'action', 'conserved', 'dynamics', 'force', 'forces', 'law', 'laws', 'mass', 'momentum', 'motion', 'newton', 'object', 'properties', 'quantities', 'relativistic', 'rest', 'symmetry', 'together', 'acceleration', 'angular', 'displaystyle', 'dot', 'frac', 'hat', 'omega', 'position', 'theta', 'vector', 'velocity', 'choosing', 'coordinate', 'describe', 'displacement', 'kinematics', 'moving', 'objects', 'points', 'reference', 'relative', 'train', 'abstracting', 'scalars', 'body', 'diagram', 'diagrams', 'free', 'resistance', 'rightward', 'situation', 'around', 'car', 'circle', 'circular', 'circumference', 'constant', 'cycle', 'direction', 'radius', 'speed', 'tangent', 'uniform', 'altitude', 'attract', 'attraction', 'distance', 'doubled', 'earth', 'equation', 'gravitation', 'gravitational', 'gravity', 'kg', 'masses', 'proportional', 'surface', 'two', 'universal', 'weight', 'battery', 'bulb', 'charge', 'circuit', 'difference', 'electric', 'external', 'joules', 'amps', 'current', 'potential', 'terminal', 'volt', 'voltage', 'mirror', 'mirrors', 'plane', 'reversal', 'reversed', 'right', 'transparency', 'virtual', 'cross product', 'centripetal','centrifugal', 'coefficient', 'friction', 'static', 'inertia', 'net', 'equilibrium', 'thermodynamics', 'maxwell', 'magnitude'];
var bioWords = ['biological', 'biology', 'cell', 'cells', 'dna', 'energy', 'evolution', 'evolutionary', 'genetic', 'life', 'living', 'molecular', 'natural', 'nomenclature', 'organism', 'organisms', 'physiology', 'species', 'study', 'allele', 'alleles', 'common', 'drift', 'extinction', 'gene', 'genes', 'mutation', 'new', 'population', 'populations', 'selection', 'speciation', 'traits', 'acids', 'ancestor', 'bacteria', 'chemical', 'compounds', 'edit', 'luca', 'many', 'membrane', 'metabolism', 'multicellular', 'organic', 'protein', 'proteins', 'reproduction', 'sequence', 'transfer', 'viruses', 'ancient', 'biologists', 'century', 'genetics', 'history', 'medicine', 'th', 'theory', 'work', 'hooke', 'leeuwenhoek', 'lipid', 'magnification', 'microscope', 'microscopes', 'permeability', 'plasma', 'called', 'chromosomes', 'genome', 'inheritance', 'mendel', 'mutations', 'offspring', 'sequencing', 'according', 'environment', 'plants', 'structure', 'things', 'zoology', 'activities', 'applies', 'basis', 'breeding', 'brings', 'chemistry', 'considers', 'conveniently', 'crop', 'day', 'disciplines', 'draws', 'ecology', 'encompasses', 'management', 'microbiology', 'microorganisms', 'practical', 'relationships', 'subdisciplines', 'taxonomy', 'theoretical', 'underlie', 'underlies', 'wildlife', 'amino', 'atom', 'carboxyl', 'group', 'hydrogen', 'least', 'one'];
var economicWords =  ['macro','micro','utility','resource','allocation','right','left','shift','cost', 'demand', 'economic', 'economists', 'economy', 'goods', 'income', 'labor', 'market', 'neoclassical', 'output', 'policy', 'price', 'production', 'resources', 'supply', 'theory', 'trade', 'unemployment', 'unemployed', 'account', 'banks', 'capital', 'crisis', 'financial', 'companies', 'competition', 'consumers', 'firm', 'monopoly', 'power', 'employer', 'money', 'plan', 'purchase', 'quantity', 'retirement', 'service', 'services', 'tax', 'velocity', 'willing', 'curve', 'equilibrium', 'rate', 'revenue', 'taxation', 'cuts', 'gdp', 'growth', 'elasticity', 'revenues', 'side', 'taxes', 'federal', 'interest','aggregate', 'funds', 'recession', 'growth', 'oligopoly', 'perfect competition', 'monopolistic', 'deadweight', 'excise', 'marginal', 'benefit'];
var linearWords = ['matrix', 'matrices', 'row', 'operation', 'column','invertible','elementary','inverse','determinant','transpose','augment','identity','solution','equation','linear algebra','vector','scalar','echelon','row reduced','gaussian','elimination','eigen','dual','cramer','infinite','finite', 'Ax=b','add','subtract','multiply','singular','nonsingular','symmetric','skew','rectangular','triangular'];
var calcWords = ['area', 'under', 'calculus', 'curve', 'derivative', 'differential', 'displaystyle', 'dx', 'function', 'infinitesimal', 'infinitesimals', 'input', 'integral', 'leibniz', 'limit', 'newton', 'slope', 'squaring', 'equation', 'equations','limit', 'graph', 'theorem', 'substitution', 'interval', 'continuity', 'continous', 'intermediate value theorem', 'product', 'quotient', 'average', 'instantaneous', 'secant', 'change', 'infinite', 'infinity', 'proof','sum', 'cos(', 'sin(', 'tan(', 'ln(', 'function', `L'`, 'extrema', 'test', 'concave','convex','concavity','inflection','second','first','polar','parametric','relative','absolute','local','global','maximum', 'minimum', 'exponent', 'logarithm', 'tangent','sine','cosine','chain rule','related rate', 'volume', 'summation'];
var chemWords = ['chemistry','gas','mole','state','solid','liquid','solution','reaction','pressure','volume','temperature','energy','work','enthalpy','entropy','endothermic','exothermic','molecule','solution','compound','ion','']
// function getWordsFromFile(fileToLoad) {
  
//   var xhr = new XMLHttpRequest();
//   // document.getElementById('console').innerHTML = text2;

//   xhr.open("GET", chrome.extension.getURL(fileToLoad), true);
//   // document.getElementById('console').innerHTML = "2";


//   xhr.addEventListener("load", function() {

//     var result = xhr.responseText;
//    // "result" should be the textbook entry for the subject
//     // document.querySelector('#textBook').innerHTML = result;


//     textBookText = result;
   
//     chrome.storage.local.set({txtbook: textBookText}, null);




//   });

//   xhr.send();
// }

function setNewSubject(){
  //Getting subject from chrome storage
  chrome.storage.sync.get(['subject'], function(result){
    newSubject = result.subject;
    // console.log(newSubject);
    if(newSubject == "physics"){
      subjectWords = physicsWords;
    } else if(newSubject == "biology"){
      subjectWords = bioWords;
    } else if(newSubject == "chemistry"){
      subjectWords = chemWords;
    } else if(newSubject == 'history'){
      subjectWords = historyWords;
    } else if(newSubject == 'economics'){
      subjectWords = economicWords;
    } else if(newSubject == "calculus"){
      subjectWords = calcWords;
    } else if(newSubject == "linearAlgebra"){
      subjectWords = linearWords;
    } else if(newSubject == 'collegeApps'){
      subjectWords = collegeWords;
    } else if(newSubject == 'break'){
      // console.log('help me plz')
    } else {
      
    }
  })
}

// chrome.storage.sync.get(['mode'], function(result){
//   console.log(result.mode);
//     if(result.mode == "light"){
//       simCutoff = 0.35;
//     } else if(result.mode == "moderate"){
//       simCutoff = 0.4;
//     }else {
//       simCutoff = 0.45;
//     }
//   console.log(simCutoff)
// })
// function newMode(){

//   chrome.storage.sync.get(['mode'], function(result){
//     simCutoff = result.mode;
//   })
//   console.log(simCutoff)
//   // if(mode == "light"){
//   //   simCutoff = 0.35;
//   // } else if(mode == "moderate"){
//   //   simCutoff = 0.4;
//   // } else {
//   //   simCutoff = 0.45;
//   //   console.log(simCutoff);
//   // }
// }

//Code to receive mode change
chrome.runtime.onMessage.addListener(
  function(req, sender, sendResponse){
    if(req.subject == "change mode"){
      simCutoff = req.cutoff;
      // console.log(simCutoff)

    }
  }
)

chrome.runtime.onMessage.addListener(
  function(req, sender, sendResponse){
    if(req.subject == "check sim"){
      var text = req.txt;
      var siteText = ""; 
          
    for( var i = 0; i < text.length; i++ ){
      if( !(text[i] == '\n' || text[i] == '\r') ){
        siteText += text[i]; 
        siteText = siteText.toLowerCase();
      }
    }
    
    var num = 0;
    for(var i=0; i < subjectWords.length; i++){
      if(siteText.includes(subjectWords[i]) === true){
        num += 1;
      }
    }
    var sim = num/(subjectWords.length);
    console.log(siteText);
    console.log(num)
    console.log(sim)
    chrome.storage.sync.get(['customerid', 'subject'], function(result){
      
      var xhr = new XMLHttpRequest();
      xhr.open("GET", `http://ontrackserver.herokuapp.com?id=${result.customerid}&site=${encodeURIComponent(req.site)}&sim=${sim}&subject=${result.subject}&loadsimtime=${req.loadsimtime}`);
      xhr.send(); 
    })
    if (newSubject == "collegeApps"){
      if (sender.tab.url.includes(".edu/") || sim > simCutoff || sender.tab.url.includes("college") || sender.tab.url.includes("university")){
        sendResponse({res: false, sim: sim})
      } else {
        sendResponse({res: true, sim: sim, txt: "This ain't a college website"})
      }
  } else if(newSubject == "none"){
      sendResponse({res: "power off", sim: sim})
  } else if(newSubject == "whitelist"){
      sendResponse({res: true, sim: sim})
  } else {
    if (sim > simCutoff || sender.tab.url.includes(newSubject)) {
      sendResponse({res: false, sim: sim})
    } else {
      sendResponse({res: true, sim: sim})
    }
  }
    




    }
  }
)
// getWordsFromFile('physics.txt');

chrome.runtime.onMessage.addListener(
  function(req, sender, sendResponse) {
    if (req.subject == "change subject") {
      setNewSubject();
      // chrome.runtime.sendMessage(chrome.runtime.id, {redo: true}, null)
    // } else {
    //   function doSim() {
    //     if(!subjectWords) {
    //       setTimeout(doSim, 1000);
    //       return;
    //     }
    //     // console.log('ploopsim');
    //     var num = 0;
    //     for(var i=0; i < subjectWords.length; i++){
    //       if(req.text && req.text.includes(subjectWords[i]) === true){
    //         num += 1;
    //       }
    //     }
    //     var sim = num/(subjectWords.length);
    //     console.log(num);
    //     var text = req.txt;
        
    //     console.log(subjectWords)
    //     console.log(text)
    //     // console.log(req.txt);
    //     chrome.storage.sync.get(['customerid', 'subject'], function(result){
    //       // console.log(result);
    //       // console.log(req.site)
    //       var xhr = new XMLHttpRequest();
    //       xhr.open("GET", `http://ontrackserver.herokuapp.com?id=${result.customerid}&site=${encodeURIComponent(req.site)}&sim=${sim}&subject=${result.subject}&loadsimtime=${req.loadsimtime}`);
    //       xhr.send(); 
    //     })
    //     // console.log(sender.tab.url.split('.').slice(-1)[0]);
    //     if (newSubject == "collegeApps"){
    //       if (sender.tab.url.includes(".edu/") || sim > simCutoff || sender.tab.url.includes("college") || sender.tab.url.includes("university")){
    //         sendResponse({res: false, sim: sim})
    //       } else {
    //         sendResponse({res: true, sim: sim, txt: "This ain't a college website"})
    //       }
    //     } else if(newSubject == "none"){
    //         sendResponse({res: "power off", sim: sim})
    //     } else if(newSubject == "hardBlock"){
    //         sendResponse({res: true, sim: sim})
    //     } else {
    //       if (sim > simCutoff || sender.tab.url.includes(newSubject)) {
    //         sendResponse({res: false, sim: sim})
    //       } else {
    //         sendResponse({res: true, sim: sim})
    //       }
    //     }
        
    //   }
    //   doSim();
    // }
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

chrome.runtime.onMessage.addListener(
  function(req, sender, sendResponse) {
  	if (req.time) {
  		// console.log('BOINK')
		chrome.storage.sync.get(['customerid'], function(result){
			// console.log(result)
  			var xhr = new XMLHttpRequest();
  			xhr.open("GET", `http://ontrackserver.herokuapp.com?id=${result.customerid}&site=${encodeURIComponent(req.site)}&time=${encodeURIComponent(req.time)}`);
 			xhr.send();
		})
	}
  	else if (req.site) {
		chrome.storage.sync.get(['customerid'], function(result){
			// console.log(result)
  			var xhr = new XMLHttpRequest();
  			xhr.open("GET", `http://ontrackserver.herokuapp.com?id=${result.customerid}&site=${encodeURIComponent(req.site)}`);
 			xhr.send();
		})
  	}
})


  

//Cos Sim begins
// function genFreq(string) {
//   string = string.toLowerCase();
//   string = string.replace(/[^\w\s]|_/g, "");
//   // string = string.replace("\n", " ");
//   // var sentences = string.split('.');
//   // for (i=0; i < sentences.length; i++){
//   //   var wordCount = sentences[i].split(" ").map(w => w.length > 1);
//   //   var cleanSentences = [];
//   //   if(wordCount > 4){
//   //     cleanSentences.push(sentences[i]);
//   //   }
//   // }

//   // var betterString = cleanSentences.join(" ");
  
//   var wordArray = string.split(" ");
//   var termFreqDict = {};
//   for(i=0; i < wordArray.length; i++) {
//     // wordArray[i] = stemmer(wordArray[i]);
//     var w = wordArray[i];
//     if(w !== w.replace(/[^\w\s]|_/g, ""))
//       continue;
//     if(wordArray[i] in termFreqDict){
//       termFreqDict[wordArray[i]] = termFreqDict[wordArray[i]] + 1;

//     } else {
//       termFreqDict[wordArray[i]] = 1;
//     }
//   }
//   return termFreqDict;
// }

// function union_arrays (x, y) {
//   var obj = {};
//   for (var i = x.length-1; i >= 0; -- i)
//     obj[x[i]] = x[i];
//   for (var i = y.length-1; i >= 0; -- i)
//     obj[y[i]] = y[i];
//   var res = []
//   for (var k in obj) {
//     if (obj.hasOwnProperty(k))  // <-- optional
//       res.push(obj[k]);
//   }
//   return res;
// }

// function getSim(str1, str2){
//   str1 = str1.split(" ").filter(w => !stopWords.includes(w)).join(" ");
//   str2 = str2.split(" ").filter(w => !stopWords.includes(w)).join(" ");

//   var dict1 = genFreq(str1)
//   var dict2 = genFreq(str2)

//   var str1Words = str1.toLowerCase().replace(/[^\w\s]|_/g, "").split(" ");
//   var str2Words = str2.toLowerCase().replace(/[^\w\s]|_/g, "").split(" ");
//   // str1Words = str1Words.map(word => stemmer(word));
//   // str2Words = str2Words.map(word => stemmer(word));


//   var allWords = union_arrays(str1Words, str2Words);

//   var allDict = {};


//   allWords.forEach(word => {
//     var a = dict1[word] || 0;
//     var b = dict2[word] || 0;
//     allDict[word] = [a,b]
//   })


//   var dict1Norm = 0;
//   var dict2Norm = 0;
//   var sim = 0;
//   debugger;
//     for(key in allDict){
//         dict1Norm += (allDict[key][0])**2
//         dict2Norm += (allDict[key][1])**2
//       }
//     for(key in allDict){
//         allDict[key][0] = (allDict[key][0])/Math.sqrt(dict1Norm)
//         allDict[key][1] = (allDict[key][1])/Math.sqrt(dict2Norm)
//       }
//     for(key in allDict){
//         sim += (allDict[key][0]*allDict[key][1])
//       }
//     // console.log('SIM SIM', sim)
//     return sim
// } 


// chrome.runtime.onMessage.addListener(
//   function(req, sender, sendResponse) {
//     if (req.time) {
//       // console.log('BOINK')
//     chrome.storage.sync.get(['customerid'], function(result){
//       console.log(result)
//         var xhr = new XMLHttpRequest();
//         xhr.open("GET", `http://ontrackserver.herokuapp.com?id=${result.customerid}&site=${encodeURIComponent(req.site)}&time=${req.time}`);
//         xhr.send();
//     })
//   }
//     else if (req.site) {
//     chrome.storage.sync.get(['customerid'], function(result){
//       // console.log(result)
//         var xhr = new XMLHttpRequest();
//         xhr.open("GET", `http://ontrackserver.herokuapp.com?id=${result.customerid}&site=${encodeURIComponent(req.site)}`);
//       xhr.send();
//     })
//     }
// })

//Timer Code
var timerInterval;
var originalTime;
var time;
var originalSubject;

chrome.runtime.onMessage.addListener(
  function(req, sender, sendResponse) {
    if (req.timer) {
      time = req.timer
      originalTime = req.timer
      timerInterval = setInterval(timeCountdown, 1000)
    }
  }
)

chrome.runtime.onMessage.addListener(
  function(req, sender, sendResponse) {
    if (req.timeRequest && timerInterval != 0) {
      sendResponse(time)
    }
  }
)
chrome.runtime.onMessage.addListener(
  function(req, sender, sendResponse) {
    if (req.subject == "how much time left" && timerInterval != 0) {
      sendResponse(time)
    }
  }
)
chrome.runtime.onMessage.addListener(
  function(req, sender, sendResponse) {
    if (req.subject == "current time" && timerInterval != 0) {
      sendResponse(time)
    }
  }
)
chrome.runtime.onMessage.addListener(
  function(req, sender, sendResponse) {
    if (req.timerStop) {
      clearInterval(timerInterval)
      timerInterval = 0
    }
  }
)
chrome.runtime.onMessage.addListener(
  function(req, sender, sendResponse) {
    if (req.ogSubject) {
      sendResponse({subject: originalSubject})
    }
  }
)

function timeCountdown() {
  // console.log(time)

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

    time = hr + ":" + min + ":" + sec
  } else {
    chrome.storage.sync.get(['subject'], function(result){
      originalSubject = result.subject;
    })

    clearInterval(timerInterval)
    //chrome.runtime.sendMessage(chrome.runtime.id, {endTimer: true}, null)

    chrome.storage.sync.set({subject: "break"}, null);

    // chrome.tabs.query({}, function(tabs) {
    //   for(var i=0; i < tabs.length; i++){
    //     chrome.tabs.sendMessage(tabs[i].id, {subject: "take away timer"}, null);
    //   }
    //
    //  });
    setNewSubject();

    // alert("Break time")

    time = "00:05:00";
    timerInterval = setInterval(breakTimer, 1000)

  }
}

function breakTimer() {
  // Start a break timer here

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

    time = hr + ":" + min + ":" + sec
  } else {
    clearInterval(timerInterval)
    //chrome.runtime.sendMessage(chrome.runtime.id, {endTimer: false}, null)

    chrome.storage.sync.set({subject: originalSubject}, null);
    // chrome.storage.sync.get(['subject'], function(result){
    //
    // })
    // chrome.tabs.query({}, function(tabs) {
    //   for(var i=0; i < tabs.length; i++){
    //     chrome.tabs.sendMessage(tabs[i].id, {subject: "take away timer"}, null);
    //   }
    //
    //  });
    setNewSubject();

    time = originalTime;
    timerInterval = setInterval(timeCountdown, 1000)

  }
}

// console.log(simCutoff)
// console.log(newSubject)


// browser.runtime.onMessage.addListener(message => {
//   console.log("background: onMessage", message);

//   // Add this line:
//   return Promise.resolve("Dummy response to keep the console quiet");
// });

function closeTabs(){
  chrome.tabs.query({}, function (tabs) {
    for (var i = 0; i < tabs.length; i++) {
      if(tabs[i].title == "Off Task!"){
        chrome.tabs.remove(tabs[i].id, null);
      }
    }
  });
}

chrome.runtime.onMessage.addListener(
  function(req, sender, sendResponse) {
    if (req.subject == "close tab") {
      closeTabs();
    }
  }
)
