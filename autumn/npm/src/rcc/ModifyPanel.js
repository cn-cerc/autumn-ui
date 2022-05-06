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
import React, { isValidElement } from "react";
import WebControl from "./WebControl";
var ModifyPanel = /** @class */ (function (_super) {
    __extends(ModifyPanel, _super);
    function ModifyPanel(props) {
        var _this = _super.call(this, props) || this;
        _this.onChanged = function (meta) {
            _this.setState(_this.state);
        };
        _this.btnExecute = function (sender) {
            var button = sender.target;
            var opera = button.dataset.opera;
            if (_this.props.onExecute) {
                _this.props.onExecute(_this.state.dataRow, opera);
            }
        };
        _this.state = { dataRow: _this.props.dataRow };
        return _this;
    }
    ModifyPanel.prototype.render = function () {
        return (React.createElement("div", { className: 'aui-modifyPanel-main' },
            React.createElement("div", { className: 'aui-modifyPanel-main' }, this.getItems()),
            React.createElement("div", { className: 'aui-modifyPanel-opera' },
                React.createElement("button", { "data-opera": 'save', onClick: this.btnExecute }, "\u4FDD\u5B58"),
                React.createElement("button", { "data-opera": 'final', onClick: this.btnExecute }, "\u751F\u6548"),
                React.createElement("button", { "data-opera": 'unchange', onClick: this.btnExecute }, "\u64A4\u6D88"),
                React.createElement("button", { "data-opera": 'reclace', onClick: this.btnExecute }, "\u4F5C\u5E9F"))));
    };
    ModifyPanel.prototype.getItems = function () {
        var _this = this;
        var items = [];
        var key = 0;
        React.Children.map(this.props.children, function (child) {
            if (isValidElement(child)) {
                var item = React.cloneElement(child, {
                    key: key++,
                    dataRow: _this.state.dataRow, onChanged: _this.onChanged
                });
                items.push(item);
            }
        });
        return items;
    };
    return ModifyPanel;
}(WebControl));
export default ModifyPanel;
