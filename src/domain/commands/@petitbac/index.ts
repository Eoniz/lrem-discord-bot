import { ICommand } from "../../../infrastructure/types/commands/commands.types";
import Discord from "discord.js";
import { DEFAULT_CATEGORIES } from "../../@petitbac/game";
import { initiateGame } from '../../@petitbac';

const filter = (reaction) => ["✋", "🏁"].includes(reaction.emoji.name);


const petitbac: ICommand = {
    name: "petitbac",
    description: "Starts a game of Petit Bac",
    execute: async (message, args, kwargs) => {
        const categories = "categories" in kwargs
            ? kwargs["categories"].split(',').map(v => v.trim())
            : DEFAULT_CATEGORIES;

        const embed = new Discord.MessageEmbed({
            "title": "Petit bac",
            "description": `Le petit bac va commencer avec les thèmes suivant:\n${categories.map(cat => `- ${cat}`).join('\n')}\nPour rejoindre la partie, cliquez sur ✋, pour démarrer la partie, cliquez sur 🏁 (seul l'auteur peut démarrer la partie plus tôt). La partie se lancera automatiquement dans 30 secondes.`,
            "color": 16497180
        });

        const embedMessage = await message.channel.send(embed);
        embedMessage.react("✋");
        embedMessage.react("🏁");

        const reactionCollector = embedMessage.createReactionCollector(
            filter, 
            { time: 30000 }
        );

        const onCollect = (collected: Discord.MessageReaction, user: Discord.User) => {
            if (collected['_emoji'].name === "🏁" && user.id === message.author.id) {
                reactionCollector.stop();
            }
        };
        
        const onEnd = (collected: Discord.Collection<string, Discord.MessageReaction>) => {
            console.log("onEnd");
            const players: Record<string, Discord.User> = {};
            collected.get("✋").users.cache.forEach((user) => {
                if (user.bot) {
                    return;
                }

                players[user.id] = user;
            });

            console.log(players);

            embedMessage.reply(`La partie va commencer avec: ${Object.values(players).map(p => `<@${p.id}>`).join(', ')}.`);
            initiateGame(message, players, categories);

            reactionCollector.off("collect", onCollect);
            reactionCollector.off("end", onEnd);
        };

        reactionCollector.on("collect", onCollect);
        reactionCollector.on("end", onEnd);
    }
}

export default petitbac;
