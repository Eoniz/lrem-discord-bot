import Discord from 'discord.js';

class ConnectionHandler {
    private static instance: ConnectionHandler;

    private _connection: Discord.VoiceConnection;

    constructor () {
    }

    public static getInstance() {
        if (!ConnectionHandler.instance) {
            ConnectionHandler.instance = new ConnectionHandler();
        }

        return ConnectionHandler.instance;
    }

    public setConnection(connection: Discord.VoiceConnection) {
        this._connection = connection;
    }

    public getConnection() {
        return this._connection || null;
    }
}

export default ConnectionHandler;
