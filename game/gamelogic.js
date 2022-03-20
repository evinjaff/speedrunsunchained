//This will run the main game logic


let game_global

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
                "playerid": `player${i}`
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

    game_global = new Game(4, global_num_players);

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

    //Pop and display the first matchup on the screeen









}

function add_matchup(matchup_index, game_object){
    let Playersdeepcopy = structuredClone(game_object.players);

    let matchups = [];

    while(Playersdeepcopy.length > 0){

        //Grab the first entry and remove it

        let pair_1 = Playersdeepcopy.splice(0,1);


        let removal_index  =  Math.floor(Playersdeepcopy.length * Math.random());

        let pair_2 = Playersdeepcopy.splice(removal_index, removal_index+1);

        matchups[matchups.length] = [ pair_1, pair_2 ];

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


