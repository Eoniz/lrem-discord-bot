import Discord from "discord.js";
import ytdl from 'ytdl-core-discord';
import { getInfo } from "ytdl-core";
import ConnectionHandler from "../connection_handler";
import { ICommand } from "../../../../infrastructure/types/commands/commands.types";
import PlaylistHandler from "../playlist_handler";
import { handleNextPlaylist } from "./handle_next_playlist";
import config from "../../../../infrastructure/config";

const youtubePlaylistList: ICommand = {
    name: "playlist",
    description: `get or set youtube current playlist videos. Use as follow:\n* Setting the playlist: \`${config.discord.prefix}.youtube playlist {link1} {link2}\`\n* Getting the playlist: \`${config.discord.prefix}.youtube playlist\``,
    execute: async (message, args) => {
        if (args.length === 0) {
            if (!ConnectionHandler.getInstance().getConnection()) {
                message.reply("I am not on a voice channel :(");
                return;
            }
    
            if (!ConnectionHandler.getInstance().getConnection().dispatcher) {
                message.reply("I am currently streaming nothing :(");
                return;
            }

            const current = PlaylistHandler.getInstance().getIdx();
            const playlist = PlaylistHandler.getInstance().getPlaylist();
    
            const fields = await Promise.all(playlist.map(async (track, i) => {
                try {
                    const info = await getInfo(track);
    
                    return ({
                        name: i === current ? `▶️ ${info.videoDetails.title}` : info.videoDetails.title,
                        value: `${info.videoDetails.media.artist} - ${info.videoDetails.media.song}`
                    });
                } catch (e) {
                    return ({
                        name: i === current ? `▶️ ${track}` : track,
                        value: "undefined"
                    });
                }
            }));
    
            const embed = new Discord.MessageEmbed({
                "title": `Tracklist`,
                "description": "Here is the current tracklist",
                "color": 49151,
                "fields": fields
            });

            message.reply(embed);

            return;
        }

        if (!ConnectionHandler.getInstance().getConnection()) {
            const connection = await message.member.voice.channel.join();
            ConnectionHandler.getInstance().setConnection(connection);
        }

        const links = [...args];
        PlaylistHandler.getInstance().setPlaylist(links);
        const dispatcher = ConnectionHandler.getInstance().getConnection().play(
            await ytdl(PlaylistHandler.getInstance().getCurrentTrack(), { filter: "audioonly" }), 
            { type: "opus" }
        );

        dispatcher.on("finish", handleNextPlaylist);
        message.react("⏯️");
    }
}

export default youtubePlaylistList;
