import fs from "fs";
import path from "path";
import { ICommand } from "../../infrastructure/types/commands/commands.types";

const CURRENT_DIR = path.dirname(__filename);
const Commands: Record<string, ICommand> = {};

const loadSubCommandsFromFolder = async (folder: string, parent: string = "") => {
    const subdirectories = fs.readdirSync(folder)
        .filter(file => file.startsWith("@") && fs.lstatSync(path.join(folder, file)).isDirectory())
    
    for (const commandFolder of subdirectories) {
        const pathname = path.resolve(folder, commandFolder, "index");
        const { default: command } = await import(pathname);
        const registryCommandName = parent !== "" ? `${parent} ${command.name}` : command.name;
        if (parent !== "") {
            command.name = registryCommandName;
            Commands[parent] = {
                ...Commands[parent],
                children: {
                    ...Commands[parent].children,
                    [command.name]: command
                }
            }
        }
        Commands[registryCommandName] = {
            ...command,
            children: {},
            parent: parent === "" ? {} : Commands[parent]
        };

        console.info(`Registered new command: ${command.name} at ${pathname}`);

        loadSubCommandsFromFolder(
            path.join(folder, commandFolder),
            registryCommandName
        );
    }
}

const initCommands = async () => {
    await loadSubCommandsFromFolder(CURRENT_DIR);
};

export default initCommands;
export { Commands };
