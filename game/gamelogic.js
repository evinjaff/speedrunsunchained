//This will run the main game logic


let game_global;

let player0;
let player1;

let flag_not_enough_challenges;

class Game {

    constructor(rounds, nplayers){
        this.rounds = rounds;
        this.nplayers = nplayers;
        this.players = [];
        this.matchups = [];

        this.currentround = 0;

        for(let i=0;i< nplayers;i++){

            console.log(`name_for_player_${i}`);

            this.players[i] = {
                "name": document.getElementById(`name_for_player_${i}`).value,
                "score": 0,
                "playerid": `player${i}`,
                "index": i
            }
        }

        for(let i=0;i< rounds;i++){
            //These will be determined later
            this.matchups[i] = [];
        }

    }



}

//@ts-check
/**
 * 
 * @param {int} player_index - index of the relevant player
 * @param {int} new_score - new score of the player
 */
function update_score(player_index, new_score){
    //TODO: implement this

    game_global.players[player_index].score = new_score;

    //update HTML elements

    document.getElementById(game_global.players[player_index].name + "_score").innerHTML = new_score;

    //TODO: When a player is in the lead, hilight them


    //TODO, figure out which DOM element this correlates to

    console.log(game_global);

}



//@ts-check
function gamestartup(){

    log_to_screen("starting game...")

    //Construct a Game Object

    //TODO: Validation for junk data

    game_global = new Game(3, global_num_players);

    console.log(game_global)

    //Let's construct a score table with this

    document.getElementById("score_table");

    //Wipe off residual ones

    removeAllChildNodes("player_scores")

    game_global.players.forEach(player => {

        console.log(player);
        //construct table heading
        table_entry = document.createElement("th");

        table_entry.innerHTML = player.name;

        table_entry.id = player.name;

        table_entry.scope="col";

        document.getElementById("player_headings").appendChild(table_entry);

        score_entry = document.createElement("th");

        score_entry.innerHTML = 0;

        score_entry.scope="row";

        //let's also make sure that we can recall who's element goes where

        score_entry.id = player.name + "_score";

        document.getElementById("player_scores").appendChild(score_entry);

        //table_score = document.createElement("th");

        //table_score.innerHTML = "0";

        //To update the score, we'll have to build in a function to do this.

        //table_score.scope="col";


    });

    for(let i=0;i<game_global.matchups.length;i++){
        game_global.matchups[i] = add_matchup(i, game_global);
    }

    console.log(game_global)
    
    //check if no challenges are specified
    if(global_challenges == undefined){
        alert("error in retreiving challenges, try to restart your browser")
    }else if(global_challenges.length == 0){
        alert("ERROR: You have 0 challenges. You either have an impossible filter combination or you haven't picked challenges yet")

        //Force a refresh?
    }
    else if(
        game_global.rounds*(Math.floor(game_global.nplayers/2)) >= global_challenges.length){

            flag_not_enough_challenges = true;

        alert(`Warning, you don't have enough challenges to play a full game at least ${game_global.rounds*(Math.floor(game_global.nplayers/2))} are reccomended. \n 
        
        You have ${global_challenges.length} challenges with your filters.
        
        If you proceed, challenges will reappear. `)
    }
    else{

    }

   

    //Ok now we can get the show on the road. Let's increment the round counter by 1

    //Now this will be handled by the setup_next_round call
    setup_next_round();


}


/**
 * 
 * @param {string} parent_html_id - html id of the parent element 
 */
function removeAllChildNodes(parent_html_id) {

    let parent = document.getElementById(parent_html_id)
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}



//Reusable function to increment the game as it goes on
//@ts-check
function setup_next_round(){

    //Before we start the steps we need to make sure we're at the right milestones

    //Are we at the end of the round?
    if(game_global.matchups[game_global.currentround].length === 0 || game_global.matchups[game_global.currentround].length === undefined){
        //if so, let's increment the round
        game_global.currentround++;
    }

    //Are we at the end of the game?
    if(game_global.currentround >= game_global.rounds){
        //If so start up the end sequence - just an alert for now
        alert("game is done son");
        return;
    }

    //Now with those edge cases out of the way, let's get to playing
    //Let's grab our challenge

    let matchup = game_global.matchups[game_global.currentround].pop();

    //set the player variables to each other

    player0 = matchup[0]
    player1 = matchup[1]

    //and display the first matchup as well as the win buttons


    //TODO deal with aesthetics and grab the challenge to play

    //Ok here's how we get our challenges

    

    let challenge_to_play;

    //First, let's verify that we have enough challenges for each
    if( !flag_not_enough_challenges ){

        challenge_to_play = global_challenges.pop();

    }
    else{
        //Otherwise, let's fallback and get a random element

        challenge_to_play = global_challenges[ Math.floor(global_challenges.length * Math.random())  ];


    }

    console.log(challenge_to_play);

    //Appearnce stuff - will be prettified eventually
    log_to_screen(`Round ${game_global.currentround+1} is ${player0.name} vs ${player1.name}
    
    Your challenge is to ${challenge_to_play.challenge_title} in ${challenge_to_play.game_associated.title} (${challenge_to_play.game_associated.year}) for ${challenge_to_play.game_associated.console}
    `)

    document.getElementById("Firstonewon").innerHTML  = player0.name + " wins!";
    document.getElementById("Secondonewon").innerHTML = player1.name + " wins!";

}

//id being which player won, 0 or 1
//@ts-check
function winner(id){


    //TODO: Do the minimal logic thing eventually
    //This will increment the respective scores
    if(id === 0){


        //game_global.players[player0.index].score++;

        update_score( player0.index, game_global.players[player0.index].score + 1);
    }
    else{
        update_score( player1.index, game_global.players[player1.index].score + 1);
        //game_global.players[player1.index].score++;
    }

    console.log(game_global.players);

    //call for a new setup to begin

    setup_next_round();
    

}

//This works for a deep copy of arrays with a forEach method
//@ts-check
function structuredClone_emulated_foreach_array(structure_to_clone){

    let deep_copied_array = []

    structure_to_clone.forEach(element => {
        deep_copied_array.push(element);
    });

    return deep_copied_array;

}

//@ts-check
function add_matchup(matchup_index, game_object){
    let Playersdeepcopy = [];
    

    //This will rollback to an emulated structured clone if it's unable to work.
    try{
        Playersdeepcopy = structuredClone(game_object.players);
    }
    catch{
        Playersdeepcopy = structuredClone_emulated_foreach_array(game_object.players);
    }

    

    let matchups = [];


    //Alternative implementation
    while(Playersdeepcopy.length !== 0){

        console.log(Playersdeepcopy)

        //Grab the first entry and remove it

        fisher_yates_shuffle(Playersdeepcopy);

        matchups[matchups.length] = [ Playersdeepcopy.pop(), Playersdeepcopy.pop() ];

        console.log(matchups);

    }

    return matchups;
}



//macros

//@ts-check
function log_to_screen(thing){ document.getElementById("uiconsole").innerHTML = thing;}

//Random number in a range
//@ts-check
function getRandomArbitrary(min, max) { return Math.random() * (max - min) + min;}

/**Array shift function that protects overshifted entries by adding them to the begining
       * @param {Object[]} array The array to be shifted 
       * @param {int} n The amount of entries to shift it by
*/
//@ts-check
function shiftarrsafe(array, n){
switch(n){
    case 0:
        //it's the same
        return array;
        break;
    case array.length:
        //can't shift it this much
        throw "Error: the array length is bigger than the shift";
        break;
    default:
        //if we shift it by one, that means the array will start at 1 and so on
        let slicedend = array.slice(n, array.length);
        let appendeded = array.slice(0, n);

        //concat the ends such that we have this
        return slicedend.concat(appendeded);
    

}

}

//@ts-check
function fisher_yates_shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }


