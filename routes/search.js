var express = require('express');
var router = express.Router();
var http = require('http');
var blockexplorer = require('blockchain.info/blockexplorer');//blockchain module
var request = require('request');//find json data, use url

/* GET home page. */
router.get('/', function(req, res, next) {//라우터 연동 테스트
  if( Object.keys(req.query).length === 0 ){
    res.render('search');
  } else if( req.query.search_blockhash && ( req.query.inoutput === 'input' || req.query.inoutput === 'output' ) ){
    var search_blockhash = req.query.search_blockhash;
    var inoutput = req.query.inoutput;

    console.log('search_blockhash : ', req.query.search_blockhash);
    console.log('inoutput : ', req.query.inoutput);

    request('https://blockchain.info/ko/rawblock/'+search_blockhash, function (err, response, body) {
      if ( !err && response.statusCode == 200 ) {
        var importedJSON = JSON.parse(body);
        var sum_size = 0; //block의 tx size와 실제 size 총 합 비교를 위한 변수
        var sum_value = 0; //input,output의 총 value 합
        var avg_value = 0; //value 평균
        var count_value = 0; //총 input, output  value 개수
        var avg_fee = 0;
        var avg_size = 0;
        var inout_results = [];//input or ouput의 결과 출력을 위한 변수

        //SIZE TEST
        for( var j = 0; j < importedJSON.tx.length; j++ ) {
          console.log('tx['+j+'] size : ',importedJSON.tx[j].size);
          sum_size += importedJSON.tx[j].size;
        }
        //transaction 개수 test
        console.log('importedJSON.n_tx : ',importedJSON.n_tx);//n_tx와 일치
        console.log('importedJSON.tx.length : ',importedJSON.tx.length);
        console.log('size test result :',sum_size);

        //avg_value를 구하기 위해, input,ouput의 value, 총 수량을 구하는 코드
        for( var i = 0; i < importedJSON.tx.length; i++ ) {
          //input
          for (var inputs_length = 0; inputs_length < importedJSON.tx[i].inputs.length; inputs_length++) {
            if(importedJSON.tx[i].inputs[inputs_length].prev_out !== undefined ){
              count_value++;
              console.log('inputs value : ',importedJSON.tx[i].inputs[inputs_length].prev_out.value);
              sum_value += importedJSON.tx[i].inputs[inputs_length].prev_out.value;
            } else {
              console.log('inputs value : empty data');
            }
          }
          //output
          for (var output_length = 0; output_length < importedJSON.tx[i].out.length; output_length++) {
            if(importedJSON.tx[i].out[output_length] !== undefined ){
              count_value++;
              console.log('out value : ',importedJSON.tx[i].out[output_length].value);
              sum_value += importedJSON.tx[i].out[output_length].value;
            } else {
              console.log('out value : empty data');
            }
          }
          console.log('sum value : ',sum_value);//input, output의 value 총 합계
          console.log('count_value : ',count_value);//input, output의 value 총 개수
        }

        //inout에 따른 요구사항2 결과 출력
        if( req.query.inoutput === 'input' ) {//input
          for(var inputs_results = 0; inputs_results < importedJSON.tx.length; inputs_results++){
            for (var inputs_results_array = 0; inputs_results_array < importedJSON.tx[inputs_results].inputs.length; inputs_results_array++) {
              inout_results.push(JSON.stringify(importedJSON.tx[inputs_results].inputs[inputs_results_array]));
            }
          }
        } else{//output
          for(var out_results = 0; out_results < importedJSON.tx.length; out_results++){
            for (var out_results_array = 0; out_results_array < importedJSON.tx[out_results].out.length; out_results_array++) {
              inout_results.push(JSON.stringify(importedJSON.tx[out_results].out[out_results_array]));
            }
          }
        }

        avg_value = sum_value / count_value;//평균 value
        avg_fee = importedJSON.fee / importedJSON.n_tx;//평균 fee
        avg_size = importedJSON.size / importedJSON.n_tx;//평균 size

        res.render('search',{
          blockhash : search_blockhash,
          prev_block : importedJSON.prev_block,
          n_tx : importedJSON.n_tx,
          avg_value : avg_value,
          avg_fee : avg_fee,
          avg_size : avg_size,
          inoutput : req.query.inoutput,
          inout_results : inout_results
        });
      } else {//Wrong Block Hash
        console.log('ERROR : Wrong Block Hash!');
        res.redirect('/search');
      }
    });
  } else{
    res.redirect('/');
  }
});

router.post('/', function(req, res, next){
  var search_blockhash = req.body.search_blockhash;
  var inoutput = req.body.inoutput;

  console.log('search_blockhash : ',search_blockhash);
  console.log('inoutput : ',inoutput);

  //find json data, use url
  request('https://blockchain.info/ko/rawblock/'+search_blockhash, function (err, response, body) {
    if (!err && response.statusCode == 200) {
       var importedJSON = JSON.parse(body);

       res.redirect('/search/?search_blockhash='+search_blockhash+'&inoutput='+inoutput);
    } else {//Wrong Block Hash
      console.log('ERROR : Wrong Block Hash!');
      res.redirect('/search');
    }
  });
});

module.exports = router;
