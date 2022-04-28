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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import DataRow from "../db/DataRow";
import DialogComponent from "./DialogComponent";
import { DialogForm } from "./DialogForm";
var YearDialog = /** @class */ (function (_super) {
    __extends(YearDialog, _super);
    function YearDialog() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.onSelect = function (sender) {
            if (_this.props.onSelect) {
                var el = sender.target;
                var row = new DataRow();
                row.setValue('year', el.innerText);
                _this.props.onSelect(row);
            }
            _this.setActive(false);
        };
        return _this;
    }
    YearDialog.prototype.render = function () {
        return (_jsx(DialogForm, __assign({ title: this.props.title, style: this.props.style, active: this.active, setActive: this.setActive }, { children: _jsxs("ul", __assign({ className: 'aui-yearDialog-dialog' }, { children: [_jsx("li", __assign({ onClick: this.onSelect }, { children: "2019" }), void 0), _jsx("li", __assign({ onClick: this.onSelect }, { children: "2020" }), void 0), _jsx("li", __assign({ onClick: this.onSelect }, { children: "2021" }), void 0)] }), void 0) }), void 0));
    };
    YearDialog.defaultProps = {
        title: '选择年份'
    };
    return YearDialog;
}(DialogComponent));
export default YearDialog;
