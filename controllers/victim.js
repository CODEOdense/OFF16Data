'use strict';
var _ = require('underscore');
var joi = require('joi');
var Foxx = require('org/arangodb/foxx');
var ArangoError = require('org/arangodb').ArangoError;
var VictimCollection = applicationContext.collection('cast');
var controller = new Foxx.Controller(applicationContext);

//it's a hackathon, so screw encapsulation
var db = require("org/arangodb").db

/** Get random victim
 *
 * This function simply returns the list of all Fmk.
 */
controller.get('/', function (req, res) {
    let results = db._query("For v in off2016_cast filter v.image_path SORT RAND() LIMIT 3 return v",{ });
    
    res.json(results._documents);
});

/** Get total victims stats
 *
 * Gets victim stats
 */
controller.get('/stats', function (req, res) {
    let victimsWithStats = db._query("for v in off2016_cast filter v.stats.m > 0 || v.stats.k > 0 || v.stats.f > 0 "+
"return { stats: v.stats, id: v._key, name: v.name, image_path: v.image_path}",{ })._documents;
    let mostFucked = db._query("for v in off2016_cast sort v.stats.f desc limit 1 return { stats: v.stats, id: v._key, name: v.name, image_path: v.image_path}",{})._documents[0];
    let mostMarried = db._query("for v in off2016_cast sort v.stats.m desc limit 1 return { stats: v.stats, id: v._key, name: v.name, image_path: v.image_path}",{})._documents[0];
    let mostKilled = db._query("for v in off2016_cast sort v.stats.k desc limit 1 return { stats: v.stats, id: v._key, name: v.name, image_path: v.image_path}",{})._documents[0];
    res.json({
        mostFd: mostFucked,
        mostMd: mostMarried,
        mostKd: mostKilled,
        votes: victimsWithStats
    });
});

/** Registers verdict about a victim
 *
 * Registers verdict about a victim ( f, m or k )
 */
controller.get('/:id/:verdict', function (req, res) {
    let idparam = req.params('id');
    let param = req.params('verdict');
    
    var c = param.toLowerCase();
    if(c != "f" && c != "m" && c != "k") {throw new Error("only 'f', 'm' or 'k' are valid verdicts. recieved '"+param+"'")}
    
    var binding = { id: idparam};
    
    switch (c) {
        case "f":
            db._query("for v in off2016_cast filter v._key == @id " +
                "let f1 = v.stats.f " +
                "let m1 = v.stats.m " +
                "let k1 = v.stats.k " + 
                "update v with { stats: { f: f1+1, m:m1, k:k1}} in off2016_cast", binding);
            break;
        
        case "m":
            db._query("for v in off2016_cast filter v._key == @id " +
                "let f1 = v.stats.f " +
                "let m1 = v.stats.m " +
                "let k1 = v.stats.k " + 
                "update v with { stats: { f: f1, m:m1+1, k:k1}} in off2016_cast", binding);
            break;
      
        case "k":
            db._query("for v in off2016_cast filter v._key == @id " +
                "let f1 = v.stats.f " +
                "let m1 = v.stats.m " +
                "let k1 = v.stats.k " + 
                "update v with { stats: { f: f1, m:m1, k:k1+1}} in off2016_cast",binding);
            break;
    
        default:
            throw new Error("only 'f', 'm' or 'k' are valid verdicts");
    }
});