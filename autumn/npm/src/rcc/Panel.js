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
var Panel = /** @class */ (function (_super) {
    __extends(Panel, _super);
    function Panel(props) {
        if (props === void 0) { props = null; }
        return _super.call(this, props) || this;
    }
    Panel.prototype.render = function () {
        return (React.createElement("div", { className: "TPanel" }, React.Children.map(this.props.children, function (child, index) {
            return child;
        })));
    };
    return Panel;
}(React.Component));
export default Panel;
