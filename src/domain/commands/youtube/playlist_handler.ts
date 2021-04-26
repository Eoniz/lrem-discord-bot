import Discord from 'discord.js';

class PlaylistHandler {
    private static instance: PlaylistHandler;

    private _idx: number;
    private _playlist: string[];

    constructor () {
        this._idx = 0;
        this._playlist = [];
    }

    public static getInstance() {
        if (!PlaylistHandler.instance) {
            PlaylistHandler.instance = new PlaylistHandler();
        }

        return PlaylistHandler.instance;
    }

    public setPlaylist(playlist: string[]) {
        this._idx = 0;
        this._playlist = playlist;
    }

    public getPlaylist() {
        return this._playlist || [];
    }

    public getCurrentTrack() {
        return this._playlist[this._idx];
    }

    public getIdx() {
        return this._idx;
    }

    public next() {
        this._idx = this._idx - 1 < 0 ? this._playlist.length - 1 : this._idx - 1;
        return this;
    }

    public previous() {
        this._idx = (this._idx + 1) % this._playlist.length;
        return this;
    }

    public addTrack(track: string) {
        this._playlist.push(track);
    }

    public addTracks(tracks: string[]) {
        tracks.forEach(track => this._playlist.push(track));
    }

    public clear() {
        this._playlist = [];
        this._idx = 0;
    }
}

export default PlaylistHandler;
