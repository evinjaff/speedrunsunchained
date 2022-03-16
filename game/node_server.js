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
	

const { isGeneratorFunction } = require("util/types");

const port = 3456;
const file = "client.html";
const master = "master.html";

/* Database Setup */

const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

// let db = new sqlite3.Database('../testsite/db.sqlite3', (err) => {
//     if (err) {
//       console.error(err.message);
//     }
//     console.log('Connected to the Database.');
//   });

const ordersDb = createDbConnection('../testsite/db.sqlite3');

function createDbConnection(filename) {
    return open({
        filename,
        driver: sqlite3.Database
    });
}

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
	(fs.exists || path.exists)(filename, function(exists){
		if (exists) {
			fs.readFile(filename, function(err, data){
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
		}else{
			// File does not exist
			resp.writeHead(404, {
				"Content-Type": "text/plain"
			});
			resp.write("Requested file not found: "+filename);
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
        
        console.log( socket.id, "pinged server");
    });

    // This callback runs when the client needs to figure out how to construct metadata filters
    //TODO: Deprecate this, and make it dynamic. It's also not very optimized, but someone else will fix that
    //if this ever becomes big
    socket.on('setup_filters', function (data) {
        
        //BEHOLD THE MAGIC SQL QUERIES THAT DO IT
        
        const orderProcessed = orderAlreadyProcessed(ordersDb);
    });


    

});


async function orderAlreadyProcessed(ordersDb) {
    try {
        console.log('Starting orderAlreadyProcessed function');
        const query = 'SELECT game_title FROM polls_game'
        const row = await ordersDb.get(query);
        console.log('Row with count =', row);

        socket.emit("setup_filters_callback", {"data": row})
        
        
        return row;
    } catch (error) {
        console.error(error);
        throw error;
    }
}