import DataSet from "./DataSet";

export default class RemoteService {
    private _token: string = null;
    private _host = '/services/';
    private _service: string;
    private _dataIn: DataSet;

    constructor(props: any) {
        this._dataIn = new DataSet();
        this._host = window.location.protocol + "//" + window.location.hostname + "/services/";
        if (props) {
            const { sid, token, host, service } = props;
            if (sid)
                this._token = sid;
            else if (token)
                this._token = token;
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
        if (this._token)
            url = `${url}?sid=${this._token}`;

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
            dataOut.setJsonString(JSON.stringify(json));
            return dataOut.getPromise();
        })
    }

    get token(): string { return this._token };
    setToken(value: string): RemoteService { this._token = value; return this; }

    get dataIn(): DataSet { return this._dataIn }
    setDataIn(value: DataSet): RemoteService { this._dataIn = value; return this; }

    get host(): string { return this._host };
    setHost(host: string): RemoteService { this._host = host; return this; }

    get service(): string { return this._service }
    setService(service: string): RemoteService { this._service = service; return this; }
}
