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
import WebControl from "../rcc/WebControl";
var Loading = /** @class */ (function (_super) {
    __extends(Loading, _super);
    function Loading(props) {
        return _super.call(this, props) || this;
    }
    Loading.prototype.render = function () {
        if ((this.isPhone && !this.props.device) || this.props.device == 'phone') {
            return (_jsx("div", __assign({ className: 'aui-loading-load' }, { children: _jsxs("div", __assign({ className: 'aui-loading-loadContent' }, { children: [_jsx("span", __assign({ className: 'aui-loading-loadSvg' }, { children: _jsx("svg", __assign({ viewBox: "25 25 50 50" }, { children: _jsx("circle", { cx: "50", cy: "50", r: "20", fill: "none" }, void 0) }), void 0) }), void 0), _jsx("span", __assign({ className: 'aui-loading-loadMessage' }, { children: "\u52A0\u8F7D\u4E2D..." }), void 0)] }), void 0) }), void 0));
        }
        else {
            return (_jsxs("div", __assign({ className: 'aui-loading-loadingContainer' }, { children: [_jsx("div", { className: 'aui-loading-loading aui-loading-animation1' }, void 0), _jsx("div", { className: 'aui-loading-loading aui-loading-animation2' }, void 0), _jsx("div", { className: 'aui-loading-loading aui-loading-animation3' }, void 0), _jsx("div", { className: 'aui-loading-loading aui-loading-animation4' }, void 0), _jsx("div", { className: 'aui-loading-loading aui-loading-animation5' }, void 0), _jsx("div", { className: 'aui-loading-loading aui-loading-animation6' }, void 0), _jsx("div", { className: 'aui-loading-loading aui-loading-animation7' }, void 0), _jsx("div", { className: 'aui-loading-loading aui-loading-animation8' }, void 0), _jsx("div", { className: 'aui-loading-loading aui-loading-animation9' }, void 0), _jsx("div", { className: 'aui-loading-loading aui-loading-animation10' }, void 0), _jsx("div", { className: 'aui-loading-loading aui-loading-animation11' }, void 0), _jsx("div", { className: 'aui-loading-loading aui-loading-animation12' }, void 0)] }), void 0));
        }
    };
    return Loading;
}(WebControl));
export { Loading };
