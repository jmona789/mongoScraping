//Node packages
var express = require("express");
var app = express();
var request = require("request");
var cheerio = require("cheerio");
var expressHandlebars = require("express-handlebars");
var bodyparser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var PORT = process.env.PORT || 9001;

//logger set up
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

//static folder
app.use(express.static("public"));

//Handlebars set up
app.engine("handlebars", expressHandlebars({
  defaultLayout: "main"
}));

app.set("view engine", "handlebars");

//Database configuration
var mongojs = require("mongojs");
var databaseUrl = "mongoScraperDB";
var collections = ["scrapedData"];
var db = mongojs(databaseUrl, collections);
db.on("error", function(err) {
  console.log("Database Error:", err);
});

//Home page
app.get("/", function (req, res) {
  res.render("home");
});

//Scrape titles of videos from youtube home page and add to database
app.get("/scraper", function(req, res){
  request("https://www.youtube.com/", function (error, response, html) {
    var $ = cheerio.load(html);
    $("h3.yt-lockup-title").each(function(i, element){
      var a = $(this);
      var text = a.text();
      db.scrapedData.save({title: text});
    });
  });
  res.redirect("/")
});

app.get("/data", function (req, res) {
 db.scrapedData.find({}, function(err, dbResults){
    if (err){
      throw err;
    }
    res.render("data", {data: dbResults});
    // res.json(dbResults);
  });
});

app.post(".notes", function(req, res){ 
});

app.listen(PORT, function() {
  console.log("App running on port %s", PORT);
});