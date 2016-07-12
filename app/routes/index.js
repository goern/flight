/*
 *
 */


var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
   res.render('index.html');
});

router.get('/airports', function(req, res, next) {
   res.render('airports.html');
});

router.get('/flightplans', function(req, res, next) {
   res.render('flightplans.html');
});

router.get('/flightplans/new', function(req, res) {
    res.render('flightplans/new.html');
});

router.get('/airlines', function(req, res, next) {
   res.render('airlines.html');
});

module.exports = router;
