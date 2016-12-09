var express = require('express');
var fs      = require('fs');
var request = require('request');
var cheerio = require('cheerio');


var app          = express();
var port         = 8081;
var crawlerPages = 'crawler-pages/';
var webUrl       = 'https://en.wikipedia.org/wiki/List_of_Bollywood_films_of_';
var localUrl     = 'http://localhost:8081/' + crawlerPages;


app.use('/crawler-pages', express.static('crawler-pages'));

function downloadThePage(year, $) {

    if (!fs.existsSync(crawlerPages + year + '.html')) {
        fs.writeFile(crawlerPages + year + '.html', $.html(), function (err) {
            console.log('File successfully written! - Check bollywood/' + crawlerPages + year + '.html');
        })
    }
}


function getLocalOrWebURL(year) {
    var fileExists = fs.existsSync(crawlerPages + year + '.html');
    return (fileExists) ? localUrl + year + '.html' : webUrl + year;
}

function getMoviesByYear(year, $) {

    var eachMovie = [];

    console.log('HERERE', $('#mw-content-text').children('.wikitable').length, 'YEAR  :', year)


    $('#mw-content-text').children('.wikitable').each(function (index, ele) {
        var $ele         = $(ele);
        var movieDetails = $ele.children();

        //var movieDetailsHeaders = movieDetails.splice(1,1);


        movieDetails.each(function (movie, i) {
            var movie = $(this).text().split('\n');
            eachMovie.push({
                title          : movie[1],
                director       : movie[2],
                cast           : movie[3],
                genre          : movie[4],
                notes          : movie[5],
                cinematographer: movie[6],
            });

        })

    });
    setTimeout(function () {
        //Create the respective Filess
        if (!fs.existsSync('bollywood/' + year + '.json')) {
            fs.writeFile('bollywood/' + year + '.json', JSON.stringify(eachMovie), function (err) {
                console.log('File successfully written! - Check your project directory for the: bollywood/' + year + '.json file');
            })
        }
    }, 0)
}

app.get('/bollywood', function (req, res) {
    request(getLocalOrWebURL('1920'), function (error, response, html) {
        console.log('ErrorHERER : ', error);
        if (!error) {
            var $ = cheerio.load(html);

            //Download the File to `bollywood/crawler-pages/`  folder
            downloadThePage(1920, $);
            getMoviesByYear(1920, $);


            var bollywoodYearMovies    = [];
            var bollywoodYearMoviesNew = [];

            $('.vertical-navbox').filter(function () {
                var data            = $(this);
                var year            = data.children().find('td').text().trim();
                bollywoodYearMovies = year.split(' ');


                bollywoodYearMoviesNew = $(bollywoodYearMovies).each(function (i, yr) {
                    //console.log(yr, i, yr.length)

                    //Crawl each URL
                    if (yr.length == 4) {

                        console.log('Crawl :', getLocalOrWebURL(yr))
                        request(getLocalOrWebURL(yr), function (error, response, html) {

                            if (!error) {
                                (function (yr, html) {
                                    var $ = cheerio.load(html);

                                    //Download the File to `bollywood/crawler-pages/`  folder
                                    downloadThePage(yr, $);
                                    getMoviesByYear(yr, $)
                                })(yr, html)


                            }
                        })

                    } else if (yr.length >= 8 && ( Number(yr) || (yr.indexOf('\n') != -1))) {

                        var yearArr = [yr.substring(0, 4), yr.substring(4)];
                        if ((yr.indexOf('\n') != -1)) {
                            yearArr = yr.split('\n');
                        }
                        console.log('yearArr : ', yearArr);

                        yearArr.forEach(function (year, i) {
                            console.log('Crawl this:', year, getLocalOrWebURL(year))
                            request(getLocalOrWebURL(year), function (error, response, html) {

                                if (!error) {
                                    (function (yr, html) {
                                        var $ = cheerio.load(html);
                                        //Download the File to `bollywood/crawler-pages/`  folder
                                        downloadThePage(yr, $);
                                        getMoviesByYear(yr, $)
                                    })(year, html)


                                }
                            })

                        })


                    }

                });
            });
        }


        res.send('Check your console!')
    })
})


app.get('/getMovies/:year', function (req, res) {

    res.setHeader("Access-Control-Allow-Origin", "*"); // Request headers you wish to allow
    res.setHeader("Access-Control-Allow-Headers", "*");

    res.sendFile(__dirname + '/bollywood/' + req.params.year + '.json')
});


app.listen(port)


console.log('Magic happens on port ', port);
exports = module.exports = app;
