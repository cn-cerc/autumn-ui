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
var ToolPanel = /** @class */ (function (_super) {
    __extends(ToolPanel, _super);
    function ToolPanel(props) {
        return _super.call(this, props) || this;
    }
    ToolPanel.prototype.render = function () {
        return (React.createElement("div", { className: 'aui-toolPanel-main' }, React.Children.map(this.props.children, function (child) { return child; })));
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
        return (React.createElement(React.Fragment, null,
            React.createElement("div", { className: 'aui-toolPanel-toolGroup' },
                React.createElement("div", { className: 'aui-toolPanel-toolTitle' }, this.props.title),
                React.createElement("div", { className: 'aui-toolPanel-toolItems' }, React.Children.map(this.props.children, function (child) { return child; })))));
    };
    return ToolItem;
}(WebControl));
export { ToolItem };
