import config from "../../../infrastructure/config";
import { ICommand } from "../../../infrastructure/types/commands/commands.types";

const echo: ICommand = {
    name: "echo",
    description: "Re-send and delete your message.",
    execute: async (message, args) => {
        await message.delete();
        message.channel.send(message.content.replace(`${config.discord.prefix}.echo `, ''));
    }
}

export default echo;
