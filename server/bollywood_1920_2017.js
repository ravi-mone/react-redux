var express = require('express');
var fs      = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();


app.get('/bollywood', function(req, res){
    // Let's scrape Anchorman 2
    url = 'https://en.wikipedia.org/wiki/List_of_Bollywood_films_of_1920';

    request(url, function(error, response, html){

        if(!error){
            var $ = cheerio.load(html);
            var bollywoodYearMovies = [];
            var bollywoodYearMoviesNew=[];
            var eachMovie = [];



            $('.vertical-navbox').filter(function(){
                var data = $(this);
                var year = data.children().find('td').text().trim();
                bollywoodYearMovies = year.split(' ');
                bollywoodYearMoviesNew = bollywoodYearMovies.map(function(yr, i){
                    if(yr.indexOf('\n') != -1){
                        return yr.split('\n');
                    }
                    if(yr.length >=  8 && Number(yr)){
                        return [yr.substring(0,4), yr.substring(4)]
                    }
                    return parseFloat(yr);
                })
                console.log('YEAR : ', bollywoodYearMoviesNew);
            });

            //Get the Films of 1920

            /*$('.wikitable').map(function(i, movie){
                var movieDetails = $(movie).find('tbody tr');
                movieDetails.map(function (movie, i) {

                    var movie = $(this).text().split('\n');
                    console.log(movie)
                    return;
                })

            })*/

            console.log('NEW TR', $('.wikitable tbody').children)
                //var movieDetails = data.children().find('tbody tr');


               /* movieDetails.each(function (movie, i) {
                    console.log('WIKI ', movie);
                    return;
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

            })*/




        }
        fs.writeFile('bollywood/1920.json', JSON.stringify(eachMovie, null, 4), function(err){
            console.log('File successfully written! - Check your project directory for the output.json file');
        })

        res.send('Check your console!')
    })
})


app.get('/getMovies', function(req, res){
    res.setHeader("Access-Control-Allow-Origin", "*"); // Request headers you wish to allow
     res.setHeader("Access-Control-Allow-Headers", "*");
    res.sendFile(__dirname+'/bollywood/bollywood_movies.json')
});


app.listen('8081')
console.log('Magic happens on port 8081');
exports = module.exports = app;
