'use strict';
var _ = require('underscore');
var joi = require('joi');
var Foxx = require('org/arangodb/foxx');
var ArangoError = require('org/arangodb').ArangoError;
var Films = require('../repositories/films');
var Film = require('../models/film');
var controller = new Foxx.Controller(applicationContext);

//it's a hackathon, so screw encapsulation
var db = require("org/arangodb").db

var filmIdSchema = joi.string().required()
.description('The id of the film')
.meta({allowMultiple: false});

var films = new Films(
  applicationContext.collection('films'),
  {model: Film}
);

/** Lists of all films.
 *
 * This function simply returns the list of all Film.
 */
controller.get('/', function (req, res) {
  res.json(_.map(films.all(), function (model) {
    return model.forClient();
  }));
});

/** Seach films
 *
 * Lists of all with a text-property corresponding "search"-param
 */
controller.get('/search/:searchparam', function (req, res) {
    let p = req.params('searchparam');
    let q = "FOR f IN off2016_films FILTER CONTAINS(LOWER(f.original_title),LOWER(@param)) RETURN f";
    
    let results = db._query(q,{param: p });
    
    res.json(results);
});

/** Creates a new film.
 *
 * Creates a new film. The information has to be in the
 * requestBody.
 */
controller.post('/', function (req, res) {
  var film = req.parameters.film;
  res.json(films.save(film).forClient());
})
.bodyParam('film', {
  description: 'The film you want to create',
  type: Film
});

/** Reads a film.
 *
 * Reads a film.
 */
controller.get('/:id', function (req, res) {
  var id = req.urlParameters.id;
  res.json(films.byId(id).forClient());
})
.pathParam('id', filmIdSchema)
.errorResponse(ArangoError, 404, 'The film could not be found');


/** Updates a film.
 *
 * Changes a film. The information has to be in the
 * requestBody.
 */
controller.patch('/:id', function (req, res) {
  var id = req.urlParameters.id;
  var patchData = req.parameters.patch;
  res.json(films.updateById(id, patchData));
})
.pathParam('id', filmIdSchema)
.bodyParam('patch', {
  description: 'The patch data you want your film to be updated with',
  type: joi.object().required()
})
.errorResponse(ArangoError, 404, 'The film could not be found');

/** Removes a film.
 *
 * Removes a film.
 */
controller.delete('/:id', function (req, res) {
  var id = req.urlParameters.id;
  films.removeById(id);
  res.json({success: true});
})
.pathParam('id', filmIdSchema)
.errorResponse(ArangoError, 404, 'The film could not be found');
