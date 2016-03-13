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
app.use(bodyparser.urlencoded({
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
mongoose.connect("mongodb://localhost/mongoScrapingDB");
var db = mongoose.connection;

db.on("error", function(err) {
  console.log("Mongoose Error: ", err);
});
db.once("open", function() {
  console.log("Mongoose connection successful.");
});

//Require Schemas
var Note = require("./noteModel.js");
var Data = require("./dataModel.js");

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
      var data = new Data({
        data: text
      });
      data.save(function(err, doc) {
        if (err) {
          console.log(err);
        } else {
          console.log(doc);
        }
      });
    });
  });
  res.redirect("/")
});

app.get("/data", function (req, res) {
 Data.find({}, function(err, data){
    if (err){
      throw err;
    }
    Note.find({}, function(err, note){
      if (err){
        throw err;
      }
      res.render("data", {data: data});
    });
  });
});

//New Note Creation
app.post("/notes", function(req, res) {
  var id = req.body.id
  var newNote = new Note(req.body);
 
//Save the new note
  newNote.save(function(err, doc) {
    if (err) {
      res.send(err);
    } else {

//Find the cooressponding data and push the new note id into the data's notes array
      Data.findOneAndUpdate({_id: id}, {$push: {"notes": doc._id}}, {new: true}, function(err, doc) {
        if (err) {
          res.send(err);
        } else {
          res.send(doc);
        }
      });

    }
  });

});

app.listen(PORT, function() {
  console.log("App running on port %s", PORT);
});