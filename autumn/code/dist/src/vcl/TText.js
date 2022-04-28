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
var TText = /** @class */ (function (_super) {
    __extends(TText, _super);
    function TText(owner, props) {
        if (props === void 0) { props = null; }
        var _this = _super.call(this, owner, props) || this;
        if (props) {
            var text = props.text;
            if (text)
                _this.setText(text);
        }
        return _this;
    }
    Object.defineProperty(TText.prototype, "text", {
        get: function () { return this._text; },
        enumerable: false,
        configurable: true
    });
    TText.prototype.setText = function (text) { this._text = text; return this; };
    TText.prototype.output = function (html) {
        if (this._text)
            html.print(this._text);
    };
    return TText;
}(TComponent));
export default TText;
