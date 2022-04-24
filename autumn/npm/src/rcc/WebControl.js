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
var WebControl = /** @class */ (function (_super) {
    __extends(WebControl, _super);
    function WebControl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._isPhone = _this.initIsPhone();
        return _this;
    }
    Object.defineProperty(WebControl.prototype, "isPhone", {
        get: function () { return this._isPhone; },
        enumerable: false,
        configurable: true
    });
    WebControl.prototype.setIsPhone = function (value) {
        this._isPhone = value;
        return this;
    };
    WebControl.prototype.initIsPhone = function () {
        // 部分手机浏览器访问时device可能为pc，所以改成用设备尺寸判断
        var bool = document.body.offsetWidth <= 767;
        //@ts-ignore
        if (window.Application && !bool) {
            //@ts-ignore
            var device = Application.device;
            bool = device == "phone" || device == "weixin" || device == "android"
                || device == "iphone";
        }
        return bool;
    };
    return WebControl;
}(React.Component));
export default WebControl;
