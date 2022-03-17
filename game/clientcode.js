
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
    socketio.emit("setup_filters", {"isEmpty": true});
}

function filter_games(){

    let socketdata = {"year_published": 1986, "console": ["NES", "SNES"], "isEmpty": false}

    socketio.emit("setup_filters", socketdata);
}


//Construct the DOM with the info from the server
socketio.on("setup_filters_callback", function (data) {

    console.log(data);

    globaldebug = data;


    //Manage Quantity Tracker
    if(data['found_games'] != undefined){
        document.getElementById("recordsfound").innerHTML = data['found_games'] + " records found";
    }
    else{
        document.getElementById("recordsfound").innerHTML = "";
    }

    if(data['found_challenges'] != undefined){
        document.getElementById("challengesfound").innerHTML = data['found_challenges'] + " challenges found";
    }
    else{
        document.getElementById("challengesfound").innerHTML = "";
    }

    

    //This handles Console callback
    document.getElementById("selectmultiple_console").innerHTML = '';
    data['console'].forEach( console => {
        let childlabel = document.createElement("option");
        childlabel.value = console
        childlabel.innerHTML = console
        document.getElementById("selectmultiple_console").appendChild(childlabel)

    })

    //This handles Game title callback
    document.getElementById("selectmultiple_game").innerHTML = '';
    data['game_title'].forEach( title => {
        let childlabel = document.createElement("option");
        childlabel.value = title
        childlabel.innerHTML = title
        document.getElementById("selectmultiple_game").appendChild(childlabel)

    })

    //This handles Year callback
    document.getElementById("selectmultiple_year").innerHTML = '';
    data['year'].forEach( year => {
        let childlabel = document.createElement("option");
        childlabel.value = year
        childlabel.innerHTML = year
        document.getElementById("selectmultiple_year").appendChild(childlabel)

    })

     //This handles Genre callback
     document.getElementById("selectmultiple_genre").innerHTML = '';
     data['genre'].forEach( year => {
         let childlabel = document.createElement("option");
         childlabel.value = year
         childlabel.innerHTML = year
         document.getElementById("selectmultiple_genre").appendChild(childlabel)
 
     })

    // data['gameconsole'].forEach(element => {
    //     console.log(element);
    // });
});



function ping() {
    socketio.emit("ping_server");
}

setup();

