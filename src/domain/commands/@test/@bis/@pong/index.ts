import { ICommand } from "../../../../../infrastructure/types/commands/commands.types";

const bis: ICommand = {
    name: "pong",
    description: "test pong",
    execute: async (message, args) => {
        if (args.length > 0) {
            message.reply("bis pong pong: " + args.join(' '));
            return;
        }

        message.reply("bis pong pong !");
    }
}

export default bis;
