import Discord from "discord.js";
import { ICommand } from "../../../infrastructure/types/commands/commands.types";
import ytdl from 'ytdl-core-discord';
import { getInfo } from "ytdl-core";
import ConnectionHandler from "./connection_handler";
import PlaylistHandler from "./playlist_handler";

const play = async (message: Discord.Message, args: string[], kwargs: Record<string, string>) => {
    if (args.length !== 2) {
        message.reply("You should give me the link of youtube first !");
        return;
    }

    ConnectionHandler.getInstance().getConnection().play(
        await ytdl(args[1], { filter: "audioonly" }), 
        { type: "opus" }
    );
}

const pause = async (message: Discord.Message) => {
    if (!ConnectionHandler.getInstance().getConnection()) {
        message.reply("I am not on a voice channel :(");
        return;
    }
    
    if (!ConnectionHandler.getInstance().getConnection().dispatcher) {
        message.reply("I am currently streaming nothing :(");
        return;
    }

    const dispatcher = ConnectionHandler.getInstance().getConnection().dispatcher;
    dispatcher.pause();
}

const resume = async (message: Discord.Message) => {
    if (!ConnectionHandler.getInstance().getConnection()) {
        message.reply("I am not on a voice channel :(");
        return;
    }
    
    if (!ConnectionHandler.getInstance().getConnection().dispatcher) {
        message.reply("I am currently streaming nothing :(");
        return;
    }

    const dispatcher = ConnectionHandler.getInstance().getConnection().dispatcher;
    dispatcher.resume();
}

const stop = async (message: Discord.Message) => {
    if (!ConnectionHandler.getInstance().getConnection()) {
        message.reply("I am not on a voice channel :(");
        return;
    }
    
    if (!ConnectionHandler.getInstance().getConnection().dispatcher) {
        message.reply("I am currently streaming nothing :(");
        return;
    }

    const dispatcher = ConnectionHandler.getInstance().getConnection().dispatcher;
    dispatcher.destroy();
}

const handleNextPlaylist = async () => {
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

const managePlaylist = async (message: Discord.Message, args: string[], kwargs: Record<string, string>) => {
    if (args.length === 1) {
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

    if (args[1] === "add") {
        const tracks = args.slice(2);
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
        return;
    }

    if (args[1] === "next") {
        if (!ConnectionHandler.getInstance().getConnection().dispatcher) {
            message.reply("I am currently streaming nothing :(");
        }

        PlaylistHandler.getInstance().previous().previous();
        ConnectionHandler.getInstance().getConnection().dispatcher.end();
        return;
    }

    if (args[1] === "previous") {
        if (!ConnectionHandler.getInstance().getConnection().dispatcher) {
            message.reply("I am currently streaming nothing :(");
        }

        ConnectionHandler.getInstance().getConnection().dispatcher.end();
        return;
    }

    if (args[1] === "clear") {
        if (!ConnectionHandler.getInstance().getConnection().dispatcher) {
            message.reply("I am currently streaming nothing :(");
        }

        PlaylistHandler.getInstance().clear();
        ConnectionHandler.getInstance().getConnection().dispatcher.end();
        return;
    }

    const links = args.slice(1);
    PlaylistHandler.getInstance().setPlaylist(links);
    const dispatcher = ConnectionHandler.getInstance().getConnection().play(
        await ytdl(PlaylistHandler.getInstance().getCurrentTrack(), { filter: "audioonly" }), 
        { type: "opus" }
    );

    dispatcher.on("finish", handleNextPlaylist);
}

const youtube: ICommand = {
    name: "youtube",
    description: "blabla",
    execute: async (message, args, kwargs) => {
        if (!message.member.voice.channel) {
            message.reply("You are not in a voice channel :(");
            return;
        }

        const connection = await message.member.voice.channel.join();
        ConnectionHandler.getInstance().setConnection(connection);

        if (args.length) {
            if (args[0] === "play") {
                await play(message, args, kwargs);
            }

            if (args[0] === "pause") {
                await pause(message);
            }

            if (args[0] === "resume") {
                await resume(message);
            }

            if (args[0] === "stop") {
                await stop(message);
            }

            if (args[0] === "playlist") {
                await managePlaylist(message, args, kwargs);
            }
        }
    }
}

export default youtube;
