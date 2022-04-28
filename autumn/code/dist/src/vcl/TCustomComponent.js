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
import TText from "./TText";
var TCustomComponent = /** @class */ (function (_super) {
    __extends(TCustomComponent, _super);
    function TCustomComponent(owner, props) {
        if (props === void 0) { props = null; }
        var _this = _super.call(this, owner, props) || this;
        _this._history = [];
        _this._content = new TText(_this);
        return _this;
    }
    TCustomComponent.prototype.beginOutput = function (html) {
        this._content.setText(this.html().trim());
        this._history = [];
        //设置全局css样式
        var css = this.css().trim();
        if (css.length > 0 && this._history.length == 0) {
            for (var _i = 0, _a = css.split('\n'); _i < _a.length; _i++) {
                var line = _a[_i];
                var str = line.trim();
                if (str) {
                    this._history.push(str);
                    this.cssHead.push(str);
                }
            }
        }
        _super.prototype.beginOutput.call(this, html);
    };
    TCustomComponent.prototype.html = function () {
        return ("<div>content not define</div>");
    };
    TCustomComponent.prototype.css = function () {
        return ("");
    };
    return TCustomComponent;
}(TComponent));
export default TCustomComponent;
