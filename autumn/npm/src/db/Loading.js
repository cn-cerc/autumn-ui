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
import React from "react";
import WebControl from "../rcc/WebControl";
var Loading = /** @class */ (function (_super) {
    __extends(Loading, _super);
    function Loading(props) {
        return _super.call(this, props) || this;
    }
    Loading.prototype.render = function () {
        if ((this.isPhone && !this.props.device) || this.props.device == 'phone') {
            return (React.createElement("div", { className: 'aui-loading-load' },
                React.createElement("div", { className: 'aui-loading-loadContent' },
                    React.createElement("span", { className: 'aui-loading-loadSvg' },
                        React.createElement("svg", { viewBox: "25 25 50 50" },
                            React.createElement("circle", { cx: "50", cy: "50", r: "20", fill: "none" }))),
                    React.createElement("span", { className: 'aui-loading-loadMessage' }, "\u52A0\u8F7D\u4E2D..."))));
        }
        else {
            return (React.createElement("div", { className: 'aui-loading-loadingContainer' },
                React.createElement("div", { className: 'aui-loading-loading aui-loading-animation1' }),
                React.createElement("div", { className: 'aui-loading-loading aui-loading-animation2' }),
                React.createElement("div", { className: 'aui-loading-loading aui-loading-animation3' }),
                React.createElement("div", { className: 'aui-loading-loading aui-loading-animation4' }),
                React.createElement("div", { className: 'aui-loading-loading aui-loading-animation5' }),
                React.createElement("div", { className: 'aui-loading-loading aui-loading-animation6' }),
                React.createElement("div", { className: 'aui-loading-loading aui-loading-animation7' }),
                React.createElement("div", { className: 'aui-loading-loading aui-loading-animation8' }),
                React.createElement("div", { className: 'aui-loading-loading aui-loading-animation9' }),
                React.createElement("div", { className: 'aui-loading-loading aui-loading-animation10' }),
                React.createElement("div", { className: 'aui-loading-loading aui-loading-animation11' }),
                React.createElement("div", { className: 'aui-loading-loading aui-loading-animation12' })));
        }
    };
    return Loading;
}(WebControl));
export { Loading };
