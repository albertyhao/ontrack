var siteText;
var textBookText;

var url;
var $console = document.getElementById('console');
var $progress = document.getElementById('progress');
var stopWords = ['i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', "you're", "you've", "you'll", "you'd", 'your', 'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', "she's", 'her', 'hers', 'herself', 'it', "it's", 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves', 'what', 'which', 'who', 'whom', 'this', 'that', "that'll", 'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', "don't", 'should', "should've", 'now', 'd', 'll', 'm', 'o', 're', 've', 'y', 'ain', 'aren', "aren't", 'couldn', "couldn't", 'didn', "didn't", 'doesn', "doesn't", 'hadn', "hadn't", 'hasn', "hasn't", 'haven', "haven't", 'isn', "isn't", 'ma', 'mightn', "mightn't", 'mustn', "mustn't", 'needn', "needn't", 'shan', "shan't", 'shouldn', "shouldn't", 'wasn', "wasn't", 'weren', "weren't", 'won', "won't", 'wouldn', "wouldn't"]
// var stemmer = require('stemmer');

// function to load external txt file onto chrome extension

function getWordsFromFile(fileToLoad) {

  var xhr = new XMLHttpRequest();
  // document.getElementById('console').innerHTML = text2;

  xhr.open("GET",   chrome.extension.getURL(fileToLoad), true);
  // document.getElementById('console').innerHTML = "2";


  xhr.addEventListener("load", function() {
    $progress.innerHTML = 'Loaded Text Book';
    var result = xhr.responseText;
   // "result" should be the textbook entry for the subject
    // document.querySelector('#textBook').innerHTML = result;



    textBookText = result;
    if(textBookText && siteText) {
      document.getElementById('siteText').innerHTML = siteText;
      // siteText = document.getElementById('siteText').textContent;
      document.getElementById('textBook').innerHTML = textBookText;
      // console.log('hello');
      // document.getElementById('textBook').innerHTML = textBookText;

      document.getElementById('similarity').innerHTML = getSim(siteText, textBookText);
      // document.getElementById('similarity').innerHTML = text.substr(0,100) + '<hr>' + siteText.substr(0, 100) + '<hr>'; //siteText.length - text.length;

      //document.getElementById('similarity').innerHTML = getSim(text,text2);
      // document.getElementById('textBook').innerHTML = "";
      document.getElementById('textBook').innerHTML = "";

      document.getElementById('siteText').innerHTML = siteText;
    }

  });

  xhr.send();
}


function scrapeUserSite() {
  $progress.innerHTML = 'Scraping Page';
  var tags = Array.from($console.querySelectorAll('*'));
  var f = tags.filter(t => !['script', 'meta', 'link', 'input', 'html', 'body', 'head', 'style', 'img', 'iframe'].includes(t.tagName.toLowerCase()));
  var t = f.map(
      e => Array.from(e.childNodes)
       .filter(c => c.nodeName === "#text")
    )
    .filter(x => x.length)
    .map(r =>
      r.map(w => w.textContent.trim())
      .filter(a => a && a.length > 10)
    )
    .filter(q => q.length);
  siteText = t.join(' ');
  $progress.innerHTML = 'Done Scraping Page';

}

function setSubject(fileToLoad){
  $progress.innerHTML = 'Loading Text Book';
    var fileToLoad;
    var newSubject = document.querySelector("select").value;




    // set text2 to the txt file for the corresponding subject
    if(newSubject == 'physics'){
      fileToLoad = "physics.txt";
    } else if(newSubject == 'biology'){
      fileToLoad = "biology.txt";
    } else if(newSubject == 'history'){
      fileToLoad = "history.txt";
    } else {
      fileToLoad = "test.txt";
    }

    // document.getElementById('similarity').innerHTML = getSim(siteText, textBookText);

    getWordsFromFile(fileToLoad);


}

function genFreq(string) {
  string = string.toLowerCase();
  string = string.replace(/[^\w\s]|_/g, "");

  var wordArray = string.split(" ");
  var termFreqDict = {};
  for(i=0; i < wordArray.length; i++) {
    // wordArray[i] = stemmer(wordArray[i]);
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
    return sim
}

function  scrapePage(tabs){
  var req = new XMLHttpRequest();
  url = tabs[0].url;

  req.open('GET', url, true);
  req.onreadystatechange = function (){
    $progress.innerHTML = 'Recieved Page';
    var pageContent = req.response;
    $console.style.display = 'none';
    $console.innerHTML = pageContent;
    scrapeUserSite();
  }
  req.send();
}

$progress.innerHTML = 'Starting...';
chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, scrapePage);
document.querySelector("button").addEventListener("click", setSubject); // select button on ui2 html
