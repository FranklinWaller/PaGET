var request = require('request'),
	cheerio = require('cheerio'),
	fs = require('fs');


var requestURL = process.argv[2],
	destinationDir = './page';

console.log('Making a request to: ' + requestURL);

//Making a request to the URL
request(requestURL, function(err, res, body){

	if(err) {
		console.log('Something went miss getting: ' + requestURL);
		console.log('Here is the error log: ');
		console.log(err);
		return;
	}

	if(res.statusCode == 200){
		var $ = cheerio.load(body);

		//Create a directory so we can start saving our page
		if(!fs.existsSync(destinationDir)){
			fs.mkdirSync(destinationDir);
		}

		//Some script and CSS replacement need to be done here.

		fs.writeFile(destinationDir + '/index.html', body, function(err){
			if (err) {
				console.log(err);
				return;
			}			

			console.log('File was saved.');

		});		
	}
});