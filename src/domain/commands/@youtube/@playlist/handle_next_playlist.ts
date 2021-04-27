import ytdl from 'ytdl-core-discord';

import ConnectionHandler from "../connection_handler";
import PlaylistHandler from "../playlist_handler";

export const handleNextPlaylist = async () => {
    if (ConnectionHandler.getInstance().getConnection().dispatcher) {
        ConnectionHandler.getInstance().getConnection().dispatcher.off("finish", handleNextPlaylist);
    }
    
    PlaylistHandler.getInstance().next();
    const track = PlaylistHandler.getInstance().getCurrentTrack();

    if (!track) {
        return;
    }

    const dispatcher = ConnectionHandler.getInstance().getConnection().play(
        await ytdl(track, { filter: "audioonly" }), 
        { type: "opus" }
    );

    dispatcher.on("finish", handleNextPlaylist);
};