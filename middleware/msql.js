var mysql = require('mysql2');

module.exports = {
    Location: class Location {
        constructor(loc_id, country, province, city) {
            this.loc_id = loc_id
            this.country = country
            this.province = province
            this.city = city
        }

        static init_partial(country, province, city) {
            return new Location(null, country, province, city)
        }

        add_id(loc_id) {
            this.loc_id = loc_id 
        }
    },

    connect: function() {
        connection = mysql.createConnection({
            host: "localhost",
            user: "test",
            password: "Test123!",
            database: "myNeighbourhood"
        });
        return connection
    },

    get_data: function(connection, location, tables, callback, callback_args){
        //get loc_id for given location ( Location(country, province, city) )
        let cmd = "SELECT * FROM `locations` WHERE country = ? AND province = ? AND city = ?";
        connection.query(cmd, [location.country, location.province, location.city], function(err, result) {
            if(err) {
                console.log("get_data: ", err);
                return;
            }
            //get records for given loc_id
            if (tables) {
                location.add_id(result[0].loc_id);
                select(connection, location, tables, callback, callback_args, {});
            }
        });
    },

    //DEBUG: REMOVE WHEN PRODUCTION READY
    test_connect: function(){
        var connection = mysql.createConnection({
            host: "localhost",
            user: "test",
            password: "Test123!",
            database: "myNeighbourhood"
        });
        connection.connect()
        /*
        let cmd = "SELECT * FROM `locations` WHERE country = ? AND province = ? AND city = ?";
        connection.query(cmd, [location.country, location.province, location.city], function(err, results) {
            if(err) {
                console.log("get_data: ", err);
                return;
            }
            return;
            //get records for given loc_id
        });
        */
        connection.end(function(err){
            if (err) {
                return console.log('error:' + err.message);
            }
            console.log('Close the database connection.');
        });
    }
}

function select(connection, location, tables, callback, callback_args, results) {
    //get records for given loc_id
    if(tables.length) {
        let cmd = "SELECT * FROM ?? WHERE loc_id = ?";
        connection.query(cmd, [tables[0], location.loc_id], function(err, result) {
            if(err) {
                console.log("select: ", err);
                return;
            }
            results[tables[0]] = result;
            tables.shift();
            select(connection, location, tables, callback, callback_args, results);
        });
    }
    else {
        callback_args["results"] = results;
        callback(callback_args);
        connection.end();
    }
}

/////////////////
///DEPRECIATED///
/////////////////

//retrieve location id given location
function get_locid(location, callback) {
    let cmd = "SELECT loc_id FROM `locations` WHERE country = ? AND province = ? AND city = ?";
    pool.getConnection(function(err, connection) {
        if(err) {
            console.log(err);
            //callback(true);
            return;
        }
        connection.query(cmd, [location.country, location.province, location.city], function(err, results) {
            connection.release();
            if(err) {
                console.log(err);
                //callback(true);
                return;
            }
            callback(results);
        });
    });
}

function test(resolve) {
    let test_loc = Location.init_partial("Canada", "British Columbia", "Burnaby")
    let test_tables = ["schools", "crimes", "census"]
    let test_cb = cb_test
    try {
        console.log(test_loc, test_tables, test_cb)
        resolve(test_loc, test_tables, test_cb);
    }
    finally {
        return;
    }
}

/*
select: function (args) {
    //console.log(args["location"], args["tables"], args["callback"], args["connection"])
    //get loc_id for given location
    connection = mysql.createConnection({
        host: "localhost",
        user: "test",
        password: "Test123!",
        database: "myNeighbourhood",
    })
    let cmd = "SELECT * FROM `locations` WHERE country = ? AND province = ? AND city = ?";
    args["connection"].query(cmd, [args["location"].country, args["location"].province, args["location"].city], function(err, results) {
        if(err) {
            console.log(err);node
            return;
        }
        //get records for given loc_id
        let cmd = "SELECT * FROM ?? WHERE loc_id = ?";
        for(let i=0; i<args["tables"].length; i++) {
            args["connection"].query(cmd, [args["tables"][i], results[0].loc_id], function(err, results) {
                if(err) {
                    console.log(err)
                    return;
                }
                args["callback"](results);
            });
        }
    });
    return args;
}
*/

/*
function select(args) {
    //get records for given loc_id
    if(args["tables"].length) {
        let cmd = "SELECT * FROM ?? WHERE loc_id = ?";
        args["connection"].query(cmd, [args["tables"][0], args["location"].loc_id], function(err, results) {
            if(err) {
                console.log("select: ", err);
                return;
            }
            args["results"][args["tables"][0]] = results;
            args["tables"].shift();
            select(args);
        });
    }
    else {
        //console.log(args["results"])
        args["callback"].render(args["callback_option"],args["results"]);
        //args["callback"](args["results"],{})
        args["connection"].end();
    }
}
*/