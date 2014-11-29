var cheerio = require('cheerio'),
    fs = require('fs')
    request = require('request'),
    strng = require('../src/string');

var paget = {

    /**
    *   Injects the PaGET.js (client) script to be able to read all the loaded resources. 
    *
    *
    */
    injectScript: function(doc, destination){
        var $ = cheerio.load(doc);

        $('head').prepend('<script src="paget.js"></script>');

        var content = fs.readFileSync('./res/paget.js');
        fs.writeFileSync(destination + '/paget.js', content);

        return $.html();
    },

    /**
    *   Downloads the resource at the desired destination.
    */
    downloadResource: function(url, domain, destination){

        var protocol = (strng.beginsWith('https', domain)) ? 'https' : 'http';
        var old = "";

        if(!strng.beginsWith('http', url) && !strng.beginsWith('https', url)){

            //Does the URL begin with //, some websites does this.
            if(strng.beginsWith('//', url)){

                //Just add the protocol with the URL and you got the full resource.
                url = protocol + ':' + url;

            }else if(strng.beginsWith('/', url)){
                old = url;
                url = domain + url;
            }
        }

        request(url, function(err, res, body){
            if(err) {
                console.log(err);
                return;
            }

            if(res.statusCode == 200){
                console.log('Saving ' + url + '..');
            
                var explodedOld = strng.explode(old, '/');
                
                //Follow each directory layers deep.
                var recursivePath = destination + '/';

                //When there is a directory we need to create each directory.
                explodedOld.forEach(function(item){
                    if(item != ''){
                        if (!fs.existsSync(recursivePath + destination)) {
                            recursivePath = recursivePath + item + '/';
                            fs.mkdirSync(recursivePath + destination);
                            console.log('Created directory: ' + item);
                        }
                    }                   
                });


                //Write the file.
                fs.writeFile(destination + old, body, function(err){
                    if(err){
                        console.log(err);
                        return;
                    }


                    console.log(old + ' was saved.');
                });
            }
        });
    }
};

module.exports = paget;