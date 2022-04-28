var LOCALHOST = "http://127.0.0.1";
var SServer = /** @class */ (function () {
    function SServer() {
        this._host = LOCALHOST;
    }
    Object.defineProperty(SServer.prototype, "host", {
        get: function () { return this._host; },
        enumerable: false,
        configurable: true
    });
    SServer.prototype.setHost = function (value) {
        this._host = value;
        return this;
    };
    Object.defineProperty(SServer.prototype, "token", {
        get: function () { return this._token; },
        enumerable: false,
        configurable: true
    });
    SServer.prototype.setToken = function (value) {
        this._token = value;
        return this;
    };
    return SServer;
}());
export default SServer;
