import DataSet from "./DataSet";
var Timeout = /** @class */ (function () {
    function Timeout(times) {
        this._times = times;
    }
    Timeout.prototype.getPromise = function () {
        var _this = this;
        var value = this._times;
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                reject(new DataSet().setMessage("\u6267\u884C\u8D85\u65F6(" + value + "\u79D2)\uFF0C\u8BF7\u68C0\u67E5\u60A8\u7684\u64CD\u4F5C\uFF0C\u5EFA\u8BAE\u53D8\u66F4\u64CD\u4F5C\u65B9\u6CD5"));
            }, _this._times * 1000);
        });
    };
    return Timeout;
}());
export default Timeout;
