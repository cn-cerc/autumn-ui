import { TComponent } from "../SummerCI";
import DataSet from "./DataSet";

let _this: RemoteService = null;

export default class RemoteService {
    owner: any = null;
    host = '/services/';
    service: string;
    _dataIn: DataSet;
    _dataOut: DataSet;

    constructor(owner: any) {
        this.owner = owner;
        _this = this;
        this._dataIn = new DataSet();
    }

    exec(func: any): void {
        let url = this.host + this.service;
        if (this.owner && this.owner.sid)
            url = `${url}?sid=${this.owner.sid}`;

        fetch(url, {
            method: 'POST', body: "dataIn=" + this.getDataIn().getJson(),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                // "Content-Type": "multipart/form-data",
            },
        }).then(function (response) {
            var contentType = response.headers.get("content-type");
            if ("application/json;charset=utf-8" == contentType)
                return response.json();
            else
                throw new Error('not support: ' + contentType);
        }).then(function (data: any) {
            //console.log(data);
            _this._dataOut = new DataSet(JSON.stringify(data));
            func.call(_this, _this._dataOut);
        });
    }

    getDataIn(): DataSet {
        return this._dataIn;
    }
    setDataIn(value: DataSet) {
        this._dataOut = value;
        return this;
    }

    getDataOut(): DataSet {
        return this._dataOut
    }

    getMessage(): string {
        return this._dataOut.getMessage();
    }

    setHost(host: string): RemoteService {
        this.host = host;
        return this;
    }

    setService(service: string): RemoteService {
        this.service = service;
        return this;
    }
}

// let svr = new RemoteService();
// svr.setHost('http://127.0.0.1/services/');
// svr.setService('SvrExample.search');
// svr.exec(() => {
//     console.log(svr.getDataSet().getJson());
//     console.log(svr.getMessage());
// });
