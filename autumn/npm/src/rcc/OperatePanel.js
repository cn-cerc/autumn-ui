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
import WebControl from "./WebControl";
var OperatePanel = /** @class */ (function (_super) {
    __extends(OperatePanel, _super);
    function OperatePanel(props) {
        return _super.call(this, props) || this;
    }
    OperatePanel.prototype.render = function () {
        return (React.createElement("div", { className: 'aui-operatePanel-main' }, React.Children.map(this.props.children, function (child) { return child; })));
    };
    return OperatePanel;
}(WebControl));
export default OperatePanel;
