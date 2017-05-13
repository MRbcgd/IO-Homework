var express = require('express');
var router = express.Router();
var http = require('http');
var blockexplorer = require('blockchain.info/blockexplorer');//blockchain module
var request = require('request');//find json data, use url

/* GET home page. */
router.get('/', function(req, res, next) {//라우터 연동 테스트
  if( Object.keys(req.query).length === 0 ){
    res.render('search');
  } else if( req.query.argument1 && ( req.query.argument2 === 'input' || req.query.argument2 === 'output' )){
    console.log(req.query);
  } else{
    res.redirect('/');
  }
});

// router.get('/', function(req, res, next){
//
// });

router.post('/', function(req, res, next){
  var search_blockhash = req.body.search_blockhash;
  var inoutput = req.body.inoutput;

  console.log('search_blockhash : ',search_blockhash);
  console.log('inoutput : ',inoutput);

  //find json data, use url
  request('https://blockchain.info/ko/rawblock/'+search_blockhash, function (err, response, body) {
    if (!err && response.statusCode == 200) {
       var importedJSON = JSON.parse(body);

       res.redirect('/search/?argument1='+search_blockhash+'&argument2='+inoutput);
    } else {//Wrong Block Hash
      console.log('ERROR : Wrong Block Hash!');
      res.redirect('/search');
    }
  });
});

module.exports = router;
