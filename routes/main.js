const fs = require('fs');

const express = require('express');
const router = express.Router();

const msql = require("../middleware/msql")

//////////////////////
///Server Functions///
//////////////////////

function router_response(args) {
  console.log(args["api_key"]);
	args["response"].render(args["page"], {"results": args["results"], "api_key": args["api_key"]});
}

///////////////////
///Server Router///
///////////////////

//request for index page
router.get('/', function(req,res) {
	let test_loc = msql.Location.init_partial("Canada", "British Columbia", "Burnaby");
  /*
  //possible foreign language interface for methods
  const spawn = require("child_process").spawn; //foreign function interface
  const pythonSpawn = spawn('python3', ["config.py"]);
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
  */
  fs.readFile("resources/api_key.json", "utf-8", (err, data) => {
    if (err) {
      throw err;
    }
    const api_key = JSON.parse(data.toString());
    let cb_args = {"api_key": api_key["api_key"], "response": res, "page": "template"};
    msql.get_data(msql.connect(), [test_loc], router_response, cb_args);
  });
});

/*
router.post('/submit', function(req,res) {
	var addr = req.body.address;
	var id = req.body.memberid;
	var result = {address: addr, memberid: id};
	res.render('result', result);
});
*/

/*
//foreign function interface
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
*/

module.exports = router;