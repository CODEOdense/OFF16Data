'use strict';
var _ = require('underscore');
var joi = require('joi');
var Foxx = require('org/arangodb/foxx');
var ArangoError = require('org/arangodb').ArangoError;
var Casts = applicationContext.collection('cast');
var controller = new Foxx.Controller(applicationContext);

//it's a hackathon, so screw encapsulation
var db = require("org/arangodb").db

var castIdSchema = joi.string().required()
.description('The id of the cast')
.meta({allowMultiple: false});

/** Lists of all Casts.
 *
 * This function simply returns the list of all Cast.
 */
controller.get('/', function (req, res) {
  res.json(Casts.all().toArray());
});


/** Reads a cast.
 *
 * Reads a cast.
 */
controller.get('/:id', function (req, res) {
  var id = req.urlParameters.id;
  res.json(Casts.document(id));
})
.pathParam('id', castIdSchema)
.errorResponse(ArangoError, 404, 'The cast could not be found');
