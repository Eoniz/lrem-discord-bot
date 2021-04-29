import Discord from "discord.js";
import PetitBac from "./game";
import { uuid } from 'uuidv4';

const registeredGames: Discord.Collection<string, PetitBac> = new Discord.Collection();
const registeredPlayers: Discord.Collection<string, string> = new Discord.Collection();

const generateUniqueId = () => {
    return uuid();
}

export const initiateGame = (
    message: Discord.Message, 
    players: Record<string, Discord.User>,
    categories: Array<string>
) => {
    const game = new PetitBac(message, players, categories);
    const id = generateUniqueId();

    registeredGames.set(id, game);

    for (let player of Object.keys(players)) {
        if (registeredGames.has(player)) {
            continue;
        }

        registeredPlayers.set(player, id);
    }
};

export const handlePetitBacDM = async (message: Discord.Message) => {
    const id = registeredPlayers.get(message.author.id);

    if (id === undefined) {
        message.reply("Tu n'es actuellement dans aucune partie de petitbac.");
        return;
    }

    const game = registeredGames.get(id);
    if (game === undefined) {
        registeredPlayers.delete(message.author.id);

        message.reply("Tu n'es actuellement dans aucune partie de petitbac.");
        return;
    }

    game.handleMessage(message);
};
