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
var divStyle = {
    padding: '0.25rem'
};
var DBNavigator = /** @class */ (function (_super) {
    __extends(DBNavigator, _super);
    function DBNavigator(props) {
        var _this = _super.call(this, props) || this;
        _this.onClick = function (el) {
            console.log(_this.props.dataSet.recNo);
            switch (el.target.id) {
                case 'first':
                    _this.props.dataSet.first();
                    break;
                case 'prior':
                    _this.props.dataSet.prior();
                    break;
                case 'next':
                    _this.props.dataSet.next();
                    break;
                case 'last':
                    _this.props.dataSet.last();
                    break;
                default:
                    alert('error');
            }
            var row = _this.props.dataSet.current;
            if (_this.props.onNavigator && row != null)
                _this.props.onNavigator(row);
        };
        return _this;
    }
    DBNavigator.prototype.render = function () {
        return (_jsxs("div", __assign({ style: divStyle }, { children: [_jsx("button", __assign({ id: 'first', onClick: this.onClick }, { children: "\u7B2C\u4E00\u7B14" }), void 0), _jsx("button", __assign({ id: 'prior', onClick: this.onClick }, { children: "\u4E0A\u7B14" }), void 0), _jsx("button", __assign({ id: 'next', onClick: this.onClick }, { children: "\u4E0B\u7B14" }), void 0), _jsx("button", __assign({ id: 'last', onClick: this.onClick }, { children: "\u6700\u540E\u4E00\u7B14" }), void 0)] }), void 0));
    };
    return DBNavigator;
}(React.Component));
export default DBNavigator;
