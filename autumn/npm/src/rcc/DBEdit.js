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
import DataRow from "../db/DataRow";
var DBEdit = /** @class */ (function (_super) {
    __extends(DBEdit, _super);
    function DBEdit(props) {
        var _this = _super.call(this, props) || this;
        _this.inputOnChange = function (sender) {
            var el = sender.target;
            if (_this.props.dataRow.dataSet) {
                var recNo = _this.props.dataRow.dataSet.locationRow(_this.state.row);
                _this.props.dataRow.dataSet.setRecNo(recNo);
                _this.props.dataRow.dataSet.edit();
            }
            _this.state.row.setValue(_this.props.dataField, el.value);
            _this.setState(_this.state);
            if (_this.props.onChanged)
                _this.props.onChanged(_this.props.dataRow.fields.get(el.name));
        };
        _this.onDialogSelect = function (values) {
            if (values.fields.items.length == 0)
                throw new Error('返回值错误：没有任何字段');
            var dataSet = _this.props.dataRow.dataSet;
            if (dataSet) {
                dataSet.setRecNo(dataSet.locationRow(_this.props.dataRow));
                dataSet.edit();
            }
            for (var _i = 0, _a = values.fields.items; _i < _a.length; _i++) {
                var item = _a[_i];
                _this.state.row.setValue(item.code, values.getString(item.code));
                console.log(_this.state.row);
            }
            _this.setState(_this.state);
            if (_this.props.onChanged)
                _this.props.onChanged(_this.props.dataRow.fields.get(_this.props.dataField));
        };
        var row;
        if (props.dataRow != undefined)
            row = props.dataRow;
        else
            row = new DataRow();
        _this.state = { row: row };
        return _this;
    }
    DBEdit.prototype.render = function () {
        var _this = this;
        var value = this.state.row.getString(this.props.dataField);
        var dataName;
        if (this.props.dataName)
            dataName = (React.createElement("label", { htmlFor: this.props.dataField },
                this.props.dataName,
                "\uFF1A"));
        return (React.createElement("span", { className: "aui-form-main ".concat(this.props.className || '', " ").concat(this.props.type == 'hidden' ? 'aui-hidden' : '') },
            dataName,
            React.createElement("input", { type: this.props.type, autoFocus: this.props.autoFocus, id: this.props.dataField, name: this.props.dataField, value: value, onChange: this.inputOnChange, placeholder: this.props.placeholder, readOnly: this.props.readOnly, onFocus: this.selectAllText
                    .bind(this), onBlur: this.handleBlur.bind(this), autoComplete: this.props.autoComplete ? this.props.autoComplete : 'off', className: this.props.changed ? 'aui-form-changed' : '', onKeyDown: this.handleKeyDown.bind(this) }),
            React.Children.map(this.props.children, function (child) {
                if (isValidElement(child)) {
                    return React.cloneElement(child, { onSelect: _this.onDialogSelect, dataRow: _this.props.dataRow, onChanged: _this.onDialogSelect, dataField: _this.props.dataField });
                }
            })));
    };
    DBEdit.prototype.selectAllText = function (sender) {
        var input = sender.target;
        input.select();
        if (this.props.onFocus)
            this.props.onFocus(sender);
    };
    DBEdit.prototype.handleBlur = function () {
        if (this.props.onBlur)
            this.props.onBlur();
    };
    DBEdit.prototype.handleKeyDown = function (sender) {
        if (this.props.onKeyDown)
            this.props.onKeyDown(sender);
    };
    DBEdit.defaultProps = {
        type: 'text'
    };
    return DBEdit;
}(React.Component));
export default DBEdit;
