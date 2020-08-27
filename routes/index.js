var express = require('express');
var router = express.Router();
const zmq = require("zeromq");

////////////////////////
// node zmq_request.js//
////////////////////////

//adapted from https://csil-git1.cs.surrey.sfu.ca/ggbaker/383-project/-/blob/master/mq-demos/zmq_request.js
// UTF-8 handing from https://stackoverflow.com/a/13691499
function encode_utf8(s) {
  return unescape(encodeURIComponent(s));
}
function decode_utf8(s) {
  return decodeURIComponent(escape(s));
}
// adapted from https://github.com/zeromq/zeromq.js/#reqrep
async function requestRun(res, result_obj) {
  const sock = new zmq.Request;
  sock.connect("tcp://127.0.0.1:5555");
  //TODO: add ability to choose when category histogram is made for
  //currently unable since JSON.parse(result_obj.results) is apparently considered an object, even though it clearly is an array of objects????
  /*
  var category_obj = {"category": category}
  var results = JSON.parse(decode_utf8(result_obj.results))
  console.log(results);
  console.log(typeof results);
  var msg = result_obj.results.slice();
  msg.unshift(category_obj);
  console.log(msg);
  var request = encode_utf8(msg)
  */
  var request = encode_utf8(result_obj.results);
  await sock.send(request)
  const [response_bytes] = await sock.receive()
  const response = decode_utf8(response_bytes); //console.log(JSON.parse(response));
  result_obj.histoData = response;
  //TODO: handle Error response from functions.go
  //TODO: add response to result_obj and add histogram
  res.render('result', result_obj);
}

//Server Router
//request for index page
router.get('/', function(req,res) {
    res.render('index')
});

router.post('/submit', function(req,res) {
    var url = req.body.url;
    var cd = req.body.cd;
    var ced = req.body.ced;
    var entry = {url: url, cd: cd, ced: ced};
    const spawn = require("child_process").spawn; //foreign function interface
    const pythonSpawn = spawn('python3',["webscraper.py",url,cd,ced]);
    pythonSpawn.stdout.on('data', function (data) {
      var scrape = data.toString();
      var scrapeP = scrape.split("\n")
      var categories = scrapeP[0]
		  var entries = scrapeP[1];
      pythonSpawn.on('close', (code) => {
        var result_obj = {};
        result_obj.categories = categories;
        result_obj.results = entries;
        requestRun(res, result_obj)
        
      });   
    });
});

module.exports = router;