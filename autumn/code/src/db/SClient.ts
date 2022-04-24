import DataSet from "./DataSet";
import RemoteService from "./RemoteService";
import SServer from "./SServer";

export default class SClient extends DataSet {
    private _service: string;
    private _server: SServer;
    private _updateKey: number;

    constructor(props: any) {
        super(props);
        this.server.setHost('http://127.0.0.1:8080/');
        if (props) {
            const { sid, token, host, service } = props;
            if (sid)
                this.server.setToken(sid);
            else if (token)
                this.server.setToken(token);
            if (host)
                this.server.setHost(props.host);
            if (service)
                this._service = props.service;
        }
    }

    get server(): SServer {
        if (!this._server)
            this._server = new SServer();
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

    get updateKey(): number { return this._updateKey; }

    async open(): Promise<void> {
        this._updateKey = new Date().getTime();
        let rs = new RemoteService();
        rs.setHost(this.server.host);
        rs.setToken(this.server.token);
        rs.dataIn.setJson(this.json);

        rs.setService(this._service);
        if (this._service.toLowerCase().indexOf(' from ') > -1) {
            rs.dataIn.setValue('_sql_', this._service);
            this.setService(this.findService(this._service));
        }
        try {
            await rs.exec();
            this.setJson(rs.dataOut.json);
        } catch (err) {
            let ds: DataSet = new DataSet();
            ds.setJson(err.json);
            this.setState(ds.state);
            this.setMessage(ds.message);
        }
        this.mergeChangeLog();
    }

    async save(): Promise<void> {
        this.setCrud(true);
        await this.open();
        this.setCrud(false);
    }

    private findService(sql: string): string {
        let result: string = null;
        let items: string[] = sql.split(' ');
        for (let i = 0; i < items.length; i++) {
            if (items[i].toLowerCase() == "from") {
                // 防止取到空值
                while (items[i + 1] == null || "" == items[i + 1].trim()) {
                    i++;
                }
                result = items[++i]; // 获取数据库表名
                break;
            }
        }

        if (result == null)
            throw new Error("sql command error");

        return result;
    }
}