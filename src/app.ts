import * as Discord from 'discord.js';
import initCommands, { Commands } from './domain/commands';
import config from './infrastructure/config';
import minimist from 'minimist-string';
import { handlePetitBacDM } from './domain/@petitbac';

const client = new Discord.Client();

client.on('message', async (message) => {
    if (message.author.bot) {
        return;
    }

    if (message.channel.type === "dm") {
        handlePetitBacDM(message);
        return;
    }

    if (!message.content.startsWith(`${config.discord.prefix}.`)) {
        return;
    }

    const tempArgs = message.content.split(/\s+/);
    const command = tempArgs.shift().toLowerCase().slice(config.discord.prefix.length + 1);
    
    if (!command || !command.length) {
        return;
    }

    const { _: args, ...kwargs } = minimist(tempArgs.join(' '));

    if (!(command in Commands)) {
        message.reply("this command does not exist !");
        return;
    }

    for (let i = args.length; i > 0; i--) {
        const commandName = `${command} ${args.slice(0, i).join(' ')}`
        
        if (commandName in Commands) {
             const newArgs = args.slice(i);
             await Commands[commandName].execute(
                message, 
                (newArgs as string[]).filter(v => v.length > 0),
                kwargs
            );

            return;
        }
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
