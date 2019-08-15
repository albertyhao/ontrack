// document.querySelector("button").addEventListener("click", setSubject); // select button on ui2 html
// var text2;

// function setSubject(){

//     // scrape current website content
//     var text = "";
//     var i;
//     for(i=2; i<document.getElementsByTagName('p').length; i++){
//       text = text.concat(document.getElementsByTagName('p')[i].innerText.replace(/[^\w\s]|_/g, ""));
//     }
//     var newSubject = document.querySelector("value");

//     // set text2 to the txt file for the corresponding subject
//     if(newSubject == 'physics'){
//       text2 = "physics.txt";
//     } else if(newSubject == 'biology'){
//       text2 = "biology.txt";
//     } else{
//       text2 = "history.txt";
//     }

//     // function to load external txt file onto chrome extension

//     function getWords() {

//       var xhr = new XMLHttpRequest();
//       // document.getElementById('console').innerHTML = text2;

//       xhr.open("GET", chrome.extension.getURL(text2), true);
//       // document.getElementById('console').innerHTML = "2";


//       xhr.addEventListener("load", function() {
//         var result = xhr.responseText;
//         document.getElementById('console').innerHTML = result; // "result" should be the textbook entry for the subject

//         var dict1 = genFreq(text) // call both inside the "getWords" function so avoid the loading time
//         var dict2 = genFreq(text2)
//       });

//       xhr.send();
//       // text2 = result; // set "text2" as the result of the subject standard (result shouldn't be used outside of the function)
//       // document.getElementById('console').innerHTML = text2;
//     }

//     getWords();

//     console.log("text2 is: " + text2)

//     //Cosine similarity begins

//     function genFreq(string) {
//       string = string.toLowerCase();
//       string = string.replace(/[^\w\s]|_/g, "");
//       var wordArray = string.split(" ");
//       var termFreqDict = {};
//       for(i=0; i < wordArray.length; i++) {
//         wordArray[i] = stemmer(wordArray[i]);
//         if(wordArray[i] in termFreqDict){
//           termFreqDict[wordArray[i]] = termFreqDict[wordArray[i]] + 1;

//         } else {
//           termFreqDict[wordArray[i]] = 1;
//         }
//       }
//       return termFreqDict;
//     }


//     document.getElementById('console').innerHTML = "2";

//     document.getElementById('console').innerHTML = text2;

//     function chartFreq(string){
//       var str1Words = text.toLowerCase().replace(/[^\w\s]|_/g, "").split(" ");
//       var str2Words = text2.toLowerCase().replace(/[^\w\s]|_/g, "").split(" ");
//       str1Words = str1Words.map(word => stemmer(word));
//       str2Words = str2Words.map(word => stemmer(word));
//       function union_arrays (x, y) {
//         var obj = {};
//         for (var i = x.length-1; i >= 0; -- i)
//           obj[x[i]] = x[i];
//         for (var i = y.length-1; i >= 0; -- i)
//           obj[y[i]] = y[i];
//         var res = []
//         for (var k in obj) {
//           if (obj.hasOwnProperty(k))  // <-- optional
//             res.push(obj[k]);
//         }
//         return res;
//       }

//       var allWords = union_arrays(str1Words, str2Words);

//       var allDict = {};


//       allWords.forEach(word => {
//         var a = dict1[word] || 0;
//         var b = dict2[word] || 0;
//         allDict[word] = [a,b]
//       })


//         var similarity = cosSim(allDict);
//         console.log(allDict);

//         alert(similarity);
//         if(similarity < 1){
//           document.body.style.background = "linear-gradient(to top left,  #9d00ff, #008187) fixed";
//           document.body.style.height = "821px";
//           document.body.innerHTML = `<center><p style="color:white; padding-top: 10vh; font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 3.25rem">It seems as if you are distracted!</p><p style="color:white; margin-top: 10vh; font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 5.5rem;">Get Back</p><br><br><br><img src="http://i66.tinypic.com/10ykqkk.png" border="0" alt="Image and video hosting by TinyPic"><hr style="border: 1px solid white; margin-top: 15vh;" width=75%><br><br><p style="color:white; font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 5rem">This site is currently being blacklisted</p></center>`;
//         }
//     }

//     chartFreq();

//     function cosSim(allDict) {
//       var dict1Norm = 0;
//       var dict2Norm = 0;
//       var sim = 0;
//         for(key in allDict){
//             dict1Norm += (allDict[key][0])**2
//             dict2Norm += (allDict[key][1])**2
//           }
//         for(key in allDict){
//             allDict[key][0] = (allDict[key][0])/Math.sqrt(dict1Norm)
//             allDict[key][1] = (allDict[key][1])/Math.sqrt(dict2Norm)
//           }
//         for(key in allDict){
//             sim += (allDict[key][0]*allDict[key][1])
//           }
//         return sim

//   }
// }


chrome.storage.sync.get(['customerid'], function(result) {
  if (!result || Object.keys(result).length === 0) {
    result = ((new Date()*1) + Math.random())
    result = (result + '').replace('.', 'a');
    document.querySelector('#console').innerHTML = JSON.stringify(result);
    chrome.storage.sync.set({customerid: result}, function(){
      var xhr = new XMLHttpRequest();
      xhr.open("GET", `http://ontrackserver.herokuapp.com?id=${result}`, true);
      xhr.send(); 
    })
  }
  document.querySelector('#console').innerHTML = 'hello' + JSON.stringify(result);
})
