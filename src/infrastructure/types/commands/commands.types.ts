import Discord from 'discord.js';

export interface ICommand {
    name: string;
    description: string;
    execute: (
        message: Discord.Message, 
        args?: string[], 
        kwargs?: Record<string, string>
    ) => Promise<void>;
    children?: Record<string, ICommand>;
    parent?: Record<string, ICommand>;
}