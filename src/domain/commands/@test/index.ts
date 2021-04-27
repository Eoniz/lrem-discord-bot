import { ICommand } from "../../../infrastructure/types/commands/commands.types";

const test: ICommand = {
    name: "test",
    description: "test",
    execute: async (message) => {
        message.reply("pong !");
    }
}

export default test;
