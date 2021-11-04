var express = require('express');
var router = express.Router();

var msql = require("../middleware/msql")

//////////////////////
///Server Functions///
//////////////////////

function router_response(args) {
	args["response"].render(args["page"], args["results"])
}

///////////////////
///Server Router///
///////////////////

//request for index page
router.get('/', function(req,res) {
	let test_loc = msql.Location.init_partial("Canada", "British Columbia", "Burnaby")
	let cb_args = {"response": res, "page": "template"}
	msql.get_data(msql.connect(), test_loc, ["schools", "crimes", "census"], router_response, cb_args)
	//console.log(res)
    //res.render('template', {crimes: "testing"});
});

/*
router.post('/submit', function(req,res) {
	var addr = req.body.address;
	var id = req.body.memberid;
	var result = {address: addr, memberid: id};
	res.render('result', result);
});
*/

module.exports = router;