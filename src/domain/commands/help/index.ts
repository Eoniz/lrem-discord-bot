import Discord from 'discord.js';
import { Commands } from "..";
import config from "../../../infrastructure/config";
import { ICommand } from "../../../infrastructure/types/commands/commands.types";

const help: ICommand = {
    name: "help",
    description: "show help panel",
    execute: async (message, args) => {
        const descriptions = Object.values(Commands).map(command => `- ${config.discord.prefix}.${command.name}: ${command.description}`);

        let title = "Help Command";
        const description = "Type `lrem.help` command for more info on commands.\nYou can also type `lrem.help command` for more info on a specific command.";
        const color = 16497180;
        let commandsValue = "```\n" + descriptions.join('\n\n')  + "```";

        if (args.length > 0) {
            const command = args[0];
            if (!(command in Commands)) {
                message.reply("This command does not exist, I can't help you :(");
                return;
            }

            title = `Help: ${command}`;
            commandsValue = "```\n" + Commands[command].description  + "```";
        }

        const embed = new Discord.MessageEmbed({
            "title": title,
            "description": description,
            "color": color,
            "fields": [
                {
                    "name": "Commands",
                    "value": commandsValue
                }
            ]
        });

        message.channel.send(embed);
    }
}

export default help;
