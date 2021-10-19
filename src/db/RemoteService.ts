import DataSet from "./DataSet";

export default class RemoteService {
    private _sid: string = null;
    private _host = '/services/';
    private _service: string;
    private _dataIn: DataSet;

    constructor(props: any) {
        this._dataIn = new DataSet();
        if (props) {
            const { sid, host, service } = props;
            if (sid)
                this._sid = sid;
            if (host)
                this._host = props.host;
            if (service)
                this._service = props.service;
        }
    }

    exec(func: (dataOut: DataSet) => void): void {
        if (!this._service) {
            func.call(this, new DataSet().setMessage('service is null'));
            return;
        }

        let url = this._host + this._service;
        if (this._sid)
            url = `${url}?sid=${this._sid}`;

        fetch(url, {
            method: 'POST', body: "dataIn=" + this.dataIn.jsonString,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                // "Content-Type": "multipart/form-data",
            },
        }).then(function (response) {
            let contentType = response.headers.get("content-type");
            if ("application/json;charset=utf-8" == contentType) {
                return response.json();
            } else {
                if (response.status == 502) {
                    func.call(this, new DataSet().setMessage(response.statusText));
                } else {
                    console.log(response);
                    func.call(this, new DataSet().setMessage('服务执行时间过久，请调整操作并重试'));
                }
            }
        }).then(function (data: object) {
            let dataOut = new DataSet();
            dataOut.jsonString = JSON.stringify(data);
            func.call(this, dataOut);
        });
    }

    set sid(value: string) { this._sid = value }
    get sid(): string { return this._sid };

    set dataIn(value: DataSet) { this._dataIn = value }
    get dataIn(): DataSet { return this._dataIn }

    set host(host: string) { this._host = host }
    get host(): string { return this._host };

    set service(service: string) { this._service = service }
    get service(): string { return this._service }
}
