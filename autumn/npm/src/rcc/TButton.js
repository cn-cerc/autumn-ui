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
var TButton = /** @class */ (function (_super) {
    __extends(TButton, _super);
    function TButton(props) {
        return _super.call(this, props) || this;
    }
    TButton.prototype.render = function () {
        return (React.createElement("button", { onClick: this.props.onClick }, React.Children.map(this.props.children, function (child) { return child; })));
    };
    return TButton;
}(React.Component));
export default TButton;
