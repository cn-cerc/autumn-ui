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
import React from "react";
var SearchText = /** @class */ (function (_super) {
    __extends(SearchText, _super);
    function SearchText(props) {
        var _this = _super.call(this, props) || this;
        _this.onClick = function (el) {
            if (_this.props.onChanged != undefined)
                _this.props.onChanged(_this.state.value);
        };
        _this.changeValue = function (event) {
            var text = event.target.value;
            _this.setState({ value: text });
        };
        _this.state = {
            value: props.defaultValue ? props.defaultValue : ""
        };
        return _this;
    }
    SearchText.prototype.render = function () {
        return (_jsx("div", { children: _jsxs("div", { children: [this.props.label, _jsx("input", { type: "input", value: this.state.value, onChange: this.changeValue }, void 0), _jsx("button", __assign({ id: "btnSearch", onClick: this.onClick }, { children: "\u641C\u7D22" }), void 0)] }, void 0) }, void 0));
    };
    return SearchText;
}(React.Component));
export default SearchText;
