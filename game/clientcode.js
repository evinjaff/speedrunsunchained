//Predefine globals and classes
var socketio = io.connect();

let globaldebug;

//TODO: Stash the last queried blob to prevent slamming the server


class Game {





}


class Filter {


    constructor() {

        //Read 


    }


    construct_query(games) {

    }





}


//Ask the server for metadata filters
function setup() {
    socketio.emit("setup_filters", {
        "isEmpty": true
    });
}

//This function takes the data from the form and generates queries to update the game filter.
function filter_games() {

    let socketdata = {
        "isEmpty": true
    }

    socketdata = reusable_query_getter("genre", "selectmultiple_genre", socketdata);
    socketdata = reusable_query_getter("year", "selectmultiple_year", socketdata);
    socketdata = reusable_query_getter("console", "selectmultiple_console", socketdata);

    console.log(socketdata)
    //socketdata = {"year_published": 1986, "console": ["NES", "SNES"], "isEmpty": false}

    socketio.emit("setup_filters", socketdata);
}

function reusable_query_getter(attribute_JSON_field, attribute_HTML_id, passthrough_socketdata) {

    let year = document.getElementById(attribute_HTML_id)

    let attibute_selects = getSelectValues(year);

    //Don't pass a field in
    if (attibute_selects.length == 0 || attibute_selects.length == undefined) {
        // Do nothing
    } else if (attibute_selects.length == 1) {
        //pass in a single value
        passthrough_socketdata[attribute_JSON_field] = attibute_selects[0];
        passthrough_socketdata.isEmpty = false;

    } else {
        //pass in multiple values
        passthrough_socketdata[attribute_JSON_field] = [];
        attibute_selects.forEach(select => {
            passthrough_socketdata[attribute_JSON_field].push(select);
            passthrough_socketdata.isEmpty = false;
        })
    }

    return passthrough_socketdata;
}


//utility function to retun array from select values
function getSelectValues(select) {
    var result = [];
    var options = select && select.options;
    var opt;

    for (var i = 0, iLen = options.length; i < iLen; i++) {
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
    if (data['found_games'] != undefined) {
        document.getElementById("recordsfound").innerHTML = data['found_games'] + " records found";
    } else {
        document.getElementById("recordsfound").innerHTML = "";
    }

    if (data['found_challenges'] != undefined) {
        document.getElementById("challengesfound").innerHTML = data['found_challenges'] + " challenges found";
    } else {
        document.getElementById("challengesfound").innerHTML = "";
    }



    //This handles Console callback
    document.getElementById("selectmultiple_console").innerHTML = '';
    data['console'].forEach(console => {
        let childlabel = document.createElement("option");
        childlabel.value = console
        childlabel.innerHTML = console
        document.getElementById("selectmultiple_console").appendChild(childlabel)

    })

    //This handles Game title callback
    document.getElementById("selectmultiple_game").innerHTML = '';
    data['game_title'].forEach(title => {
        let childlabel = document.createElement("option");
        childlabel.value = title
        childlabel.innerHTML = title
        document.getElementById("selectmultiple_game").appendChild(childlabel)

    })

    //This handles Year callback
    document.getElementById("selectmultiple_year").innerHTML = '';
    data['year'].forEach(year => {
        let childlabel = document.createElement("option");
        childlabel.value = year
        childlabel.innerHTML = year
        document.getElementById("selectmultiple_year").appendChild(childlabel)

    })

    //This handles Genre callback
    document.getElementById("selectmultiple_genre").innerHTML = '';
    data['genre'].forEach(year => {
        let childlabel = document.createElement("option");
        childlabel.value = year
        childlabel.innerHTML = year
        document.getElementById("selectmultiple_genre").appendChild(childlabel)

    })

    // data['gameconsole'].forEach(element => {
    //     console.log(element);
    // });
});

socketio.on("setup_challenge_callback", function (data) {
    console.log(data);
    //This handles duration callback
    document.getElementById("selectmultiple_challenge_duration").innerHTML = '';
    data['duration'].forEach(year => {
        let childlabel = document.createElement("option");
        childlabel.value = year
        childlabel.innerHTML = year
        document.getElementById("selectmultiple_challenge_duration").appendChild(childlabel);

    })

});



function ping() {
    socketio.emit("ping_server");
}

setup();