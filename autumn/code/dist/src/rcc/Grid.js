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
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import KeyValue from '../db/KeyValue';
import MutiPage, { DefaultPageSize, USER_PAGE_SIZE_KEY } from './MutiPage';
var defaultProps = {
    id: ''
};
var Grid = /** @class */ (function (_super) {
    __extends(Grid, _super);
    function Grid(props) {
        var _this = _super.call(this, props) || this;
        _this.onPageChanged = function (beginPoint, endPoint) {
            _this.setState(__assign(__assign({}, _this.state), { beginPoint: beginPoint, endPoint: endPoint }));
        };
        var value = localStorage.getItem(USER_PAGE_SIZE_KEY);
        _this.size = Number(value);
        if (!_this.size) {
            _this.size = DefaultPageSize;
            localStorage.setItem(USER_PAGE_SIZE_KEY, String(_this.size));
        }
        _this.state = { beginPoint: 1, endPoint: _this.size };
        $("#page").css({
            "height": "0",
            "flex": "1",
            "display": "flex",
            "flex-direction": "column"
        });
        _this.props.setChild(_this);
        return _this;
    }
    Grid.prototype.render = function () {
        return (_jsxs("div", __assign({ className: 'aui-grid-main', role: 'grid' }, { children: [_jsx("table", { children: _jsxs("tbody", { children: [_jsx("tr", { children: this.getTitles().map(function (item) { return item; }) }, void 0), this.getRows().map(function (item) { return item; })] }, void 0) }, void 0), this.getNavigator()] }), void 0));
    };
    Grid.prototype.getTitles = function () {
        var _this = this;
        var items = [];
        if (this.props.config != null) {
            var total = this.props.config.getTotalWidth();
            var _loop_1 = function (column) {
                if (column.visible) {
                    var title = column.name ? column.name : column.code;
                    var style = {};
                    if (total > 0 && column.width > 0) {
                        var rate = column.width / total * 100;
                        var width = rate.toFixed(1) + "%";
                        style = __assign(__assign({}, style), { width: width });
                    }
                    //
                    items.push(_jsx("th", __assign({ style: style, onClick: function (e) { return _this.gridSort(e, column.code); } }, { children: title }), column.code));
                }
            };
            for (var _i = 0, _a = this.props.config.columns; _i < _a.length; _i++) {
                var column = _a[_i];
                _loop_1(column);
            }
        }
        return items;
    };
    Grid.prototype.getRows = function () {
        var items = [];
        var ds = this.props.dataSet;
        var recNo = ds.recNo;
        for (var i = this.state.beginPoint; i <= this.state.endPoint; i++) {
            if (i > ds.size)
                break;
            ds.setRecNo(i);
            this.props.config.setCurrent(ds.current);
            items.push(this.getMasterRow(ds.current));
            for (var _i = 0, _a = this.props.config.children; _i < _a.length; _i++) {
                var child = _a[_i];
                items.push(this.getChildRow(child, ds.current));
            }
        }
        ds.setRecNo(recNo);
        return items;
    };
    Grid.prototype.getMasterRow = function (dataRow) {
        var key = "master_" + dataRow.dataSet.recNo;
        var items = [];
        for (var _i = 0, _a = this.props.config.columns; _i < _a.length; _i++) {
            var column = _a[_i];
            if (column.visible) {
                if (column.onRender) {
                    items.push(_jsx("td", __assign({ role: column.code }, { children: column.onRender(column, dataRow) }), column.code));
                }
                else {
                    var value = dataRow.getText(column.code);
                    var style = {};
                    if (column.align)
                        style = __assign(__assign({}, style), { textAlign: column.align });
                    items.push(_jsx("td", __assign({ style: style, role: column.code }, { children: value }), column.code));
                }
            }
        }
        return _jsx("tr", __assign({ id: "tr" + dataRow.dataSet.recNo }, { children: items }), key);
    };
    Grid.prototype.getChildRow = function (child, dataRow) {
        child.setCurrent(dataRow);
        var key = "child_" + dataRow.dataSet.recNo;
        var value = "";
        for (var _i = 0, _a = child.columns; _i < _a.length; _i++) {
            var column = _a[_i];
            if (column.visible) {
                var text = dataRow.getText(column.code);
                if (text)
                    value = value + column.name + ": " + text + " ";
            }
        }
        var display = new KeyValue(child.visible);
        if (child.onOutput)
            child.onOutput(child, display);
        var style = {};
        if (!display.asBoolean())
            style = { display: 'none' };
        var colSpan = this.props.config.columns.length;
        var id = "tr" + dataRow.dataSet.recNo + "_1";
        return (_jsx("tr", __assign({ id: id, style: style }, { children: _jsx("td", __assign({ colSpan: colSpan }, { children: value }), void 0) }), key));
    };
    Grid.prototype.getNavigator = function () {
        var _this = this;
        if (this.props.config.dataSet.size <= this.size)
            return null;
        return (_jsx(MutiPage, { ref: function (self) { return _this.mutiPage = self; }, total: this.props.config.dataSet.size, onPageChanged: this.onPageChanged }, void 0));
    };
    Grid.prototype.gridSort = function (render, code) {
        var _a;
        if (this.props.sortFilter)
            code = this.props.sortFilter(code);
        var codes = code.split(',');
        var sort = '';
        // 第一次升序↑，第二次降序
        var th = render.currentTarget;
        var span = th.querySelector('span');
        var sorts = document.getElementsByClassName('aui-grid-sort');
        for (var i = 0; i < sorts.length; i++) {
            if (sorts[i] != span)
                sorts[i].remove();
        }
        codes.forEach(function (code, index) {
            if (!span)
                codes[index] = code + " ASC";
            else {
                if (span.innerHTML == '↑')
                    codes[index] = code + " DESC";
                else
                    codes[index] = code + " ASC";
            }
        });
        if (!span) {
            var span_1 = document.createElement('span');
            span_1.setAttribute('class', 'aui-grid-sort');
            span_1.innerText = '↑';
            th.appendChild(span_1);
        }
        else {
            if (span.innerHTML == '↑') {
                span.innerHTML = '↓';
            }
            else {
                span.innerHTML = '↑';
            }
        }
        this.props.dataSet.clear();
        this.props.dataSet.appendDataSet(this.props.config.dataSet);
        (_a = this.props.dataSet).setSort.apply(_a, codes);
        if (this.mutiPage)
            this.mutiPage.reload();
        this.setState(__assign(__assign({}, this.state), { beginPoint: 1, endPoint: this.size }));
    };
    Grid.prototype.initGrid = function () {
        this.setState({
            beginPoint: 1,
            endPoint: this.size
        });
    };
    Grid.prototype.componentDidUpdate = function (prevProps, prevState, snapshot) {
        var trList = document.querySelectorAll('tr[id*="tr"]');
        trList.forEach(function (tr) {
            var id = tr.getAttribute('id').replace('tr', "").split('.');
            if (Number(id) % 2 == 0)
                tr.style.backgroundColor = '#fafafa';
        });
    };
    Grid.defaultProps = defaultProps;
    return Grid;
}(React.Component));
export default Grid;
