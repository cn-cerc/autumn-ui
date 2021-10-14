//import fetch from "node-fetch";
import DataSet from "./DataSet";

let _this = null;

export default class RemoteService {
    owner = null;
    host = '/services/';
    service;
    _dataIn;
    _dataOut;

    constructor(owner) {
        this.owner = owner;
        _this = this;
        this._dataIn = new DataSet();
    }

    exec(func) {
        let url = this.host + this.service;
        if (this.owner && this.owner.sid)
            url = `${url}?sid=${this.owner.sid}`;

        fetch(url, {
            method: 'POST', body: "dataIn=" + this.dataIn.getJson(),
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
        }).then(function (data) {
            //console.log(data);
            _this._dataOut = new DataSet(JSON.stringify(data));
            func.call(_this, _this._dataOut);
        });
    }

    get dataIn() { return this._dataIn }
    set dataIn(value) { this._dataOut = value }

    get dataOut() { return this._dataOut }

    getDataOut() {
        return this.dataOut;
    }

    getMessage() {
        return this.dataOut.getMessage();
    }

    setHost(host) {
        this.host = host;
    }

    setService(service) {
        this.service = service;
    }
}

// let svr = new RemoteService();
// svr.setHost('http://127.0.0.1/services/');
// svr.setService('SvrExample.search');
// svr.exec(() => {
//     console.log(svr.getDataSet().getJson());
//     console.log(svr.getMessage());
// });
