document.querySelector("button").addEventListener("click", setSubject); // select button on ui2 html
var text2;
var text = "";
var stopWords = ['i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', "you're", "you've", "you'll", "you'd", 'your', 'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', "she's", 'her', 'hers', 'herself', 'it', "it's", 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves', 'what', 'which', 'who', 'whom', 'this', 'that', "that'll", 'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', "don't", 'should', "should've", 'now', 'd', 'll', 'm', 'o', 're', 've', 'y', 'ain', 'aren', "aren't", 'couldn', "couldn't", 'didn', "didn't", 'doesn', "doesn't", 'hadn', "hadn't", 'hasn', "hasn't", 'haven', "haven't", 'isn', "isn't", 'ma', 'mightn', "mightn't", 'mustn', "mustn't", 'needn', "needn't", 'shan', "shan't", 'shouldn', "shouldn't", 'wasn', "wasn't", 'weren', "weren't", 'won', "won't", 'wouldn', "wouldn't"]
// var stemmer = require('stemmer');
function setSubject(){

   
    var newSubject = document.querySelector("select").value;

    // set text2 to the txt file for the corresponding subject
    if(newSubject == 'physics'){
      text2 = "physics.txt";
    } else if(newSubject == 'biology'){
      text2 = "biology.txt";
    } else{
      text2 = "history.txt";
    }

    // function to load external txt file onto chrome extension

    function getWords() {

      var xhr = new XMLHttpRequest();
      // document.getElementById('console').innerHTML = text2;

      xhr.open("GET",   chrome.extension.getURL(text2), true);
      // document.getElementById('console').innerHTML = "2";


      xhr.addEventListener("load", function() {
        var result = xhr.responseText;
       // "result" should be the textbook entry for the subject
        chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs){
          var url = tabs[0].url;
          // fetch(url).then(response => response.blob()).then(blob => document.getElementById('console').innerHTML = );
          var req = new XMLHttpRequest();
          req.open('GET', url, true);
          req.onreadystatechange = function (){
            var pageContent = req.response;
            document.getElementById('console').innerHTML = pageContent;
            document.getElementById('console').style.display = 'none';
            var text = document.querySelector('#console').textContent.replace(/[^\w\s]|_/g, "").split(' ').filter(word => word.length < 10).join(' ');
            
            document.getElementById('siteText').innerHTML= text;

            document.getElementById('textBook').innerHTML = text2;
            
            text = text.split(" ").filter(w => !stopWords.includes(w)).join(" ");
            text2 = text2.split(" ").filter(w => !stopWords.includes(w)).join(" ");

            // function genSim() {
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



            var dict1 = genFreq(text)
            var dict2 = genFreq(text2)
            // var dict3 = genFreq(str3)

            function chartFreq(string){
              var str1Words = text.toLowerCase().replace(/[^\w\s]|_/g, "").split(" ");
              var str2Words = text2.toLowerCase().replace(/[^\w\s]|_/g, "").split(" ");
              // str1Words = str1Words.map(word => stemmer(word));
              // str2Words = str2Words.map(word => stemmer(word));
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

              var allWords = union_arrays(str1Words, str2Words);

              var allDict = {};


              allWords.forEach(word => {
                var a = dict1[word] || 0;
                var b = dict2[word] || 0;
                allDict[word] = [a,b]
              })


                var similarity = cosSim(allDict);
                document.getElementById('similarity').innerHTML = similarity;


                
            }

            chartFreq();


            function cosSim(allDict) {
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






            
          }
          req.send();
        })

       
text2 = result;
      
       
      });

      xhr.send();
      
     
      
    }

    getWords();
    
   

   

    
}
