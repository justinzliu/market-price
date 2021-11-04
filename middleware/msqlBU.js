var mysql = require('mysql2');

var pool = mysql.createPool({
  host: "localhost",
  user: "test",
  password: "Test123!",
  database: "myNeighbourhood",
  connectionLimit: 10,
  supportBigNumbers: true
});

class Location {
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
}

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
            pool.end()
        });
    });
}

function select(location, tables, callback) {
    console.log(location, tables, callback)
    pool.getConnection(function(err, connection) {
        if(err) {
            console.log(err);
            return;
        }
        //get loc_id for given location
        let cmd = "SELECT * FROM `locations` WHERE country = ? AND province = ? AND city = ?";
        connection.query(cmd, [location.country, location.province, location.city], function(err, results) {
            connection.release();
            if(err) {
                console.log(err);
                return;
            }
            //get records for given loc_id
            let cmd = "SELECT * FROM ?? WHERE loc_id = ?";
            for(let i=0; i<tables.length; i++) {
                connection.query(cmd, [tables[i], results[0].loc_id], function(err, results) {
                    if(err) {
                        console.log(err)
                        return;
                    }
                    callback(results);
                    connection.release();
                });
            }
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

function shutdown() {
    pool.end();
    if (err) {
        console.error("ERROR shutdown(): pool shutdown failed.")
    }
}

//retrieve relevent data given location and table (data source)
/*
exports.getData = function(location, callback) {
    let cmd = "SELECT * FROM `?` WHERE ``"
}
*/

export {Location, select};