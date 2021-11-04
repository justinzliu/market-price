var express = require('express');
var router = express.Router();

//Server Router
//request for index page
router.get('/', function(req,res) {
    res.render('index');
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