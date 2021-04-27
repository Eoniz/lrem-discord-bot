import ConnectionHandler from "../connection_handler";
import { ICommand } from "../../../../infrastructure/types/commands/commands.types";

const youtubeStop: ICommand = {
    name: "stop",
    description: "stop the current song from youtube",
    execute: async (message) => {
        message.react("🛑");

        if (ConnectionHandler.getInstance().getConnection()) {
            if (ConnectionHandler.getInstance().getConnection().dispatcher) {
                const dispatcher = ConnectionHandler.getInstance().getConnection().dispatcher;
                dispatcher.destroy();
            }
        }

        ConnectionHandler.getInstance().getConnection().disconnect();
        ConnectionHandler.getInstance().setConnection(null);
    }
}

export default youtubeStop;
