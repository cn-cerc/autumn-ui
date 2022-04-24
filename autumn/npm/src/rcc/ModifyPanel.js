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
import React, { isValidElement } from "react";
import WebControl from "./WebControl";
var ModifyPanel = /** @class */ (function (_super) {
    __extends(ModifyPanel, _super);
    function ModifyPanel(props) {
        var _this = _super.call(this, props) || this;
        _this.onChanged = function (meta) {
            _this.setState(_this.state);
        };
        _this.btnExecute = function (sender) {
            var button = sender.target;
            var opera = button.dataset.opera;
            if (_this.props.onExecute) {
                _this.props.onExecute(_this.state.dataRow, opera);
            }
        };
        _this.state = { dataRow: _this.props.dataRow };
        return _this;
    }
    ModifyPanel.prototype.render = function () {
        return (_jsxs("div", __assign({ className: 'aui-modifyPanel-main' }, { children: [_jsx("div", __assign({ className: 'aui-modifyPanel-main' }, { children: this.getItems() }), void 0), _jsxs("div", __assign({ className: 'aui-modifyPanel-opera' }, { children: [_jsx("button", __assign({ "data-opera": 'save', onClick: this.btnExecute }, { children: "\u4FDD\u5B58" }), void 0), _jsx("button", __assign({ "data-opera": 'final', onClick: this.btnExecute }, { children: "\u751F\u6548" }), void 0), _jsx("button", __assign({ "data-opera": 'unchange', onClick: this.btnExecute }, { children: "\u64A4\u6D88" }), void 0), _jsx("button", __assign({ "data-opera": 'reclace', onClick: this.btnExecute }, { children: "\u4F5C\u5E9F" }), void 0)] }), void 0)] }), void 0));
    };
    ModifyPanel.prototype.getItems = function () {
        var _this = this;
        var items = [];
        var key = 0;
        React.Children.map(this.props.children, function (child) {
            if (isValidElement(child)) {
                var item = React.cloneElement(child, {
                    key: key++,
                    dataRow: _this.state.dataRow, onChanged: _this.onChanged
                });
                items.push(item);
            }
        });
        return items;
    };
    return ModifyPanel;
}(WebControl));
export default ModifyPanel;
