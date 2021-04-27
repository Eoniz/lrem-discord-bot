import config from "../../../infrastructure/config";
import { ICommand } from "../../../infrastructure/types/commands/commands.types";
import ConnectionHandler from "./connection_handler";

const youtube: ICommand = {
    name: "youtube",
    description: "Youtube commands",
    execute: async (message, args, kwargs) => {
        if (!message.member.voice.channel) {
            message.reply("You are not in a voice channel :(");
            return;
        }

        const connection = await message.member.voice.channel.join();
        ConnectionHandler.getInstance().setConnection(connection);

        message.reply(`Type \`${config.discord.prefix}.help\` for youtube relative commands.`);
    }
}

export default youtube;
