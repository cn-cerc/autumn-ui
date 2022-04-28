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
import { jsx as _jsx } from "react/jsx-runtime";
import React from "react";
var divStyle = {
    padding: '0.25rem'
};
var MenuPath = /** @class */ (function (_super) {
    __extends(MenuPath, _super);
    function MenuPath(props) {
        return _super.call(this, props) || this;
    }
    MenuPath.prototype.getItems = function () {
        var count = 1;
        var items = [];
        for (var _i = 0, _a = this.props.menus; _i < _a.length; _i++) {
            var kv = _a[_i];
            items.push(_jsx("span", { children: _jsx("a", __assign({ href: kv.key }, { children: kv.value }), void 0) }, void 0));
            if (count < this.props.menus.length)
                items.push(_jsx("span", { children: " \u300B" }, void 0));
            count++;
        }
        return items;
    };
    MenuPath.prototype.render = function () {
        return (_jsx("div", __assign({ style: divStyle }, { children: this.getItems().map(function (item) { return item; }) }), void 0));
    };
    return MenuPath;
}(React.Component));
export default MenuPath;
