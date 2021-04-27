import { ICommand } from "../../../../../infrastructure/types/commands/commands.types";
import ConnectionHandler from "../../connection_handler";
import PlaylistHandler from "../../playlist_handler";
import ytdl from 'ytdl-core-discord';
import { handleNextPlaylist } from "../handle_next_playlist";

const youtubePlaylistAdd: ICommand = {
    name: "add",
    description: "Add the song(s) to the youtube playlist",
    execute: async (message, args) => {
        const tracks = [...args];
        if (!ConnectionHandler.getInstance().getConnection().dispatcher) {
            PlaylistHandler.getInstance().setPlaylist(tracks);
            const dispatcher = ConnectionHandler.getInstance().getConnection().play(
                await ytdl(PlaylistHandler.getInstance().getCurrentTrack(), { filter: "audioonly" }), 
                { type: "opus" }
            );
        
            dispatcher.on("finish", handleNextPlaylist);
            return;
        }
        
        PlaylistHandler.getInstance().addTracks(tracks);
        message.react("🔼");
    }
}

export default youtubePlaylistAdd;
