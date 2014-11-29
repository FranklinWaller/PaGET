var request = require('request'),
    cheerio = require('cheerio'),
    fs = require('fs'),
    paget = require('./src/paget');

if(process.argv[2] == null){
    console.log('No URL given');
    process.exit(1);
}

var requestURL = process.argv[2],
        destinationDir = './page';

console.log('Making a request to: ' + requestURL);

//Making a request to the URL
request(requestURL, function(err, res, body) {

    if (err) {
        console.log(err);
        return;
    }

    if (res.statusCode === 200) {
        var $ = cheerio.load(body);

        //Create a directory so we can start saving our page
        if (!fs.existsSync(destinationDir)) {
            fs.mkdirSync(destinationDir);
        }

        $('link').each(function(){
            var source = $(this).attr('href');

            paget.downloadResource(source, requestURL, destinationDir);
        });

        /*
        //Getting all the scripts
        $('script').each(function() {
            var source = $(this).attr('src');

            //Need to do a check for HTTP. indexOf doesn't seem to work..
            request(requestURL + source, function(err, res, body) {
                if (err) {
                    console.log(err);
                    return;
                }

                console.log('Saving ' + source + '..');

                if (res.statusCode === 200) {

                    //Writing each script to our directory
                    fs.writeFile(destinationDir + '/' + source, body, function(err) {
                        if (err) {
                            console.log(err);
                            return;
                        }
                    });
                }
            });
        });*/



        body = paget.injectScript(body, destinationDir);

        //Last but not least write the html page.
        fs.writeFile(destinationDir + '/index.html', body, function(err) {
            if (err) {
                console.log(err);
                return;
            }

            console.log('index.html was saved.');
        });
    }
});