import DataSet from "./DataSet";

export default class RemoteService {
    private _sid: string = null;
    private _host = '/services/';
    private _service: string;
    private _dataIn: DataSet;

    constructor(props: any) {
        this._dataIn = new DataSet();
        this._host = window.location.protocol + "//" + window.location.hostname + "/services/";
        if (props) {
            const { sid, token, host, service } = props;
            if (sid)
                this._sid = sid;
            else if (token)
                this._sid = token;
            if (host)
                this._host = props.host;
            if (service)
                this._service = props.service;
        }
    }

    exec(func: (dataOut: DataSet) => void): void {
        this.getPromise().then(dataOut => func.call(this, dataOut)).catch(dataOut => func.call(this, dataOut))
    }


    getPromise(): Promise<DataSet> {
        if (!this._service)
            return new DataSet().setMessage('service is null').getPromise();

        let url = this._host + this._service;
        if (this._sid)
            url = `${url}?sid=${this._sid}`;

        return fetch(url, {
            method: 'POST', body: "dataIn=" + this.dataIn.jsonString,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                // "Content-Type": "multipart/form-data",
            },
        }).then(function (response) {
            let contentType = response.headers.get("content-type");
            if ("application/json;charset=utf-8".toUpperCase() == contentType.toUpperCase()) {
                return response.json();
            } else {
                return new DataSet().setMessage(response.statusText).getPromise();
            }
        }).then((json) => {
            let dataOut = new DataSet();
            dataOut.jsonString = JSON.stringify(json);
            return dataOut.getPromise();
        })
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
