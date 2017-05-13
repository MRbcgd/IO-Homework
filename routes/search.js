var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {//라우터 연동 테스트
  res.render('search');
});

router.post('/', function(req, res, next){
  console.log(req.body);//test of search data
});

module.exports = router;
