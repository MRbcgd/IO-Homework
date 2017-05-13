var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('block', { title: 'test of block' });
});

module.exports = router;
