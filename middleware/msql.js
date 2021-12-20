var mysql = require('mysql2');

///////////////
/// GLOBALS ///
///////////////

var GLOBALS = {
    "TABLES": ["schools", "crimes", "census"],
    "TABLES_COUNTRY_EXCLUDE": ["schools"]
};

/////////////////
/// FUNCTIONS ///
/////////////////

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

        has_id() {
            return (this.loc_id != null);
        }

        loc_type() {
            let ltype = "city";
            if(this.country == this.city) {
                ltype = "country";
            }
            else if(this.province == this.city) {
                ltype = "province";
            }
            return ltype;
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

    //locations will first be called as a list with a single location (specific city), relevent locations will be added on in the initial get_data call.
    get_data: function(connection, locations, callback, callback_args){
        //initial get_data call. Locations only contains city and will need relevent county and province appended to list
        if (locations.length == 1) {
            let country = module.exports.Location.init_partial(locations[0].country, locations[0].country, locations[0].country);
            let province = module.exports.Location.init_partial(locations[0].country, locations[0].province, locations[0].province);
            locations.push(country, province);
        }
        //loc_index = locations.findIndex((element) => {return !element.has_id();}); //not supported by all browsers
        let loc_index;
        locations.some((location, index) => {loc_index = index; return !location.has_id()});
        //a location missing id, get loc_id for location
        if(!locations[loc_index].has_id()) {
            let cmd = "SELECT * FROM `locations` WHERE country = ? AND province = ? AND city = ?";
            connection.query(cmd, [locations[loc_index].country, locations[loc_index].province, locations[loc_index].city], function(err, result) {
                if(err) {
                    console.log("get_data: ", err);
                    return;
                }
                locations[loc_index].add_id(result[0].loc_id);
                //get next loc_id for location in locations
                module.exports.get_data(connection, locations, callback, callback_args);
            });
        }
        //all locations have ids
        else {
            //get records for locations with loc_id
            callback_args["results"] = {"city": {}, "province": {}, "country": {}};
            select_data(connection, locations, JSON.parse(JSON.stringify(GLOBALS["TABLES"])), callback, callback_args);
        }
    },
    /*
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
    */

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

function select_data(connection, locations, tables, callback, callback_args) {
    //get records from tables for locations[0]
    if(tables.length) {
        let cmd = "SELECT * FROM ?? WHERE loc_id = ?";
        connection.query(cmd, [tables[0], locations[0].loc_id], function(err, result) {
            if(err) {
                console.log("select_data: ", err);
                return;
            }
            let table_type = tables[0];
            let location_type = locations[0].loc_type();
            callback_args["results"][location_type][table_type] = result;
            tables.shift();
            select_data(connection, locations, tables, callback, callback_args);
        });
    }
    //recurse for each location in locations
    else if (locations.length > 1) {
        locations.shift();
        tables = JSON.parse(JSON.stringify(GLOBALS["TABLES"])); //deepcopy GLOBALS["TABLES"]
        if (locations[0].loc_type != "city") {
            //location[0] is city
            tables = GLOBALS["TABLES"].filter((table) => {return (GLOBALS["TABLES_COUNTRY_EXCLUDE"].indexOf(table) == -1);});
        }
        select_data(connection, locations, tables, callback, callback_args);
    }
    //perform callback and end connection
    else {
        callback(callback_args);
        connection.end();
    }
}

/*
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
*/

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