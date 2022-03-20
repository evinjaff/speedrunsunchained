//Predefine globals and classes
var socketio = io.connect();

let globaldebug;

let global_challenges = [];

let global_num_players = 1;

//TODO: Stash the last queried blob to prevent slamming the server


//Ask the server for metadata filters
function setup() {
    socketio.emit("setup_filters", {
        "isEmpty": true
    });
}

//This function takes the data from the form and generates queries to update the game filter.
function filter_games(type) {


    //If there's already queries being returned, let's keep going

    let socketdata = {
        "isEmpty": true
    }

    socketdata = reusable_query_getter("genre", "selectmultiple_genre", socketdata);
    socketdata = reusable_query_getter("year", "selectmultiple_year", socketdata);
    socketdata = reusable_query_getter("console", "selectmultiple_console", socketdata);
    socketdata = reusable_query_getter("game", "selectmultiple_game", socketdata);
    socketdata = reusable_query_getter("challenge_duration", "selectmultiple_challenge_duration", socketdata);

    console.log(socketdata)

    if(type === "handoff_to_game"){
        socketdata["handoff"] = true;
        socketio.emit("setup_filters", socketdata);
    }
    else if (type === 'game_filter'){
        socketdata["handoff"] = false;
        socketio.emit("setup_filters", socketdata);
    }


}

//This function takes the data from the form and generates queries to update the game filter.
// function get_game_data() {


//     //If there's already queries being returned, let's keep going

//     let socketdata = {
//         "isEmpty": true
//     }

//     socketdata = reusable_query_getter("genre", "selectmultiple_genre", socketdata);
//     socketdata = reusable_query_getter("year", "selectmultiple_year", socketdata);
//     socketdata = reusable_query_getter("console", "selectmultiple_console", socketdata);
//     socketdata = reusable_query_getter("game", "selectmultiple_game", socketdata);
//     socketdata = reusable_query_getter("challenge_duration", "selectmultiple_challenge_duration", socketdata);

//     console.log(socketdata)

//     //Once this happens, we don't need websockets anymore -- yay!!
//     socketio.emit("get_game_filter", socketdata);
// }


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
        document.getElementById("recordsfound").innerHTML = data['found_games'] + " games found";
    } else {
        document.getElementById("recordsfound").innerHTML = "";
    }

    if (data['found_challenges'] != undefined) {
        document.getElementById("challengesfound").innerHTML = data['found_challenges'] + " challenges found";
    } else {
        document.getElementById("challengesfound").innerHTML = "";
    }

    //This handles Console callback
    form_refresh("selectmultiple_console", 'console', data);

    //This handles Game title callback
    form_refresh("selectmultiple_game", 'game_title', data);

    //This handles Year callback
    form_refresh("selectmultiple_year", 'year', data);
 
    //This handles Genre callback
    form_refresh("selectmultiple_genre", 'genre', data);

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

socketio.on("game_handoff_callback", function(data){
    //alert("yay we can start the game");

    //Invoke the game loop

    global_challenges = data["challenges"];

    console.log(global_challenges);

    //Make the form invisible
    document.getElementById("form_part").style = "display: none;";
    //Make it visible
    document.getElementById("gamepart").style = "";


    //Is this throttling performance?
    //fisher_yates_shuffle(global_challenges);
    
})






function ping() {
    socketio.emit("ping_server");
}

function form_refresh(html_element_id, socket_data_field, socket_data_passthrough){
    //This handles Genre callback
    document.getElementById(html_element_id).innerHTML = '';
    socket_data_passthrough[socket_data_field].forEach(year => {
        let childlabel = document.createElement("option");
        childlabel.value = year
        childlabel.innerHTML = year
         
        document.getElementById(html_element_id).appendChild(childlabel)

    })
}

function add_player_inputs(){

    let num_players = document.getElementById("players").value

    global_num_players = num_players;

    console.log("Calling add player limit")

    //Prevent tampering

    if(num_players > 1 && num_players < 7){

        document.getElementById("nameplayers").innerHTML = "";

        //Let's add more text inputs
        for(let i=0;i< num_players;i++){

            console.log(i)
            //Append player elements
            let input = document.createElement("div");

            input.innerHTML = `<div class="form-group">
            <label class="col-md-4 control-label" for="name_for_player_${i}">Player ${i}'s Name:</label>
            <div class="col-md-4">
                <input id="name_for_player_${i}" name="textinput" value="Player ${i}" type="text" placeholder="placeholder"
                    class="form-control input-md">
                <span class="help-block">help</span>
            </div>
        </div>`

        document.getElementById("nameplayers").appendChild(input);

        }
    }

}


setup();