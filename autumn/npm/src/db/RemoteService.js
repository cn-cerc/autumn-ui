var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import DataSet from "./DataSet";
var RemoteService = /** @class */ (function () {
    function RemoteService(props) {
        if (props === void 0) { props = {}; }
        this._token = null;
        this._host = '/services/';
        this._dataIn = new DataSet();
        this._host = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port + "/services/";
        if (props) {
            var sid = props.sid, token = props.token, host = props.host, service = props.service;
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
    RemoteService.prototype.exec = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.getPromise()];
                    case 1:
                        _a._dataOut = _b.sent();
                        return [2 /*return*/, this._dataOut.state > 0];
                }
            });
        });
    };
    RemoteService.prototype.getPromise = function () {
        if (!this._service)
            return new DataSet().setMessage('service is null').getPromise();
        var url = this._host + this._service;
        if (this._token)
            url = "".concat(url, "?sid=").concat(this._token);
        return fetch(url, {
            method: 'POST', body: "dataIn=" + this.dataIn.json,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                // "Content-Type": "multipart/form-data",
            },
        }).then(function (response) {
            var contentType = response.headers.get("content-type");
            if ("application/json;charset=utf-8".toUpperCase() == contentType.toUpperCase()) {
                return response.json();
            }
            else {
                return new DataSet().setMessage(response.statusText).getPromise();
            }
        }).then(function (json) {
            var dataOut = new DataSet();
            dataOut.setJson(JSON.stringify(json));
            return dataOut.getPromise();
        });
    };
    Object.defineProperty(RemoteService.prototype, "token", {
        get: function () { return this._token; },
        enumerable: false,
        configurable: true
    });
    ;
    RemoteService.prototype.setToken = function (value) { this._token = value; return this; };
    Object.defineProperty(RemoteService.prototype, "dataIn", {
        get: function () { return this._dataIn; },
        enumerable: false,
        configurable: true
    });
    RemoteService.prototype.setDataIn = function (value) { this._dataIn = value; return this; };
    Object.defineProperty(RemoteService.prototype, "host", {
        get: function () { return this._host; },
        enumerable: false,
        configurable: true
    });
    ;
    RemoteService.prototype.setHost = function (host) { this._host = host; return this; };
    Object.defineProperty(RemoteService.prototype, "service", {
        get: function () { return this._service; },
        enumerable: false,
        configurable: true
    });
    RemoteService.prototype.setService = function (service) { this._service = service; return this; };
    Object.defineProperty(RemoteService.prototype, "dataOut", {
        get: function () { return this._dataOut; },
        enumerable: false,
        configurable: true
    });
    RemoteService.prototype.setDataOut = function (value) { this._dataOut = value; };
    return RemoteService;
}());
export default RemoteService;
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
