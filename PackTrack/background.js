var stopWords = ['i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', "you're", "you've", "you'll", "you'd", 'your', 'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', "she's", 'her', 'hers', 'herself', 'it', "it's", 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves', 'what', 'which', 'who', 'whom', 'this', 'that', "that'll", 'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', "don't", 'should', "should've", 'now', 'd', 'll', 'm', 'o', 're', 've', 'y', 'ain', 'aren', "aren't", 'couldn', "couldn't", 'didn', "didn't", 'doesn', "doesn't", 'hadn', "hadn't", 'hasn', "hasn't", 'haven', "haven't", 'isn', "isn't", 'ma', 'mightn', "mightn't", 'mustn', "mustn't", 'needn', "needn't", 'shan', "shan't", 'shouldn', "shouldn't", 'wasn', "wasn't", 'weren', "weren't", 'won', "won't", 'wouldn', "wouldn't"]
var subjectWords;
var newSubject;
var mode;
var simCutoff;
if(!simCutoff){
  simCutoff = 0.2;
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
var chemWords = ['chemistry','chemical','gas','mole','state','solid','liquid','solution','reaction','pressure','volume','temperature','energy','work','enthalpy','entropy','endothermic','exothermic','molecule','solution','compound','ion','acid','atom','covalent','charge','polymer','metal','halogen','periodic table','transition','oxidation','reduction','cloud','configuration','valence','electron','proton','neutron','heat','specific','joule','group','nucleus','orbital','subshell','ionization','lewis','structure','octet','pair','phase','decomposition','displacement','single','double','precipitate','molality','molarity','density','base','conjugate','weak','strong','reactant','product','conservation','matter','redox','capacity','calorimeter', 'aqueous', 'freezing', 'boiling', 'sublimation', 'vaporization', `van't Hoff`]
var historyWords = ['american', 'americans', 'army', 'british', 'colonies', 'congress', 'government', 'nation', 'quaker','native',  'north', 'party', 'president', 'rights', 'slavery', 'slaves', 'south', 'states', 'union', 'united', 'war', 'women', 'americas', 'culture', 'indian', 'indians', 'iroquois', 'tribe', 'america', 'became', 'britain', 'colonial', 'colonists', 'colony', 'england', 'english', 'florida', 'land', 'population', 'settlers', 'spain', 'spanish', 'bay', 'canada', 'colonization', 'columbia', 'empire', 'established', 'hudson', 'kingdom', 'overseas', 'quebec', 'rupert', 'boston', 'loyalists', 'parliament', 'patriots', 'revolution', 'york', 'french', 'hamilton', 'mount', 'vernon', 'virginia', 'washington', 'black', 'cotton', 'enslaved', 'free', 'slave', 'trade', 'white', 'battle', 'force', 'fort', 'navy', 'royal', 'ship', 'ships', 'era', 'federalist', 'federalists', 'feelings', 'good', 'jacksonian', 'madison', 'monroe', 'national', 'political', 'presidential', 'republican', 'tour', 'would', 'confederacy', 'confederate', 'southern', 'african', 'blacks',  'civil', 'former', 'freedmen', 'johnson', 'radical', 'radicals', 'reconstruction', 'republicans', 'state', 'vote', 'whites', 'abortion', 'carter', 'conservative', 'crisis', 'economic', 'ford', 'military', 'nixon', 'policy', 'reagan', 'soviet', 'vietnam', 'activists', 'alabama', 'bus', 'freedom', 'kennedy', 'king', 'local', 'malcolm', 'march', 'mississippi', 'montgomery', 'movement', 'nonviolence', 'nonviolent', 'police', 'public', 'registration', 'school', 'segregation',  'students', 'voter', 'voting', 'pennsylvania', 'new york', 'carolina', 'tobacco', 'plantation', 'master', 'liberty'];
var collegeWords = ['apply', 'essay', 'university','college','applicant','words','narrative','personality','academic','extracurricular','activities','class','interest','explore','campus'];

function setNewSubject(){
  //Getting subject from chrome storage
  chrome.storage.sync.get(['subject'], function(result){
    newSubject = result.subject;
    // console.log(newSubject)
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
    } else {
      subjectWords = [];
    }
  })
}

setNewSubject();



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
    if(req.subject == "check sim for unblock"){
      var text = req.txt;
      // console.log(req.txt)
      var siteText = ""; 
          
    for( var i = 0; i < text.length; i++ ){
      if( !(text[i] == '\n' || text[i] == '\r') ){
        siteText += text[i]; 
        
      }
    }
    // console.log(siteText)
    siteText = siteText.toLowerCase();
    var num = 0;
    // console.log(subjectWords.length);
    // console.log(subjectWords)
    for(var i=0; i < subjectWords.length; i++){
      if(siteText.includes(subjectWords[i]) === true){
        num += 1;
      }
    }
    // console.log(num)
    var sim = num/(subjectWords.length);
    // console.log(sim)
    sendResponse({sim: sim});
  
    




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
          
        }
      }
      siteText = siteText.toLowerCase();
      var num = 0;
      // console.log(subjectWords);
      for(var i=0; i < subjectWords.length; i++){
        if(siteText.includes(subjectWords[i]) === true){
          num += 1;
        }
      }
      var sim = num/(subjectWords.length);
      // console.log(sender.tab.url)
      // // console.log(siteText.split(' ').length);
      // console.log(num)
      // console.log(sim)
      // console.log(simCutoff)
    
    chrome.storage.sync.get(['customerid', 'subject', 'email', 'name'], function(result){
      // console.log(result.subject);
      var xhr = new XMLHttpRequest();
      xhr.open("GET", `http://ontrackserver.herokuapp.com?id=${result.customerid}&site=${encodeURIComponent(req.site)}&sim=${sim}&subject=${result.subject}&loadsimtime=${req.loadsimtime}&name=${result.name}&email=${result.email}`);
      xhr.send(); 
    })
    if (newSubject == "collegeApps"){
      if (sender.tab.url.includes(".edu/") || sim > simCutoff || sender.tab.url.includes("college") || sender.tab.url.includes("university")){
        sendResponse({res: false, sim: sim})
      } else {
        sendResponse({res: true, sim: sim, txt: "This ain't a college website"})
      }
  } else if(newSubject == "none"){
    console.log("power is apparently off?")
      sendResponse({res: "power off", sim: sim})
  } else if(newSubject == "whitelist"){
      sendResponse({res: true, sim: sim})
  } else {
    if (sim > simCutoff || sender.tab.url.includes(newSubject.toLowerCase())) {
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
     
  }
}
)



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


//Timer Code
var timerInterval;
var time;
var sessionTime;

chrome.runtime.onMessage.addListener(
  function(req, sender, sendResponse) {
    if (req.timer) {
      time = req.timer
      sessionTime = req.timer
      // console.log(time)
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

function timeCountdown() {
  console.log(time)

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
    chrome.runtime.sendMessage(chrome.runtime.id, {endTimer: true}, null)
    
    chrome.storage.sync.set({subject: "none"}, null);
    chrome.storage.sync.get(['subject'], function(result){
      
    })
    chrome.tabs.query({}, function(tabs) {
      for(var i=0; i < tabs.length; i++){
        chrome.tabs.update(tabs[i].id, {url: tabs[i].url}, null);
      }
        
     });
     setNewSubject();
  
    alert("Study session completed!")
    
    chrome.storage.sync.get(['sessions'], function(result){
        var $new = result.sessions + 1;
        
        chrome.storage.sync.set({sessions: $new});
      
    })
    chrome.storage.sync.get(['studyTime'], function(result){
      
      var $hour = parseInt(result.studyTime.split(':')[0]) + parseInt(sessionTime.split(':')[0])
      var $min = parseInt(result.studyTime.split(':')[1]) + parseInt(sessionTime.split(':')[1])
      var $sec = parseInt(result.studyTime.split(':')[2]) + parseInt(sessionTime.split(':')[2])
      if ($sec > 59) {
        
        $sec = $sec % 60
        $min += 1;
        
      }
    
      if ($min > 59) {
        
        $min = $min % 60
        $hour += 1;
      }

      if ($sec / 10 < 1) {
        $newsec = "0" + String($sec)
      } else {
        $newsec = String($sec)
      }
  
      if ($min / 10 < 1) {
        $newmin = "0" + String($min)
      } else {
        $newmin = String($min)
      }
  
      if ($hour / 10 < 1) {
        $newhr = "0" + String($hour)
      } else {
        $newhr = String($hour)
      }
      var $newTime = $newhr + ":" + $newmin + ":" + $newsec;
      chrome.storage.sync.set({studyTime: $newTime});
    })
  }
}



function closeTabs(){
  chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
    
      
    chrome.tabs.remove(tabs[0].id, null);
      
    
  });
}

chrome.runtime.onMessage.addListener(
  function(req, sender, sendResponse) {
    if (req.subject == "close tab") {
      closeTabs();
    }
  }
)

//Listen for when a Tab changes state
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
  if(changeInfo && changeInfo.status == "complete"){
      chrome.tabs.sendMessage(tabId, {subject: "state change"}, function(response) {
          
      });

  }
});


chrome.runtime.setUninstallURL("https://docs.google.com/forms/d/e/1FAIpQLSd7dVVqH25XmEpB7Z1Ro27YObgGlNmfcbsmqFKeBlnRN7TRLg/viewform?vc=0&c=0&w=1");

//Schedule 


chrome.runtime.onMessage.addListener(
  function(req, sender, sendResponse) {
    if (req.subject == "schedule") {
      console.log(req.time, req.timeLength, req.topic)
      console.log("A study session on " + req.topic + " has been scheduled to start in " + req.time + " and will run for " + req.timeLength)
      setTimeout(function(){
        time = req.timeLength
        sessionTime = req.timeLength
        // console.log(time)
        timerInterval = setInterval(timeCountdown, 1000)
        chrome.storage.sync.set({subject: req.topic}, null);
        setNewSubject();
        var tabIds = [];
        chrome.tabs.query({}, function (tabs) {
          for (var i = 0; i < tabs.length; i++) {
            tabIds.push(tabs[i].id);
            chrome.tabs.executeScript(tabIds[i], {file: 'contentscript.js'});
          }
        });
      }, req.time);

    }
  }
)

function msToTime(duration) {
  var seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  hours = (hours < 10) ? "0" + hours : hours;
  minutes = (minutes < 10) ? "0" + minutes : minutes;
  seconds = (seconds < 10) ? "0" + seconds : seconds;

  return hours + ":" + minutes + ":" + seconds;
}
// var t = setTimeout(function(){
//   console.log('started the test')
//   time = "00:00:15";
//   sessionTime = "00:00:15";
//   timerInterval = setInterval(timeCountdown, 1000);
//   chrome.storage.sync.set({subject: "biology"}, null);
//   setNewSubject();
//   var tabIds = [];
//   chrome.tabs.query({}, function (tabs) {
//     for (var i = 0; i < tabs.length; i++) {
//       tabIds.push(tabs[i].id);
//       chrome.tabs.executeScript(tabIds[i], {file: 'contentscript.js'});
//     }
//   });
// }, 10000)
var scheduleRunning;
if(!scheduleRunning){
  scheduleRunning = "off"
}
chrome.runtime.onMessage.addListener(
  function(req, sender, sendResponse) {
    if (req.subject == "schedule length") {
      scheduleRunning = "on"
      console.log(scheduleRunning)
      setTimeout(function(){
        scheduleRunning = "off"
      }, req.length);
    }
  }
)

chrome.runtime.onMessage.addListener(
  function(req, sender, sendResponse) {
    if (req.subject == "schedule running or not") {
      sendResponse(scheduleRunning)
    }
  }
)

chrome.runtime.onMessage.addListener(
  function(req, sender, sendResponse) {
    if (req.subject == "stop schedule") {
      scheduleRunning = "off"
      console.log(scheduleRunning)
      var id = window.setTimeout(function() {}, 0);
      while (id--) {
          window.clearTimeout(id); // will do nothing if no timeout with id is present
      }
    }
  }
)








