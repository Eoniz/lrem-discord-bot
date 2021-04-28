import Discord from "discord.js";
import PetitBac from "./game";

const registeredGames: Discord.Collection<string, PetitBac> = new Discord.Collection();

export const initiateGame = (
    message: Discord.Message, 
    players: Record<string, Discord.User>,
    categories: Array<string>
) => {
    const game = new PetitBac(message, players, categories);

    for (let player of Object.keys(players)) {
        if (registeredGames.has(player)) {
            continue;
        }

        registeredGames[player] = game;
    }

    console.log(registeredGames);
};