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
            items.push(React.createElement("span", null,
                React.createElement("a", { href: kv.key }, kv.value)));
            if (count < this.props.menus.length)
                items.push(React.createElement("span", null, " \u300B"));
            count++;
        }
        return items;
    };
    MenuPath.prototype.render = function () {
        return (React.createElement("div", { style: divStyle }, this.getItems().map(function (item) { return item; })));
    };
    return MenuPath;
}(React.Component));
export default MenuPath;
