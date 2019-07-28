const mongoose = require('mongoose');
const child_process = require('child_process');

const file = 'pbt.py';

let timemodel;

function runCommand(cmd, args, callback) {

    var command = child_process.spawn(cmd, args)
        , data = ''
        , err = ''
    ;

    command.stdout.on('data', (_data) => {
        data += _data;
    });

    command.stderr.on('data', (_data) => {
        err += _data;
    });

    command.on('close', (code) => {
        callback(err, data);
    });
}

function scrape(_timemodel) {
	let urlsToScrape;
	timemodel = timemodel || _timemodel;

	console.log('START SCRAPE')
	function getUrlsWithNoKeywords(callback) {
		timemodel
			.find({keywords: null})
			.exec(callback);
	}

	function scrapeNextUrl() {
		const dbEntry = urlsToScrape.pop()
		const urlToScrape = dbEntry.website;
		runCommand('python', [file, urlToScrape], function(err, keywords) {
			if(urlsToScrape.length) {
				console.log(urlToScrape, keywords)
				dbEntry.keywords = keywords;
				dbEntry.save(scrapeNextUrl);
			}else {
				console.log('FINISHED SCRAPE')
				setTimeout(scrape, 10000);
			}
		});
	}

	function goScrapeStuff(err, _urlsToScrape) {
		if(_urlsToScrape && _urlsToScrape.length) {
			urlsToScrape = _urlsToScrape;
			scrapeNextUrl();
		} else {
			console.log('FINISHED SCRAPE')
			setTimeout(scrape, 10000);
		}
	}

	getUrlsWithNoKeywords(goScrapeStuff);

}

exports.scrape = scrape
exports.pyw = 'pyw' 






