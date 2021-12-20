const { format } = require("mysql2");
var msql = require("./msql")

function cb_test(args) {
    let location_keys = Object.keys(args["results"])
    for(let i=0; i<location_keys.length; i++) {
        let location_key = location_keys[i];
        console.log("key:", location_key);
        console.log("value:", args["results"][location_key]);
    }
   return;
}

/*
let test_loc1 = msql.Location.init_partial("Canada", "British Columbia", "Burnaby");
let test_loc2 = new msql.Location(2, "Canada", "British Columbia", "British Columbia");
let test_loc3 = new msql.Location(1, "Canada", "Canada", "Canada");
let test_locs = [test_loc1];
msql.get_data(msql.connect(), test_locs, cb_test, {});
*/

let formatted_data = {};
formatted_data["test"] = new Array(3).fill([]);
formatted_data["test"][0].push(1);
formatted_data["test"][0].push(2);
console.log(formatted_data["test"][0]);