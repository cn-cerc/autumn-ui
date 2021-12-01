import DataSet from "./DataSet";
import RemoteService from "./RemoteService";
import SServer from "./SServer";

export default class SClient extends DataSet {
    private _service: string;
    private _server: SServer;

    get server(): SServer {
        if (!this._server)
            this._server = new SServer;
        return this._server;
    }
    setServer(value: SServer): SClient {
        this._server = value;
        return this;
    }

    get service(): string { return this._service }
    setService(value: string): SClient {
        this._service = value;
        return this;
    }

    open(func: (sender: SClient) => void) {
        let self = this;
        let rs = new RemoteService();
        rs.setHost(this.server.host);
        rs.setToken(this.server.token);
        rs.setService(this._service);
        rs.dataIn.setJson(this.json);
        rs.exec((dataOut => {
            self.setJson(dataOut.json);
            self.mergeChangeLog();
            func.call(self);
        }));
    }

    save(func: (sender: SClient) => void) {
        this.setCurd(true);
        this.open(func);
        this.setCurd(false);
    }

}