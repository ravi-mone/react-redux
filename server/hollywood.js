var express = require('express');
var fs      = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var jQuery = require('jquery');
var app     = express();

app.get('/scrape', function(req, res){
  // Let's scrape Anchorman 2
  url = 'http://www.imdb.com/title/tt1229340/';

  request(url, function(error, response, html){
    if(!error){
      var $ = cheerio.load(html);

      var title, release, rating;
      var json = { title : "", release : "", rating : ""};



      $('.title_wrapper').filter(function(){
        var data = $(this);
        title = data.children().first().text().trim();
        release = data.children().last().children().last().text().trim();

        json.title = title;
        json.release = release;
      })




        var download = function(uri, filename, callback){
            request.head(uri, function(err, res, body){
                console.log(res)

                console.log('content-type:', res.headers['content-type']);
                console.log('content-length:', res.headers['content-length']);

                request(uri).pipe(fs.createWriteStream('hollywood/'+filename)).on('close', callback);
            });
        };
        var downloadImg = $('.slate_wrapper .poster a img');

        download(downloadImg[0].attribs.src, (json.title).replace(/\s/g, "_"), function(){
            console.log('done');
        });


      $('.ratingValue').filter(function(){
        var data = $(this);
        rating = data.text().trim();

        json.rating = rating;
      })
    }

    fs.writeFile('hollywood/hollywood.json', JSON.stringify(json, null, 4), function(err){
      console.log('File successfully written! - Check your project directory for the output.json file');
    })

    res.send('Check your console!')
  })
})

app.get('/getHollywoodMovies', function(req, res){
    res.setHeader("Access-Control-Allow-Origin", "*"); // Request headers you wish to allow
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.sendFile(__dirname+'/hollywood/hollywood.json')
});

app.listen('8081')
console.log('Magic happens on port 8081');
exports = module.exports = app;
