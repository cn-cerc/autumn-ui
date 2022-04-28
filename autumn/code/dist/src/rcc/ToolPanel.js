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
import WebControl from "./WebControl";
var ToolPanel = /** @class */ (function (_super) {
    __extends(ToolPanel, _super);
    function ToolPanel(props) {
        return _super.call(this, props) || this;
    }
    ToolPanel.prototype.render = function () {
        return (_jsx("div", __assign({ className: 'aui-toolPanel-main' }, { children: React.Children.map(this.props.children, function (child) { return child; }) }), void 0));
    };
    return ToolPanel;
}(WebControl));
export default ToolPanel;
var ToolItem = /** @class */ (function (_super) {
    __extends(ToolItem, _super);
    function ToolItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ToolItem.prototype.render = function () {
        return (_jsx(React.Fragment, { children: _jsxs("div", __assign({ className: 'aui-toolPanel-toolGroup' }, { children: [_jsx("div", __assign({ className: 'aui-toolPanel-toolTitle' }, { children: this.props.title }), void 0), _jsx("div", __assign({ className: 'aui-toolPanel-toolItems' }, { children: React.Children.map(this.props.children, function (child) { return child; }) }), void 0)] }), void 0) }, void 0));
    };
    return ToolItem;
}(WebControl));
export { ToolItem };
