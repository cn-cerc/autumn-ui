var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Datetime = /** @class */ (function () {
    function Datetime(data) {
        if (data === void 0) { data = null; }
        if (data)
            this._data = data;
        else
            this._data = new Date();
    }
    Datetime.prototype.toString = function () {
        return this.format('yyyy-MM-dd hh:mm:ss');
    };
    Object.defineProperty(Datetime.prototype, "yearMonth", {
        get: function () { return this.format('yyyyMM'); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Datetime.prototype, "asFastDate", {
        get: function () { return new FastDate(this._data); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Datetime.prototype, "asFastTime", {
        get: function () { return new FastTime(this._data); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Datetime.prototype, "data", {
        get: function () { return this._data; },
        enumerable: false,
        configurable: true
    });
    Datetime.prototype.format = function (fmt) {
        var o = {
            "M+": this._data.getMonth() + 1,
            "d+": this._data.getDate(),
            "h+": this._data.getHours(),
            "m+": this._data.getMinutes(),
            "s+": this._data.getSeconds(),
            "S": this._data.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (this._data.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                //@ts-ignore
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return fmt;
    };
    return Datetime;
}());
export default Datetime;
var FastDate = /** @class */ (function (_super) {
    __extends(FastDate, _super);
    function FastDate(data) {
        if (data === void 0) { data = null; }
        return _super.call(this, data) || this;
    }
    FastDate.prototype.toString = function () {
        return this.format('yyyy-MM-dd');
    };
    return FastDate;
}(Datetime));
export { FastDate };
var FastTime = /** @class */ (function (_super) {
    __extends(FastTime, _super);
    function FastTime(data) {
        if (data === void 0) { data = null; }
        return _super.call(this, data) || this;
    }
    FastTime.prototype.toString = function () {
        return this.format('hh:mm:ss');
    };
    return FastTime;
}(Datetime));
export { FastTime };
