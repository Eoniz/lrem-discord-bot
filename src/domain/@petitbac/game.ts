import Discord from "discord.js";

export const DEFAULT_CATEGORIES = [
    "Nourriture",
    "Ville",
    "Pays",
    "Personnage"
];

class PetitBac {
    private readonly _message: Discord.Message;
    private readonly _players: Array<Discord.User>;
    private readonly _categories: Array<string>;

    constructor (
        message: Discord.Message, 
        players: Record<string, Discord.User>,
        categories: Array<string>    
    ) {
        this._message = message;
        this._players = Object.values(players);
        this._categories = categories;
        
        this.startGame();
    }

    startGame () {
        for (const player of this._players) {
            player.send("Hello World !");
        }
    }
}

export default PetitBac;
