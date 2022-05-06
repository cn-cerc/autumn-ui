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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import React, { isValidElement } from "react";
import DataRow from "../db/DataRow";
import { Column, ColumnType } from "./DBGrid";
var ComboBox = /** @class */ (function (_super) {
    __extends(ComboBox, _super);
    function ComboBox(props) {
        var _this = _super.call(this, props) || this;
        _this.inputOnChange = function (sender) {
            var el = sender.target;
            var filterText = el.value;
            var site = { top: -1, left: -1 };
            if (filterText.length >= 3) {
                var pos = el.getBoundingClientRect();
                site = { top: pos.top + pos.height, left: pos.left };
            }
            _this.state.dataRow.setValue(_this.props.dataField, filterText);
            _this.setState(__assign(__assign({}, _this.state), { site: site, filterText: filterText }));
            if (_this.props.onChanged)
                _this.props.onChanged(_this.props.dataRow.fields.get(el.name));
        };
        _this.onListSelect = function (values) {
            if (values.fields.items.length == 0)
                throw new Error('返回值错误：没有任何字段');
            var value = values.getString(values.fields.items[0].code);
            _this.state.dataRow.setValue(_this.props.dataField, value);
            _this.setState(_this.state);
            if (_this.props.onChanged)
                _this.props.onChanged(_this.props.dataRow.fields.get(_this.props.dataField));
        };
        var row;
        if (props.dataRow != undefined)
            row = props.dataRow;
        else
            row = new DataRow();
        _this.state = { dataRow: row, site: { top: -1, left: -1 }, filterText: '', showTable: false };
        return _this;
    }
    ComboBox.prototype.render = function () {
        var _this = this;
        var value = this.state.dataRow.getString(this.props.dataField);
        var dataName;
        if (this.props.dataName)
            dataName = (React.createElement("label", { htmlFor: this.props.dataField },
                this.props.dataName,
                "\uFF1A"));
        return (React.createElement("span", { className: "comboBox" },
            dataName,
            React.createElement("input", { type: "text", autoFocus: this.props.autoFocus, id: this.props.dataField, name: this.props.dataField, value: value, onChange: this.inputOnChange, onFocus: this.handleFocus.bind(this), placeholder: this.props.placeholder }),
            React.Children.map(this.props.children, function (child) {
                if (_this.state.site.left > -1) {
                    if (isValidElement(child)) {
                        return React.cloneElement(child, {
                            onSelect: _this.onListSelect, site: _this.state.site,
                            filterText: _this.state.filterText,
                            showTable: _this.state.showTable
                        });
                    }
                }
            })));
    };
    ComboBox.prototype.handleFocus = function () {
        this.setState({
            showTable: true
        });
    };
    ComboBox.prototype.componentDidMount = function () {
        var _this = this;
        document.addEventListener("click", function (e) {
            if ($(e.target).closest(".comboBox").length === 0) {
                _this.setState({
                    showTable: false
                });
            }
        });
    };
    return ComboBox;
}(React.Component));
export default ComboBox;
var ListGrid = /** @class */ (function (_super) {
    __extends(ListGrid, _super);
    function ListGrid(props) {
        var _this = _super.call(this, props) || this;
        _this.onTrClick = function (sender) {
            if (!_this.props.onRowClick)
                return;
            var tr = sender.target.parentElement;
            var row = new DataRow();
            for (var i = 0; i < tr.children.length; i++) {
                var td = tr.children[i];
                var field = td.getAttribute('data-field');
                var value = td.innerHTML;
                if (field)
                    row.setValue(field, value);
            }
            _this.props.onRowClick(row);
        };
        _this.state = { dataSet: _this.props.dataSet };
        return _this;
    }
    ListGrid.prototype.render = function () {
        return (React.createElement("table", { className: 'aui-comboBox-grid' },
            React.createElement("tbody", null, this.getRows().map(function (item) { return item; }))));
    };
    ListGrid.prototype.getRows = function () {
        var items = [];
        var recNo = 0;
        for (var _i = 0, _a = this.state.dataSet.records; _i < _a.length; _i++) {
            var row = _a[_i];
            recNo++;
            if (this.props.onFilter(row)) {
                items.push(React.createElement("tr", { key: items.length, onClick: this.onTrClick }, this.getRow(row, recNo).map(function (item) { return item; })));
            }
        }
        return items;
    };
    ListGrid.prototype.getRow = function (dataRow, recNo) {
        var items = [];
        React.Children.map(this.props.children, function (child) {
            if (isValidElement(child) && child.type == Column)
                items.push(React.cloneElement(child, {
                    tag: ColumnType.td, key: child.props.code, dataRow: dataRow,
                    recNo: recNo
                }));
        });
        return items;
    };
    ListGrid.defaultProps = {
        readOnly: true
    };
    return ListGrid;
}(React.Component));
export { ListGrid };
