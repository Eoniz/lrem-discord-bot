import * as Discord from 'discord.js';
import initCommands, { Commands } from './domain/commands';
import config from './infrastructure/config';
import minimist from 'minimist-string';

const client = new Discord.Client();

client.on('message', async (message) => {
    if (!message.content.startsWith(config.discord.prefix)) {
        return;
    }

    const tempArgs = message.content.split(/\s+/);
    const command = tempArgs.shift().toLowerCase().slice(config.discord.prefix.length + 1);
    
    const { _: args, ...kwargs } = minimist(tempArgs.join(' '));

    if (!(command in Commands)) {
        message.reply("this command does not exist !");
        return;
    }

    await Commands[command].execute(
        message, 
        (args as string[]).filter(v => v.length > 0),
        kwargs
    );
});

const load = async () => {
    await initCommands();
    client.login(config.discord.token);
};

load();
