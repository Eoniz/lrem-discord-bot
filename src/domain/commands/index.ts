import fs from "fs";
import path from "path";
import { ICommand } from "../../infrastructure/types/commands/commands.types";

const CURRENT_DIR = path.dirname(__filename);
const Commands: Record<string, ICommand> = {};

const initCommands = async () => {
    const files = fs.readdirSync(CURRENT_DIR);

    await Promise.all(files.map(async (file) => {
        if (file.startsWith('index.js')) {
            return;
        }
        
        console.debug(`[debug] [server] found command at ./${file}`);

        const { default: command } = await import(path.resolve(CURRENT_DIR, file, "index"));
        Commands[command.name] = command;
    }));
};

export default initCommands;
export { Commands };
