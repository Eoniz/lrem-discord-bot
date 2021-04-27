import ConnectionHandler from "../connection_handler";
import { ICommand } from "../../../../infrastructure/types/commands/commands.types";

const youtubePause: ICommand = {
    name: "pause",
    description: "pause the current song from youtube",
    execute: async (message, args) => {
        if (!ConnectionHandler.getInstance().getConnection()) {
            message.reply("I'm not on a voice channel");
        }

        if (!ConnectionHandler.getInstance().getConnection().dispatcher) {
            message.reply("I am currently streaming nothing :(");
            return;
        }

        const dispatcher = ConnectionHandler.getInstance().getConnection().dispatcher;
        dispatcher.pause();
    }
}

export default youtubePause;
