//jshint esversion:6


const express = require("express");
const request = require("request");
const https = require("https");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
var querystring = require('querystring');
const SpotifyWebApi = require('spotify-web-api-node');
require("dotenv").config();
const app = express();
var city, count;
var temperature;
var temp_2;
var temp_3;
var temp_4;
var pressure;
var humidity;
var visibility;
var wind;
var cloud;
var fname = [];
var fartist = [];
var fimg = [];
var fhref = [];
// var user_id = '7c16ae0ab15c404bb748055929b97de6'
var token = "";

mongoose.set("strictQuery", false);
mongoose.connect("mongodb+srv://saumodeepdutta:saumo2002@clusterweatherapp.inigswu.mongodb.net/weatherApp", {
  useNewUrlParser: true
});

const infoSchema = {
  username: String,
  email: String
}

const Info = mongoose.model("Info", infoSchema);



// credentials are optional

var clientId = '7c16ae0ab15c404bb748055929b97de6';
var clientSecret = '6a91e71c4e50484db5425dd319667800';
var redirectUri = 'http://localhost:3000/callback';

app.use(express.urlencoded({
  extended: true
}));
app.set("view engine", "ejs");


app.use(express.static("public"));
app.use('/css', express.static(__dirname + 'public/css'));
app.use('/js', express.static(__dirname + 'public/js'));
app.use('/Images', express.static(__dirname + 'public/Images'));

// app.post('/info', function(req,res){
//
//   res.render('thankyou');
// })

app.get("/", function(req, res) {
  res.render("info", {
    weather: null,
    error: null
  });
})

app.post('/login', function(req, res) {
  var uname = req.body.username;
  var email = req.body.email;
  const addedInfo = new Info({
    username: uname,
    email: email
  })


  addedInfo.save();
  res.redirect('/index');
})





app.post("/start", function(req, res) {

  city = req.body.cityName;
  const appid = "7c01dabdb9d026e60d33755e166d2d72";
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=metric&appid=" + appid;
  request(url, function(err, response, body) {

    if (err) {
      console.log("Error!");
      res.render('error', {
        weather: null,
        error: 'Error,please try again!'
      });
    } else {

      var weather = JSON.parse(body);

      console.log(weather);

      if (weather.cod == '404') {
        console.log("Hello!");
        res.render('error', {
          weather: null,
          error: weather.message
        });
      } else {

        temperature = Math.round(weather.main.temp);
        temp_2 = Math.round(weather.main.feels_like);
        temp_3 = Math.round(weather.main.temp_min);
        temp_4 = Math.round(weather.main.temp_max);
        pressure = weather.main.pressure;
        humidity = weather.main.humidity;
        visibility = weather.visibility;
        wind = Math.round(weather.wind.speed);
        cloud = weather.clouds.all;
        var desc = weather.weather[0].description;
        // console.log(desc);


        res.render('output', {
          weather: weather,
          city: city,
          desc: desc,
          temperature: temperature,
          temp_2: temp_2,
          temp_3: temp_3,
          temp_4: temp_4,
          pressure: pressure,
          humidity: humidity,
          visibility: visibility,
          wind: wind,
          cloud: cloud,
          error: null
        });
      }



    }

  });

})

app.get("/hours", function(req, res) {

  console.log(city);
  const appid = "7c01dabdb9d026e60d33755e166d2d72";
  const url = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=metric&appid=" + appid;
  request(url, function(err, response, body) {

    if (err) {
      res.render('index', {
        weather: null,
        error: 'Error,please try again!'
      });
    } else {

      var weather = JSON.parse(body);

      var list = weather.list;
      // console.log(weather);
      var temperature = [];
      var des = [];
      var humidity = [];
      var pressure = [];
      var time = [];

      for (var i = 0; i < list.length; i++) {
        temperature[i] = (Math.round(list[i].main.temp));
        des[i] = list[i].weather[0].description;
        humidity[i] = list[i].main.humidity;
        pressure[i] = list[i].main.pressure;
        time[i] = list[i].dt_txt;
      }
      count = list.length;


      // console.log(temperature);
      // console.log(des);
      // console.log(temperature);
      // console.log(humidity);
      // console.log(pressure);
      // console.log(time);
      const url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=metric&appid=" + appid;
      request(url, function(err, response, body) {
        var weather = JSON.parse(body);
        // console.log(weather);
        var desc = weather.weather[0].description;
        // console.log(desc);
        res.render('48_hours', {
          desc: desc,
          weather: weather,
          temperature: temperature,
          des: des,
          humidity: humidity,
          pressure: pressure,
          time: time,
          count: count,
          city: city
        })
      })




    }
  });
})

app.post('/listen', function(req, res) {
  var playlistName;
  var playlistId;

  var cityMusic = req.body.cityMusic;
  // console.log(cityMusic);
  const appid = "7c01dabdb9d026e60d33755e166d2d72";
  const url3 = "https://api.openweathermap.org/data/2.5/weather?q=" + cityMusic + "&units=metric&appid=" + appid;
  request(url3, function(err, response, body) {
    if (err) {
      console.log("Error!");
      res.render('error2', {
        weather: null,
        error: 'Error,please try again!'
      });
    } else {
      var weather = JSON.parse(body);
      if (weather.cod == '404') {


        res.render('error2', {
          weather: null,
          error: weather.message
        });
      } else {
        var weather = JSON.parse(body);

        var desc = weather.weather[0].description;
        // console.log(desc);
        var songName = [];
        var songArtist = [];
        var songImg = [];
        var songHref = [];
        var type = "";
        if (desc == 'clear sky' || desc == 'few clouds') {
          type = 'Joyful';
          songName = [
            'Lovely Day',
            'Good Time',
            'Brave',
            'Lucky',
            'Celebration',
            'Dreamer'
          ];
          songArtist = [
            'Bill Withers',
            'Owl City',
            'Sara Bareilles',
            'Jason Mraz',
            'Kool & The Gang',
            'Axwell /\\ Ingrosso'
          ];
          songImg = [
            'https://i.scdn.co/image/ab67616d0000b2735ade9b4d547203c9061fc340',
            'https://i.scdn.co/image/ab67616d0000b273cf5459850259268f98b07f7a',
            'https://i.scdn.co/image/ab67616d0000b273022b4010e20659300f42c375',
            'https://i.scdn.co/image/ab67616d0000b273125b1a330b6f6100ab19dbed',
            'https://i.scdn.co/image/ab67616d0000b273887b7c596249f628db6c6473',
            'https://i.scdn.co/image/ab67616d0000b273fba6de0b38b0168d480b1a27'
          ];

        } else if (desc == 'scattered clouds' || desc == 'broken clouds') {
          type = 'Serene';
          songName = [
            'Weightless',
            'Gymnopédie No. 1',
            'Minecraft',
            'Clair De Lune',
            'Watermark',
            'Morning Has Broken'
          ];
          songArtist = [
            'Marconi Union',
            'Erik Satie',
            'C418',
            'Claude Debussy',
            'Enya',
            'Yusuf / Cat Stevens'
          ];
          songImg = [
            'https://i.scdn.co/image/ab67616d0000b273f399efa20097105e9db88560',
            'https://i.scdn.co/image/ab67616d0000b273fa24c97b4c8aaf5ccdcccf08',
            'https://i.scdn.co/image/ab67616d0000b273aaeb5c9fb6131977995b7f0e',
            'https://i.scdn.co/image/ab67616d0000b273107b21ec016eedb6cbe9ebd9',
            'https://i.scdn.co/image/ab67616d0000b273508c86c93151fdbbeb8f033d',
            'https://i.scdn.co/image/ab67616d0000b273891a521c254c2ace996efacb'
          ];
        } else if (desc == 'rain' || desc == 'light rain' || desc == 'moderate rain') {
          type = 'Romantic';
          songName = [
            'All of Me',
            'Perfect',
            'Love On Top',
            'At Last',
            'Unchained Melody',
            'Thinking out Loud'
          ];
          songArtist = [
            'John Legend',
            'Ed Sheeran',
            'Beyoncé',
            'Etta James',
            'The Righteous Brothers',
            'Ed Sheeran'
          ];
          songImg = [
            'https://i.scdn.co/image/ab67616d0000b27394c9217a398f5174757c0c78',
            'https://i.scdn.co/image/ab67616d0000b273ba5db46f4b838ef6027e6f96',
            'https://i.scdn.co/image/ab67616d0000b273ff5429125128b43572dbdccd',
            'https://i.scdn.co/image/ab67616d0000b273b2229a8fdf377abaf3652624',
            'https://i.scdn.co/image/ab67616d0000b273cd7530409d09802935c840f9',
            'https://i.scdn.co/image/ab67616d0000b27313b3e37318a0c247b550bccd'
          ];
        } else if (desc == 'thunderstorm' || desc == 'thunderstorm with rain' || desc == 'overcast clouds') {
          type = 'Loud';
          songName = [
            'Mr. Brightside',
            'Eye of the Tiger',
            'Shut Up and Dance',
            'I Gotta Feeling',
            'Uptown Funk',
            'Back In Black'
          ];
          songArtist = [
            'The Killers',
            'Survivor',
            'WALK THE MOON',
            'Black Eyed Peas',
            'Mark Ronson',
            'AC/DC'
          ];
          songImg = [
            'https://i.scdn.co/image/ab67616d0000b273ccdddd46119a4ff53eaf1f5d',
            'https://i.scdn.co/image/ab67616d0000b273f4a2ccbe20d6d52f16816812',
            'https://i.scdn.co/image/ab67616d0000b27343294cfa2688055c9d821bf3',
            'https://i.scdn.co/image/ab67616d0000b2730bd44f5ff9ecc99f7770acc5',
            'https://i.scdn.co/image/ab67616d0000b273656e921d6769ba28a74acc17',
            'https://i.scdn.co/image/ab67616d0000b2730b51f8d91f3a21e8426361ae'
          ];
        } else if (desc == 'haze' || desc == 'mist') {
          type = 'Sad';
          songName = [
            'Someone Like You',
            'Everybody Hurts',
            'Fix You',
            'Say You Love Me',
            'My Immortal',
            'All I Want'
          ];
          songArtist = [
            'Adele',
            'R.E.M.',
            'Coldplay',
            'Jessie Ware',
            'Evanescence',
            'Kodaline'
          ];
          songImg = [
            'https://i.scdn.co/image/ab67616d0000b273164feb363334f93b6458d2a9',
            'https://i.scdn.co/image/ab67616d0000b273ace3e7aae0b7c78bbe1c4f35',
            'https://i.scdn.co/image/ab67616d0000b2734e0362c225863f6ae2432651',
            'https://i.scdn.co/image/ab67616d0000b2732dbf71c8b961ae579330f41f',
            'https://i.scdn.co/image/ab67616d0000b27325f49ab23f0ec6332efef432',
            'https://i.scdn.co/image/ab67616d0000b2733e42854096da9a3b1ca901c9'
          ];
        } else {
          type = 'Lo-Fi';
          songName = [
            'Coffee',
            'Locket',
            'Flaming Hot Cheetos',
            'Take Me Home',
            'You Hurt My Soul',
            'Sometimes'
          ];
          songArtist = [
            'beabadoobee',
            'Crumb',
            'Clairo',
            'Tom Waits',
            'Neb',
            'stream_error'
          ];
          songImg = [
            'https://i.scdn.co/image/ab67616d0000b273ad2c1e1bcbc8d7415636691b',
            'https://i.scdn.co/image/ab67616d0000b2734909d4c4d0043ce7f5840829',
            'https://i.scdn.co/image/ab67616d0000b27390c00af3fd8de6b9f510c1b8',
            'https://i.scdn.co/image/ab67616d0000b27339404d895049eefe0b0b0e30',
            'https://i.scdn.co/image/ab67616d0000b273b089e718b9043ca089d8fbbe',
            'https://i.scdn.co/image/ab67616d0000b2735c208e16d7cce23212ccbece'
          ];
        }





        // console.log(songs)
        // console.log("playlist: " + playlist.name);
        var j = 0;

        // consol.log(songHref);
        arr = [];
        while (arr.length < 3) {
          var r = Math.floor(Math.random() * (5 - 0 + 1) + 0);
          if (arr.indexOf(r) === -1) arr.push(r);
        }
        for (var i = 0; i < 3; i++) {

          console.log(arr);
          fname[i] = songName[arr[i]];
          fartist[i] = songArtist[arr[i]];
          fimg[i] = songImg[arr[i]];
          fhref[i] = songHref[arr[i]];
        }
        res.render('music_output', {
          desc: desc,
          type: type,
          fname: fname,
          fartist: fartist,
          fimg: fimg
        });
      }



    }



  })
})


app.get('/index', function(req, res) {
  res.render('index');
})

app.get('/About', function(req, res) {
  res.render('About');
})

app.get('/Support', function(req, res) {
  res.render('Support');
})

app.get('/music', function(req, res) {
  res.render('music');
})

app.get('/home', function(req, res) {
  res.render('index');
})

app.get('/', function(req, res) {
  res.render('info');
})


app.listen(3000, function() {
  console.log("Server is running on port 3000");
})
