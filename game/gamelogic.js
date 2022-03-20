//This will run the main game logic


let game_global;

let player0;
let player1;

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




function gamestartup(){

    log_to_screen("starting game...")

    //Construct a Game Object

    //TODO: Validation for junk data

    game_global = new Game(3, global_num_players);

    console.log(game_global)

    //Let's build a challenge map of all the matchups

    //How to do this -- we use the secret santa problem code from the axis game

    //let player_array_1 = structuredClone(game.players);

    //let player_array_2 = structuredClone(game.players);

    //Let's use the Numberphile Secret Santa Problem
    //https://www.youtube.com/watch?v=GhnCj7Fvqt0

    //screw this, let's just make our matchups one pick

    for(let i=0;i<game_global.matchups.length;i++){
        game_global.matchups[i] = add_matchup(i, game_global);
    }

    console.log(game_global)

    //Ok now we can get the show on the road. Let's increment the round counter by 1 
    //game_global.currentround++;

    //Now this will be handled by the setup_next_round call
    setup_next_round();


}

//Reusable function to increment the game as it goes on
function setup_next_round(){

    //Before we start the steps we need to make sure we're at the right milestones

    //Are we at the end of the round?
    if(game_global.matchups[game_global.currentround].length === 0){
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
    if( (game_global.rounds-game_global.currentround) ){

        challenge_to_play = global_challenges.pop();

    }
    else{
        //Otherwise, let's fallback - not yet

        challenge_to_play = global_challenges.pop();


    }

    //Appearnce stuff - will be prettified eventually
    log_to_screen(`Round ${game_global.currentround+1} is ${player0.name} vs ${player1.name}
    
    Your challenge is to ${challenge_to_play.challenge_title}
    `)

    document.getElementById("Firstonewon").innerHTML  = player0.name + " wins!";
    document.getElementById("Secondonewon").innerHTML = player1.name + " wins!";

}

//id being which player won, 0 or 1
function winner(id){


    //TODO: Do the minimal logic thing eventually
    //This will increment the respective scores
    if(id === 0){
        game_global.players[player0.index].score++;
    }
    else{
        game_global.players[player1.index].score++;
    }

    console.log(game_global.players);

    //call for a new setup to begin

    setup_next_round();
    

}


function add_matchup(matchup_index, game_object){
    let Playersdeepcopy = structuredClone(game_object.players);

    

    let matchups = [];


    //Alternative implementation
    while(Playersdeepcopy.length !== 0){

        console.log(Playersdeepcopy)

        //Grab the first entry and remove it

        // let pair_1 = Playersdeepcopy.splice(0,1)[0];


        // let removal_index  =  Math.floor(Playersdeepcopy.length * Math.random());

        // console.log(removal_index)

        // let pair_2 = Playersdeepcopy.splice(removal_index, removal_index+1)[0];

        // console.log("pair 1: ", pair_1, " pair 2: ", pair_2);

        fisher_yates_shuffle(Playersdeepcopy);



        matchups[matchups.length] = [ Playersdeepcopy.pop(), Playersdeepcopy.pop() ];

        console.log(matchups);

    }

    return matchups;
}



//macros
//
function log_to_screen(thing){ document.getElementById("uiconsole").innerHTML = thing;}

//Random number in a range
function getRandomArbitrary(min, max) { return Math.random() * (max - min) + min;}

 /**Array shift function that protects overshifted entries by adding them to the begining
       * @param {Object[]} array The array to be shifted 
       * @param {int} n The amount of entries to shift it by
      */
function shiftarrsafe(array, n){
//edge case - n is bigger than the size
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


