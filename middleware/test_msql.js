var msql = require("./msql")

function cb_test(args) {
    let keys = Object.keys(args["results"])
    for(let i=0; i<keys.length; i++) {
        console.log("key:", keys[i])
        console.log("value:", args["results"][keys[i]])
        for(let j=0; j<args["results"][keys[i]].length; j++)
            console.log(args["results"][keys[i]][j])
    }
}

var test_loc = msql.Location.init_partial("Canada", "British Columbia", "Burnaby")
msql.get_data(msql.connect(), test_loc, ["schools", "crimes", "census"], cb_test, {})

//msql.test_connect()