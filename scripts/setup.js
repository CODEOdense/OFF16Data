'use strict';
var db = require("org/arangodb").db;

function createCollection(name) {
  var collectionName = applicationContext.collectionName(name);
  var coll = db._collection(collectionName);
  if (coll === null) {
    coll = db._create(collectionName);
  } else if (applicationContext.isProduction) {
    console.warn("collection '%s' already exists. Leaving it untouched.", collectionName);
  }
  return coll;
}

var films = createCollection("films");
var winners = createCollection("winners");
var cast = createCollection("cast");
var fmk = createCollection("FMK");


//Add startupdata
fmk.insert({"hello":"world"});