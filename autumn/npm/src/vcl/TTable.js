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
import TComponent from "./TComponent";
var TTable = /** @class */ (function (_super) {
    __extends(TTable, _super);
    function TTable(owner, props) {
        if (props === void 0) { props = null; }
        var _this = _super.call(this, owner, props) || this;
        _this.setRootLabel('table');
        return _this;
    }
    Object.defineProperty(TTable.prototype, "border", {
        get: function () { return this.readProperty('border'); },
        enumerable: false,
        configurable: true
    });
    TTable.prototype.setBorder = function (value) { this.writeProperty('border', value); return this; };
    return TTable;
}(TComponent));
export default TTable;
var TTr = /** @class */ (function (_super) {
    __extends(TTr, _super);
    function TTr(owner) {
        if (owner === void 0) { owner = null; }
        var _this = _super.call(this, owner) || this;
        _this.setRootLabel("tr");
        return _this;
    }
    return TTr;
}(TComponent));
export { TTr };
var TTh = /** @class */ (function (_super) {
    __extends(TTh, _super);
    function TTh(owner) {
        var _this = _super.call(this, owner) || this;
        _this.setRootLabel("th");
        return _this;
    }
    return TTh;
}(TComponent));
export { TTh };
var TTd = /** @class */ (function (_super) {
    __extends(TTd, _super);
    function TTd(owner) {
        var _this = _super.call(this, owner) || this;
        _this.setRootLabel("td");
        return _this;
    }
    return TTd;
}(TComponent));
export { TTd };
