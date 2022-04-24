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
import { jsx as _jsx } from "react/jsx-runtime";
import React from "react";
import WebControl from "./WebControl";
var BaseForm = /** @class */ (function (_super) {
    __extends(BaseForm, _super);
    function BaseForm() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BaseForm.prototype.render = function () {
        document.title = this.props.title;
        return (_jsx(React.Fragment, { children: React.Children.map(this.props.children, function (item) { return item; }) }, void 0));
    };
    return BaseForm;
}(WebControl));
export default BaseForm;
