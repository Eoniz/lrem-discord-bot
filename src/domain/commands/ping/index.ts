import { ICommand } from "../../../infrastructure/types/commands/commands.types";

const ping: ICommand = {
    name: "ping",
    description: "pong !",
    execute: async (message, args) => {
        if (args.length > 0) {
            message.reply(args.join(' '));
            return;
        }

        message.reply("pong !");
    }
}

export default ping;
