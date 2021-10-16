import { TComponent } from "../SummerCI";
import DataSet from "./DataSet";

export default class RemoteService {
    owner: any = null;
    sid: string = null;
    host = '/services/';
    service: string;
    private _dataIn: DataSet;

    constructor(owner: any) {
        this._dataIn = new DataSet();
        if (owner) {
            this.owner = owner;
            if (owner.sid)
                this.sid = owner.sid;
            if (owner.host)
                this.host = owner.host;
        }
    }

    exec(func: (dataOut: DataSet) => void): void {
        if (!this.service) {
            func.call(this, new DataSet().setMessage('service is null'));
            return;
        }

        let url = this.host + this.service;
        if (this.sid)
            url = `${url}?sid=${this.sid}`;

        fetch(url, {
            method: 'POST', body: "dataIn=" + this.getDataIn().getJson(),
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
                    func.call(this, new DataSet().setMessage('not support:' + contentType));
                }
            }
        }).then(function (data: string) {
            let dataOut = new DataSet(JSON.stringify(data));
            func.call(this, dataOut);
        });
    }

    getDataIn(): DataSet {
        return this._dataIn;
    }
    setDataIn(value: DataSet) {
        this._dataIn = value;
        return this;
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
