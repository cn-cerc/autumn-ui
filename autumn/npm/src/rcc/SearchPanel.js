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
var SearchPanel = /** @class */ (function (_super) {
    __extends(SearchPanel, _super);
    function SearchPanel(props) {
        var _this = _super.call(this, props) || this;
        _this.onChanged = function (meta) {
            _this.setState(_this.state);
        };
        _this.btnExecute = function (sender) {
            sender.preventDefault();
            if (_this.props.onExecute)
                _this.props.onExecute(_this.state.dataRow);
        };
        _this.state = { dataRow: _this.props.dataRow };
        return _this;
    }
    SearchPanel.prototype.render = function () {
        return (React.createElement("form", { className: 'aui-searchPanel-main', role: "searchPanel", onSubmit: this.btnExecute, style: { 'flexDirection': this.isPhone ? 'column' : 'row' } },
            React.createElement("div", { className: this.isPhone ? 'aui-searchPanel-search aui-searchPanel-searchPhone' : 'aui-searchPanel-search' }, this.getItems()),
            React.createElement("button", { onClick: this.btnExecute }, "\u67E5\u8BE2")));
    };
    SearchPanel.prototype.getItems = function () {
        var _this = this;
        var items = [];
        var key = 0;
        React.Children.map(this.props.children, function (child) {
            if (isValidElement(child)) {
                var changed_1 = child.props.onChanged;
                var item = React.cloneElement(child, {
                    key: key++,
                    dataRow: _this.state.dataRow,
                    onChanged: function (meta) {
                        if (changed_1)
                            changed_1();
                        _this.onChanged.bind(_this, meta)();
                    }
                });
                items.push(item);
            }
        });
        return items;
    };
    return SearchPanel;
}(WebControl));
export default SearchPanel;
