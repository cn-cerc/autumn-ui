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
var DBCheckbox = /** @class */ (function (_super) {
    __extends(DBCheckbox, _super);
    function DBCheckbox(props) {
        var _this = _super.call(this, props) || this;
        _this.onChange = function (sender) {
            if (!_this.props.isUseChangedEvent)
                return;
            var el = sender.target;
            var row = _this.props.dataRow;
            row.setValue(_this.props.dataField, !row.getBoolean(_this.props.dataField));
            if (_this.props.onChanged)
                _this.props.onChanged(_this.props.dataRow.fields.get(el.name));
        };
        return _this;
    }
    DBCheckbox.prototype.render = function () {
        var row = this.props.dataRow;
        if (!row)
            return null;
        var value = false;
        if (row)
            value = row.getBoolean(this.props.dataField);
        var dataName;
        if (this.props.dataName) {
            dataName = (_jsx("label", __assign({ htmlFor: this.props.dataField }, { children: this.props.dataName }), void 0));
        }
        return (_jsxs("div", __assign({ className: this.props.className || '' }, { children: [_jsx("input", { type: "checkbox", role: "" + this.props.dataRow.getString('columnName'), id: this.props.dataField, name: this.props.dataField, checked: value, onChange: this.onChange }, void 0), dataName] }), void 0));
    };
    DBCheckbox.defaultProps = {
        isUseChangedEvent: true
    };
    return DBCheckbox;
}(React.Component));
export default DBCheckbox;
