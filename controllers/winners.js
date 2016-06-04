'use strict';
var _ = require('underscore');
var joi = require('joi');
var Foxx = require('org/arangodb/foxx');
var ArangoError = require('org/arangodb').ArangoError;
var Winners = require('../repositories/winners');
var Winner = require('../models/winner');
var controller = new Foxx.Controller(applicationContext);

var winnerIdSchema = joi.string().required()
.description('The id of the winner')
.meta({allowMultiple: false});

var winners = new Winners(
  applicationContext.collection('winners'),
  {model: Winner}
);

/** Lists of all winners.
 *
 * This function simply returns the list of all Winner.
 */
controller.get('/', function (req, res) {
  res.json(_.map(winners.all(), function (model) {
    return model.forClient();
  }));
});

/** Creates a new winner.
 *
 * Creates a new winner. The information has to be in the
 * requestBody.
 */
controller.post('/', function (req, res) {
  var winner = req.parameters.winner;
  res.json(winners.save(winner).forClient());
})
.bodyParam('winner', {
  description: 'The winner you want to create',
  type: Winner
});

/** Reads a winner.
 *
 * Reads a winner.
 */
controller.get('/:id', function (req, res) {
  var id = req.urlParameters.id;
  res.json(winners.byId(id).forClient());
})
.pathParam('id', winnerIdSchema)
.errorResponse(ArangoError, 404, 'The winner could not be found');


/** Updates a winner.
 *
 * Changes a winner. The information has to be in the
 * requestBody.
 */
controller.patch('/:id', function (req, res) {
  var id = req.urlParameters.id;
  var patchData = req.parameters.patch;
  res.json(winners.updateById(id, patchData));
})
.pathParam('id', winnerIdSchema)
.bodyParam('patch', {
  description: 'The patch data you want your winner to be updated with',
  type: joi.object().required()
})
.errorResponse(ArangoError, 404, 'The winner could not be found');

/** Removes a winner.
 *
 * Removes a winner.
 */
controller.delete('/:id', function (req, res) {
  var id = req.urlParameters.id;
  winners.removeById(id);
  res.json({success: true});
})
.pathParam('id', winnerIdSchema)
.errorResponse(ArangoError, 404, 'The winner could not be found');
