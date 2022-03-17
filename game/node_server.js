/** node_server.js
 * Backend of the server that will manager the game
 * 2022, By Evin Jaff
 * Partially reused from AxisGame written by Evin Jaff
 */

/* Global vars */

const http = require("http"),
    fs = require("fs"),
    url = require('url'),
    path = require('path'),
    mime = require('mime');


const {
    isGeneratorFunction
} = require("util/types");

const port = 3456;
const file = "client.html";
const master = "master.html";

/* Database Setup */

const sqlite3 = require('sqlite3').verbose();
const {
    open
} = require('sqlite');
const { count } = require("console");

let db = new sqlite3.Database('../community/db.sqlite3', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the Database.');
});

// let db = {};

// (async () => {
//     // open the database
//     let dbb = await open({
//       filename: '../testsite/db.sqlite3',
//       driver: sqlite3.Database
//     })

//     db = dbb;

//     console.log("DB Opened!");
// })()



// Listen for HTTP connections.  This is essentially a miniature static file server that only serves our one file, client.html, on port 3456:
const server = http.createServer(function (req, resp) {
    // This callback runs when a new connection is made to our HTTP server.

    // fs.readFile(file, function (err, data) {
    //     // This callback runs when the client.html file has been read from the filesystem.

    //     if (err) return res.writeHead(500);
    //     res.writeHead(200);
    //     res.end(data);
    // });

    var filename = path.join(__dirname, "", url.parse(req.url).pathname);
    (fs.exists || path.exists)(filename, function (exists) {
        if (exists) {
            fs.readFile(filename, function (err, data) {
                if (err) {
                    // File exists but is not readable (permissions issue?)
                    resp.writeHead(500, {
                        "Content-Type": "text/plain"
                    });
                    resp.write("Internal server error: could not read file");
                    resp.end();
                    return;
                }

                // File exists and is readable
                var mimetype = mime.getType(filename);
                resp.writeHead(200, {
                    "Content-Type": mimetype
                });
                resp.write(data);
                resp.end();
                return;
            });
        } else {
            // File does not exist
            resp.writeHead(404, {
                "Content-Type": "text/plain"
            });
            resp.write("Requested file not found: " + filename);
            resp.end();
            return;
        }
    });


});
server.listen(port);




/* Socket io backend */

// Import Socket.IO and pass our HTTP server object to it.
const socketio = require("socket.io")(http, {
    wsEngine: 'ws'
});





// Attach our Socket.IO server to our HTTP server to listen
const io = socketio.listen(server);
io.sockets.on("connection", function (socket) {


    // Basic ping callback
    socket.on('ping_server', function (data) {

        console.log(socket.id, "pinged server");
    });

    // This callback runs when the client needs to figure out how to construct metadata filters
    //TODO: Deprecate this, and make it dynamic. It's also not very optimized, but someone else will fix that
    //if this ever becomes big
    socket.on('setup_filters', function (data) {

        //Setup case


        //Using a Set where duplicates are likely (i.e consoles, release year, etc.)
        //Using an array where duplicates are unlikely
        let consoleset = new Set();
        let yearset = new Set();
        let genreset = new Set();
        let titlearr = [];

        console.log(data)


        if (data["isEmpty"] == true) {
            console.log("Init Empty")
            //BEHOLD THE MAGIC SQL QUERIES THAT DO IT

            //TODO: In the future, this query should dynamically return queries with inputted filters
            db.serialize(() => {

                query = `SELECT * FROM polls_game`

                db.each(query, (err, row) => {
                    if (err) {
                        console.error(err.message);
                    }

                    consoleset.add(row.console);
                    yearset.add(row.year_published);
                    genreset.add(row.genre);
                    titlearr[titlearr.length] = row.game_title;



                }, (err, row) => {

                    //Polish and send data back

                    let custom_sorted_console = Array.from(consoleset).sort(function (a, b) {
                        let wordToBeLast = 'N/A'; // set your word here

                        if (a === wordToBeLast) {
                            return -1;
                        } else if (b === wordToBeLast) {
                            return 1;
                        } else {
                            return a > b;
                        }
                    });

                    let custom_sorted_genre = Array.from(genreset).sort(function (a, b) {
                        let wordToBeLast = 'N/A';

                        //if it starts with a number
                        if (!isNaN(a[0])) {
                            return -1;
                        } else if (!isNaN(b[0])) {
                            return 1;
                        }

                        if (a === wordToBeLast) {
                            return -1;
                        } else if (b === wordToBeLast) {
                            return 1;
                        } else {
                            return a > b;
                        }
                    })

                    console.log(custom_sorted_genre)

                    socket.emit("setup_filters_callback", {
                        "game_title": titlearr.sort(),
                        "console": custom_sorted_console,
                        "year": Array.from(yearset).sort(),
                        "genre": custom_sorted_genre
                    })
                });
            });




        }

        //Special case. Do the special queries from game submission
        else

        {
            let counter = 0;

            db.serialize(() => {

                query = `SELECT * FROM polls_game WHERE `

                //TODO: add SQL injection protection

                //Expected:  SELECT * FROM polls_game WHERE genre='Adventure' AND year_published=1986 AND console='NES'
                //Actual:    SELECT * FROM polls_game WHERE genre=Adventure AND year=1986 AND console=NES 


                for (let key in data) {
                    if (data.hasOwnProperty(key)) {
                        if (key !== "isEmpty") {

                            //If multiple params
                            if (Array.isArray(data[key])) {
                                //console.log(data[key]);
                                data[key].forEach(perdatakey => {
                                    let inskey = perdatakey

                                    if(isNaN(perdatakey)){
                                        perdatakey = "'" + perdatakey + "'"
                                    }


                                    query += lookup_key(key) + "='" + inskey + "' OR ";
                                });

                                //query = query.slice(0, query.length -);
                            }
                            else{

                                //numeric vs string filtering

                                let inskey = data[key]

                                if(isNaN(inskey)){
                                    inskey = "'" + inskey + "'"
                                }

                                query += lookup_key(key)  + "=" + inskey + " AND ";
                            }

                        }
                    }
                }

                //slice out trailing AND
                query = query.slice(0, query.length - 4)

                console.log("Query: " + query);



                db.each(query, (err, row) => {
                    if (err) {
                        console.error(err.message);
                    }

                    consoleset.add(row.console);
                    yearset.add(row.year_published);
                    genreset.add(row.genre);
                    titlearr[titlearr.length] = row.game_title;

                    counter++;



                }, (err, row) => {

                    //Polish and send data back

                    let custom_sorted_console = Array.from(consoleset).sort(function (a, b) {
                        let wordToBeLast = 'N/A'; // set your word here

                        if (a === wordToBeLast) {
                            return -1;
                        } else if (b === wordToBeLast) {
                            return 1;
                        } else {
                            return a > b;
                        }
                    });

                    let custom_sorted_genre = Array.from(genreset).sort(function (a, b) {
                        let wordToBeLast = 'N/A';

                        //if it starts with a number
                        if (!isNaN(a[0])) {
                            return -1;
                        } else if (!isNaN(b[0])) {
                            return 1;
                        }

                        if (a === wordToBeLast) {
                            return -1;
                        } else if (b === wordToBeLast) {
                            return 1;
                        } else {
                            return a > b;
                        }
                    })

                    console.log(custom_sorted_genre)

                    socket.emit("setup_filters_callback", {
                        "game_title": titlearr.sort(),
                        "console": custom_sorted_console,
                        "year": Array.from(yearset).sort(),
                        "genre": custom_sorted_genre,
                        "found_games": counter,
                        "found_challenges": 0,
                    })
                });
            });

        }




    });




});

function lookup_key(key){

    switch(key){
        case 'year':
            return 'year_published';
        case 'title':
            return 'game_title';
        default:
            return key;
    }
}