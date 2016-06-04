'use strict';
var _ = require('underscore');
var joi = require('joi');
var Foxx = require('org/arangodb/foxx');
var ArangoError = require('org/arangodb').ArangoError;
var Fmks = applicationContext.collection('FMK');
var controller = new Foxx.Controller(applicationContext);

//it's a hackathon, so screw encapsulation
var db = require("org/arangodb").db

var fmkIdSchema = joi.string().required()
.description('The id of the fmk')
.meta({allowMultiple: false});

/** Lists of all Fmks.
 *
 * This function simply returns the list of all Fmk.
 */
controller.get('/', function (req, res) {
  res.json(Fmks.all().toArray());
});

/** Creates a new fmk.
 *
 * Creates a new fmk. The information has to be in the
 * requestBody.
 */
controller.post('/', function (req, res) {
  var f = req.parameters.fmk;
  var result = Fmks.insert(f);
  res.json(result);
})
.bodyParam('fmk', {
  description: 'The fmk you want to create',
});

/** Reads a fmk.
 *
 * Reads a fmk.
 */
controller.get('/:id', function (req, res) {
  var id = req.urlParameters.id;
  res.json(Fmks.document(id));
})
.pathParam('id', fmkIdSchema)
.errorResponse(ArangoError, 404, 'The fmk could not be found');


/** Updates a fmk.
 *
 * Changes a fmk. The information has to be in the
 * requestBody.
 */
controller.patch('/:id', function (req, res) {
  var id = req.urlParameters.id;
  var patchData = req.parameters.patch;
  res.json(Fmks.updateById(id, patchData));
})
.pathParam('id', fmkIdSchema)
.bodyParam('patch', {
  description: 'The patch data you want your fmk to be updated with',
  type: joi.object().required()
})
.errorResponse(ArangoError, 404, 'The fmk could not be found');

/** Removes a fmk.
 *
 * Removes a fmk.
 */
controller.delete('/:id', function (req, res) {
  var id = req.urlParameters.id;
  Fmks.removeById(id);
  res.json({success: true});
})
.pathParam('id', fmkIdSchema)
.errorResponse(ArangoError, 404, 'The fmk could not be found');
