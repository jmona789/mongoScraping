var express = require("express");
var app = express();
var request = require("request");
var cheerio = require("cheerio");

//Database configuration
var mongojs = require("mongojs");
var databaseUrl = "mongoScraperDB";
var collections = ["scrapedData"];
var db = mongojs(databaseUrl, collections);
db.on("error", function(err) {
  console.log("Database Error:", err);
});


app.listen(3000, function() {
  console.log("App running on port %s", PORT);
});