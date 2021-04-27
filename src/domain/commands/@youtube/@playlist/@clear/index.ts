import { ICommand } from "../../../../../infrastructure/types/commands/commands.types";
import ConnectionHandler from "../../connection_handler";
import PlaylistHandler from "../../playlist_handler";

const youtubePlaylistClear: ICommand = {
    name: "clear",
    description: "Clear the current youtube playlist.",
    execute: async (message, args) => {
        if (!ConnectionHandler.getInstance().getConnection().dispatcher) {
            message.reply("I am currently streaming nothing :(");
        }

        PlaylistHandler.getInstance().clear();
        ConnectionHandler.getInstance().getConnection().dispatcher.end();

        message.react("⏏️");
    }
}

export default youtubePlaylistClear;
