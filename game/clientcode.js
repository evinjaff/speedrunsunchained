
//Predefine globals and classes
var socketio = io.connect();

let globaldebug;

class Game {

    

    

}


class Filter {


    constructor(){

        //Read 


    }


    construct_query(games) {
        
    }

    

    

}


//Ask the server for metadata filters
function setup(){
    socketio.emit("setup_filters");
}


//Construct the DOM with the info from the server
socketio.on("setup_filters_callback", function (data) {

    globaldebug = data;

    data['gameconsole'].forEach(element => {
        console.log(element);
    });
});



function ping() {
    socketio.emit("ping_server");
}

setup();