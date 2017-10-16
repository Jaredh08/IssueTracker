var express = require('express');
var router = express.Router();
var Sequelize = require ('sequelize');

/* GET login page. */
router.get('/', function(req, res, next) {
    res.render('login', { title: 'Login' });
});

module.exports = router;
