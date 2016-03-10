//Node packages
var express = require("express");
var app = express();
var request = require("request");
var cheerio = require("cheerio");
var expressHandlebars = require("express-handlebars");
var bodyparser = require("body-parser");
var PORT = process.env.PORT || 9001;

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

app.get("/", function (req, res) {
  res.render("home");
});

app.listen(PORT, function() {
  console.log("App running on port %s", PORT);
});