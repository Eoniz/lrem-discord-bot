import { ICommand } from "../../../../infrastructure/types/commands/commands.types";

const bis: ICommand = {
    name: "bis",
    description: "test bis",
    execute: async (message, args) => {
        if (args.length > 0) {
            message.reply("bis pong: " + args.join(' '));
            return;
        }

        message.reply("bis pong !");
    }
}

export default bis;
