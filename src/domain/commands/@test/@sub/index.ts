import { ICommand } from "../../../../infrastructure/types/commands/commands.types";

const sub: ICommand = {
    name: "sub",
    description: "test sub",
    execute: async (message, args) => {
        if (args.length > 0) {
            message.reply("sub pong: " + args.join(' '));
            return;
        }

        message.reply("sub pong !");
    }
}

export default sub;
