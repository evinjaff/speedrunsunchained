//This will run the main game logic


class Game {

    constructor(rounds, nplayers){
        this.rounds = rounds;
        this.nplayers = nplayers;
        this.players = {};

        this.currentround = 0;

        for(let i=0;i< nplayers;i++){

            this.players[`player${i}`] = {
                "name": document.getElementById(`name_for_player_${i}`).value,
                "score": 0
            }
        }

    }



}




function gameloop(){

    log_to_screen("starting game...")

    //Construct a Game Object

    let game = new Game(4, global_num_players);

    //Make sure we know that it's right

    console.log(game)



}


//macros
//
function log_to_screen(thing){ document.getElementById("uiconsole").innerHTML = thing;}
