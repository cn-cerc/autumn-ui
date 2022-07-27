import DataSet from "./DataSet";

export default class RemoteService {
    private _token: string = null;
    private _host = '/services/';
    private _service: string;
    private _dataIn: DataSet;
    private _dataOut: DataSet;

    constructor(props: any = {}) {
        this._dataIn = new DataSet();
        this._host = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port + "/services/";
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

    async exec(): Promise<boolean> {
        this._dataOut = await this.getPromise();
        return this._dataOut.state > 0;
    }


    getPromise(): Promise<DataSet> {
        if (!this._service)
            return new DataSet().setMessage('service is null').getPromise();

        let url = this._host + this._service;
        if (this._token)
            url = `${url}?sid=${this._token}`;

        return fetch(url, {
            method: 'POST', body: "dataIn=" + this.dataIn.json,
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
            dataOut.setJson(JSON.stringify(json));
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

    get dataOut(): DataSet { return this._dataOut; }
    setDataOut(value: DataSet) { this._dataOut = value; }
}

// 调用范例
// (async () => {
//     let app = new aui.RemoteService({ sid: '0df4a65ae8c3439382dbc45656404fa7', host: 'http://127.0.0.1/services/' });
//     app.setService('TAppUserInfo.DownloadSingle');
// 	   app.dataIn.head.setValue('Code_','911001162')
//     if (!await app.exec()) {
//         console.log('错误信息：', app.dataOut.message)
// 		return false;
//     }
//     console.log('正确结果',app.dataOut)
// })();