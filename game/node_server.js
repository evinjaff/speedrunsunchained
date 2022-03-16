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

let db = new sqlite3.Database('../testsite/db.sqlite3', (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the Database.');
  });

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


    // Client Callbacks
    /* 
        message_to_server: Hello World Test
        sendcoord: Send the results of a compass click
    */
    socket.on('ping_server', function (data) {
        // Basic ping callback
        console.log( socket.id, "pinged server");
    });

    socket.on('message_to_server', function (data) {
        // This callback runs when the server receives a new message from the client.

        console.log("message: " + data["message"]); // log it to the Node.JS output
        io.sockets.emit("message_to_client", { message: data["message"] }) // broadcast the message to other users
    });


    

});

