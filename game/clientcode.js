
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

//This function takes the data from the form and generates queries to update the game filter.
function filter_games(){

    let socketdata = {"isEmpty": true}

    let year = document.getElementById("selectmultiple_year")

    let year_selects = getSelectValues(year);

    //TODO: Make this reusable

    //Don't pass a field in
    if(year_selects.length == 0 || year_selects.length == undefined){
        // Do nothing
    }
    else if (year_selects.length == 1){
        //pass in a single value
        socketdata.year_published = year_selects[0];
        socketdata.isEmpty = false;

    }
    else{
        //pass in multiple values
        socketdata.year_published = [];
        year_selects.forEach(select => {
            socketdata.year_published.push(select);
            socketdata.isEmpty = false;
        })
    }

    console.log(socketdata)
    //socketdata = {"year_published": 1986, "console": ["NES", "SNES"], "isEmpty": false}

    socketio.emit("setup_filters", socketdata);
}

//utility function to retun array from select values
function getSelectValues(select) {
    var result = [];
    var options = select && select.options;
    var opt;
  
    for (var i=0, iLen=options.length; i<iLen; i++) {
      opt = options[i];
  
      if (opt.selected) {
        result.push(opt.value || opt.text);
      }
    }
    return result;
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

