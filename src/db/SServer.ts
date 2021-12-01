const LOCALHOST: string = "http://127.0.0.1";

export default class SServer {
    private _host: string;
    private _token: string;

    constructor() {
        this._host = LOCALHOST;
    }

    get host(): string { return this._host }
    setHost(value: string): SServer {
        this._host = value;
        return this;
    }

    get token(): string { return this._token }
    setToken(value: string): SServer {
        this._token = value;
        return this;
    }
}