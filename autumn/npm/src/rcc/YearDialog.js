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
import DataRow from "../db/DataRow";
import DialogComponent from "./DialogComponent";
import { DialogForm } from "./DialogForm";
var YearDialog = /** @class */ (function (_super) {
    __extends(YearDialog, _super);
    function YearDialog() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.onSelect = function (sender) {
            if (_this.props.onSelect) {
                var el = sender.target;
                var row = new DataRow();
                row.setValue('year', el.innerText);
                _this.props.onSelect(row);
            }
            _this.setActive(false);
        };
        return _this;
    }
    YearDialog.prototype.render = function () {
        return (React.createElement(DialogForm, { title: this.props.title, style: this.props.style, active: this.active, setActive: this.setActive },
            React.createElement("ul", { className: 'aui-yearDialog-dialog' },
                React.createElement("li", { onClick: this.onSelect }, "2019"),
                React.createElement("li", { onClick: this.onSelect }, "2020"),
                React.createElement("li", { onClick: this.onSelect }, "2021"))));
    };
    YearDialog.defaultProps = {
        title: '选择年份'
    };
    return YearDialog;
}(DialogComponent));
export default YearDialog;
