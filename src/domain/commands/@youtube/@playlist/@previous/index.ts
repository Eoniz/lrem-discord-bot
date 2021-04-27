import { ICommand } from "../../../../../infrastructure/types/commands/commands.types";
import ConnectionHandler from "../../connection_handler";

const youtubePlaylistPrevious: ICommand = {
    name: "previous",
    description: "Get back to the previous song from playlist.",
    execute: async (message, args) => {
        if (!ConnectionHandler.getInstance().getConnection().dispatcher) {
            message.reply("I am currently streaming nothing :(");
        }

        ConnectionHandler.getInstance().getConnection().dispatcher.end();

        message.react("⏮️");
    }
}

export default youtubePlaylistPrevious;
