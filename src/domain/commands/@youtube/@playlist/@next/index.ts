import { ICommand } from "../../../../../infrastructure/types/commands/commands.types";
import ConnectionHandler from "../../connection_handler";
import PlaylistHandler from "../../playlist_handler";

const youtubePlaylistNext: ICommand = {
    name: "next",
    description: "Skip the current song from playlist to the next one.",
    execute: async (message, args) => {
        if (!ConnectionHandler.getInstance().getConnection().dispatcher) {
            message.reply("I am currently streaming nothing :(");
        }

        PlaylistHandler.getInstance().previous().previous();
        ConnectionHandler.getInstance().getConnection().dispatcher.end();

        message.react("⏭️");
    }
}

export default youtubePlaylistNext;
