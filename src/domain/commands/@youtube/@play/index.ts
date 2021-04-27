import ConnectionHandler from "../connection_handler";
import ytdl from 'ytdl-core-discord';
import { ICommand } from "../../../../infrastructure/types/commands/commands.types";

const youtubePlay: ICommand = {
    name: "play",
    description: "play a song from youtube",
    execute: async (message, args) => {
        if (!message.member.voice.channel) {
            message.reply("You are not in a voice channel :(");
            return;
        }

        if (!ConnectionHandler.getInstance().getConnection()) {
            const connection = await message.member.voice.channel.join();
            ConnectionHandler.getInstance().setConnection(connection);
        }

        if (args.length !== 1) {
            message.reply("You should give me the link of your youtube video !");
            return;
        }
    
        ConnectionHandler.getInstance().getConnection().play(
            await ytdl(args[0], { filter: "audioonly" }), 
            { type: "opus" }
        );

        message.react("⏯️");
    }
}

export default youtubePlay;
