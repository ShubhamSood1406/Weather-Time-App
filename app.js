
const express = require("express");
const https  = require("https");
const bodyParser = require("body-parser");
const ejs = require("ejs");
require("dotenv").config()

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", function(req, res){
  res.render("home");
});

app.post("/info", function(req, res){


  const city = req.body.cityName;
  if(city != undefined ){
    const apiKeyWeather = "open weather API key";
    const urlWeather = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=metric&appid=" + apiKeyWeather;


    https.get(urlWeather, function(response){
        console.log(response.statusCode);

        response.on("data", function(data){
          const weatherData = JSON.parse(data);
          console.log(weatherData);


          if(weatherData.cod != 404){

            const lon = weatherData.coord.lon;
            const lat = weatherData.coord.lat;


            const apiKeyTime = "time zone DB Api key";
            const urlTime = "https://api.timezonedb.com/v2.1/get-time-zone?key=" + apiKeyTime + "&format=json&by=position&lat=" + lat + "&lng=" + lon;


            const cityName = weatherData.name;
            const countryName = weatherData.sys.country;

            const temp = weatherData.main.temp;
            const minTemp = weatherData.main.temp_min;
            const maxTemp = weatherData.main.temp_max;

            const description = weatherData.weather[0].main;

            const icon = weatherData.weather[0].icon;
            const iconURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

            https.get(urlTime, function(response1){
                console.log("time" + response1.statusCode);

                response1.on("data", function(data){
                  const timeData = JSON.parse(data);
                  console.log(timeData);
                  console.log(timeData.formatted);

                  const dateTime = timeData.formatted;
                    res.render("info", {dateTimeInfo: dateTime, cityNameInfo: cityName, countryNameInfo: countryName, tempInfo: temp, minTempInfo: minTemp, maxTempInfo: maxTemp, descriptionInfo: description, iconInfo: icon, iconURLInfo: iconURL});
                });
            });
          }

          else {
            res.redirect("/");
          }
        });
    });
  }

});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running on port 3000.");
});
