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
import RemoteService from "./RemoteService";
import Timeout from "./Timeout";
var QueryService = /** @class */ (function (_super) {
    __extends(QueryService, _super);
    function QueryService(props) {
        var _this = _super.call(this, props) || this;
        _this._sql = "";
        if (props) {
            var sql = props.sql;
            if (sql)
                _this.setSql(sql);
        }
        return _this;
    }
    QueryService.prototype.add = function (sql) {
        this._sql = this._sql.trim() + ' ' + sql.trim();
        return this;
    };
    Object.defineProperty(QueryService.prototype, "sql", {
        get: function () { return this._sql; },
        enumerable: false,
        configurable: true
    });
    QueryService.prototype.setSql = function (sql) { this._sql = sql; return this; };
    /**
     * 调用远程服务获取数据
     *
     * @param timeout 超时时间（单位秒）
     * @returns DataSet
     */
    QueryService.prototype.open = function (timeout) {
        if (timeout === void 0) { timeout = 15; }
        if (this._sql)
            this.setService(this.findService(this._sql));
        this.dataIn.head.setValue("_RecordFilter_", this._sql);
        return Promise.race([this.getPromise(), new Timeout(timeout).getPromise()]);
    };
    QueryService.prototype.findService = function (sql) {
        var result = null;
        var items = sql.split(' ');
        for (var i = 0; i < items.length; i++) {
            if (items[i].toLowerCase() == "from") {
                // 防止取到空值
                while (items[i + 1] == null || "" == items[i + 1].trim()) {
                    i++;
                }
                result = items[++i]; // 获取数据库表名
                break;
            }
        }
        if (result == null)
            throw new Error("sql command error");
        return result;
    };
    return QueryService;
}(RemoteService));
export default QueryService;
