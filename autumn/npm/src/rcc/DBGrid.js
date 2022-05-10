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
import DataSet from "../db/DataSet";
import { Line } from "./Block";
import DBEdit from "./DBEdit";
import MutiPage, { DefaultPageSize, USER_PAGE_SIZE_KEY } from "./MutiPage";
import WebControl from "./WebControl";
var DBGrid = /** @class */ (function (_super) {
    __extends(DBGrid, _super);
    function DBGrid(props) {
        var _this = _super.call(this, props) || this;
        _this.onTrClick = function (recNo, sender) {
            if (_this.props.allowCheck) {
                _this.state.direction[0] = recNo;
                var arr = Array.from(_this.allowMap.values());
                for (var i = 1; i <= arr.length; i++) {
                    if (arr[i - 1].key == sender.target.getAttribute('data-field'))
                        _this.state.direction[1] = i;
                }
                _this.setState({
                    allowInput: false
                });
            }
            if (!_this.props.onRowClick)
                return;
            _this.props.dataSet.setRecNo(recNo);
            _this.props.onRowClick(_this.props.dataSet.current, sender);
        };
        _this.onChanged = function (recNo, field, value) {
            _this.props.dataSet.setRecNo(recNo);
            var row = _this.props.dataSet.current;
            var oldValue = row.getValue(field);
            row.setValue(field, value);
            if (_this.props.onChanged)
                _this.props.onChanged(row, field, oldValue);
            _this.setState(_this.state);
        };
        _this.onPageChanged = function (beginPoint, endPoint) {
            _this.setState(__assign(__assign({}, _this.state), { beginPoint: beginPoint, endPoint: endPoint }));
        };
        var value = localStorage.getItem(USER_PAGE_SIZE_KEY);
        _this.size = Number(value);
        if (!_this.size) {
            _this.size = DefaultPageSize;
            localStorage.setItem(USER_PAGE_SIZE_KEY, String(_this.size));
        }
        _this.state = {
            allWidth: _this.getAllWidth(),
            beginPoint: 1,
            endPoint: _this.props.openPage ? _this.size : _this.props.dataSet.size,
            sortData: {
                code: '',
                sortType: null
            },
            direction: [0, 0],
            allowInput: false,
            isInput: false
        };
        _this.initColumnMap();
        return _this;
    }
    DBGrid.prototype.componentDidUpdate = function (prevProps) {
        if (this.props.dataSet.size !== prevProps.dataSet.size) {
            if (!this.size) {
                this.size = DefaultPageSize;
                localStorage.setItem(USER_PAGE_SIZE_KEY, String(this.size));
            }
            this.setState(__assign(__assign({}, this.state), { beginPoint: 1, endPoint: this.props.openPage ? this.size : this.props.dataSet.size }));
        }
    };
    DBGrid.prototype.initColumnMap = function () {
        var _this = this;
        this.colunmMap = new Map();
        this.allowMap = new Map();
        React.Children.map(this.props.children, function (child) {
            if (isValidElement(child)) {
                // @ts-ignore
                var className = child.type.className || '';
                if (className == Column.className) {
                    _this.colunmMap.set(child.props.code, React.cloneElement(child, { tag: ColumnType.td, key: child.props.code }));
                    if (child.props.allowCheck)
                        _this.allowMap.set(child.props.code, React.cloneElement(child, { tag: ColumnType.td, key: child.props.code }));
                }
            }
        });
    };
    DBGrid.prototype.render = function () {
        var _this = this;
        this.children = [];
        this.allowChildren = [];
        if (this.props.dataSet == undefined)
            return (React.createElement("div", null, "props.dataSet is undefined"));
        return (React.createElement("div", { className: "aui-dbgrid-main ".concat(this.props.className || ''), ref: function (self) { return _this.self = self; }, role: "dbgrid", onKeyDown: this.handleKeyDown.bind(this), tabIndex: 1 },
            React.createElement("table", null,
                React.createElement("tbody", null,
                    React.createElement("tr", { key: 'head' }, this.getHead()),
                    this.getRows())),
            this.getNavigator()));
    };
    DBGrid.prototype.getHead = function () {
        var _this = this;
        var items = [];
        var arr = Array.from(this.colunmMap.values());
        React.Children.map(this.props.children, function (child) {
            if (isValidElement(child)) {
                // @ts-ignore
                var className = child.type.className || '';
                if (className == MainRow.className) {
                    items.push(React.cloneElement(child, { key: "head_".concat(child.props.code), tag: ColumnType.th }));
                }
            }
        });
        if (this.props.dataJson) {
            var dataSet_1 = new DataSet();
            dataSet_1.setJson(this.props.dataJson);
            dataSet_1.first();
            while (dataSet_1.fetch()) {
                arr.forEach(function (child) {
                    if (isValidElement(child)) {
                        if (child.props.code == dataSet_1.getString('field')) {
                            items.push(React.cloneElement(child, { tag: ColumnType.th, width: _this.getWidth(child.props.width), visible: dataSet_1.getString('visible') == 'true' ? true : false, setSort: _this.setSort.bind(_this), sortType: child.props.code == _this.state.sortData.code ? _this.state.sortData.sortType : null }));
                        }
                    }
                });
            }
        }
        else {
            arr.forEach(function (child) {
                if (isValidElement(child)) {
                    items.push(React.cloneElement(child, { tag: ColumnType.th, width: _this.getWidth(child.props.width), setSort: _this.setSort.bind(_this), sortType: child.props.code == _this.state.sortData.code ? _this.state.sortData.sortType : null }));
                }
            });
        }
        return items;
    };
    DBGrid.prototype.getRows = function () {
        var _this = this;
        var items = [];
        var ds = this.props.dataSet;
        var _loop_1 = function (i) {
            if (i > ds.size)
                return "break";
            ds.setRecNo(i);
            var recNo = ds.recNo;
            var dataRow = ds.current;
            React.Children.map(this_1.props.children, function (child) {
                if (isValidElement(child)) {
                    // @ts-ignore
                    var className = child.type.className || '';
                    if (className == MainRow.className) {
                        items.push(React.createElement("tr", { key: "master_".concat(recNo), onClick: _this.onTrClick.bind(_this, recNo), "data-key": "master_".concat(recNo), className: "".concat(recNo % 2 == 0 ? 'aui-dbgrid-evenLine' : '', " ").concat(child.props.dynamicClass(dataRow) || '') }, React.cloneElement(child, { onChangedOwner: _this.onChanged, dataRow: dataRow, recNo: recNo })));
                    }
                }
            });
            if (this_1.colunmMap.size > 0) {
                var childArr = this_1.getRow(dataRow, recNo);
                var allChildArr = childArr.filter(function (child) {
                    return isValidElement(child) && child.props.allowCheck;
                });
                //输出主行
                items.push(React.createElement("tr", { key: "master_".concat(recNo), onClick: this_1.onTrClick.bind(this_1, recNo), "data-key": "master_".concat(recNo), className: recNo % 2 == 0 ? 'aui-dbgrid-evenLine' : '' }, childArr));
                this_1.children.push(childArr);
                this_1.allowChildren.push(allChildArr);
            }
            //输出子行 
            var colSpan = 0;
            React.Children.map(this_1.props.children, function (child) {
                if (isValidElement(child)) {
                    // @ts-ignore
                    var className = child.type.className || '';
                    if (className == Column.className) {
                        colSpan++;
                    }
                }
            });
            var total = 0;
            React.Children.map(this_1.props.children, function (child) {
                if (isValidElement(child) && child.type == ChildRow) {
                    var isHide_1 = true;
                    if (child.props.autoJudge) {
                        React.Children.map(child.props.children, function (item) {
                            if (item && dataRow.has(item.props.code) && isHide_1) {
                                isHide_1 = false;
                            }
                        });
                    }
                    total++;
                    var key = "".concat(recNo, ".").concat(total);
                    var display = 'table-row';
                    if (child.props.visible || (child.props.autoJudge && isHide_1))
                        display = 'none';
                    items.push(React.createElement("tr", { key: "child_".concat(key), "data-key": "child_".concat(key), onClick: _this.onTrClick.bind(_this, recNo), style: { 'display': display }, className: recNo % 2 == 0 ? 'aui-dbgrid-evenLine' : '' }, React.cloneElement(child, { key: child.props.code, colSpan: colSpan, dataRow: dataRow })));
                }
            });
        };
        var this_1 = this;
        for (var i = this.state.beginPoint; i <= this.state.endPoint; i++) {
            var state_1 = _loop_1(i);
            if (state_1 === "break")
                break;
        }
        return items;
    };
    DBGrid.prototype.handleKeyDown = function (sender) {
        var _this = this;
        if (this.props.onKeyDown)
            this.props.onKeyDown(sender);
        else {
            if (!this.state.direction[0] || !this.state.direction[1])
                return;
            var element = this.allowChildren[this.state.direction[0] - 1][this.state.direction[1] - 1];
            if (!isValidElement(element))
                return;
            if (!this.state.allowInput) {
                var keyCode = sender.keyCode;
                var allowInput = false;
                if (keyCode == 37)
                    this.state.direction[1] = this.state.direction[1] - 1 || 1;
                if (keyCode == 38)
                    this.state.direction[0] = this.state.direction[0] - 1 || 1;
                if (keyCode == 39)
                    this.state.direction[1] = this.state.direction[1] + 1 > this.allowMap.size ? this.allowMap.size : this.state.direction[1] + 1;
                if (keyCode == 40)
                    this.state.direction[0] = this.state.direction[0] + 1 > this.props.dataSet.size ? this.props.dataSet.size : this.state.direction[0] + 1;
                if (keyCode == 13 && !element.props.enterEvent)
                    allowInput = true;
                if (element.props.enterEvent && !allowInput && keyCode == 13)
                    element.props.enterEvent(this.state.direction[0]);
                this.setState({
                    allowInput: allowInput
                });
            }
            else {
                var keyCode = sender.keyCode;
                if (keyCode == 13) {
                    sender.preventDefault();
                    var tr = this.self.querySelectorAll("tr[data-key^=\"master_\"]")[this.state.direction[0] - 1];
                    var td = tr.querySelector("td[data-field='".concat(element.props.code, "']"));
                    this.props.dataSet.records[this.state.direction[0] - 1].setValue(element.props.code, td.innerText);
                    this.setState({
                        allowInput: false,
                        isInput: false
                    }, function () {
                        _this.self.focus();
                    });
                }
            }
        }
    };
    DBGrid.prototype.getRow = function (dataRow, recNo) {
        var _this = this;
        var items = [];
        var arr = Array.from(this.colunmMap.values());
        if (this.props.dataJson) {
            var dataSet_2 = new DataSet();
            dataSet_2.setJson(this.props.dataJson);
            dataSet_2.first();
            while (dataSet_2.fetch()) {
                arr.forEach(function (child) {
                    if (isValidElement(child)) {
                        if (child.props.code == dataSet_2.getString('field')) {
                            items.push(React.cloneElement(child, { onChangedOwner: _this.onChanged, dataRow: dataRow, recNo: recNo, visible: dataSet_2.getString('visible') == 'true' ? true : false, setSort: _this.setSort.bind(_this), sortType: child.props.code == _this.state.sortData.code ? _this.state.sortData.sortType : null }));
                        }
                    }
                });
            }
        }
        else {
            arr.forEach(function (child) {
                if (isValidElement(child)) {
                    var checked = _this.getChecked(child.key, recNo);
                    var allowInput = _this.getAllowInput(child.key, recNo);
                    items.push(React.cloneElement(child, { onChangedOwner: _this.onChanged, dataRow: dataRow, recNo: recNo, checked: checked, allowInput: allowInput, onChangeInput: _this.changeIsInput.bind(_this), setSort: _this.setSort.bind(_this), sortType: child.props.code == _this.state.sortData.code ? _this.state.sortData.sortType : null }));
                }
            });
        }
        return items;
    };
    DBGrid.prototype.getChecked = function (key, recNo) {
        var _this = this;
        var bool = false;
        var arr = Array.from(this.allowMap.values());
        arr.forEach(function (child, index) {
            if (isValidElement(child)) {
                if (child.key == key && recNo == _this.state.direction[0] && (index + 1) == _this.state.direction[1])
                    bool = true;
            }
        });
        return bool;
    };
    DBGrid.prototype.getAllowInput = function (key, recNo) {
        var _this = this;
        var bool = false;
        var arr = Array.from(this.allowMap.values());
        arr.forEach(function (child, index) {
            if (isValidElement(child)) {
                if (child.key == key && recNo == _this.state.direction[0] && (index + 1) == _this.state.direction[1] && _this.state.allowInput)
                    bool = true;
            }
        });
        return bool;
    };
    DBGrid.prototype.getNavigator = function () {
        if (!this.props.openPage || this.props.dataSet.size <= this.size)
            return null;
        return (React.createElement(MutiPage, { total: this.props.dataSet.size, onPageChanged: this.onPageChanged }));
    };
    DBGrid.prototype.getAllWidth = function () {
        var width = 0;
        React.Children.map(this.props.children, function (child) {
            if (isValidElement(child)) {
                // @ts-ignore
                var className = child.type.className || '';
                if (className == Column.className) {
                    width += Number(child.props.width);
                }
            }
        });
        return width;
    };
    DBGrid.prototype.getWidth = function (width) {
        return (Number(width) / this.state.allWidth) * 100 + "%";
    };
    DBGrid.prototype.componentWillUnmount = function () {
        var _this = this;
        var mainArr = document.querySelectorAll(".aui-dbgrid-main");
        mainArr.forEach(function (main) {
            main.removeEventListener('keydown', _this.handleInputKeydown.bind(_this));
        });
    };
    // 绑定输入框事件
    DBGrid.prototype.bindInputEvent = function () {
        var mainArr = document.querySelectorAll(".aui-dbgrid-main");
        mainArr[mainArr.length - 1].addEventListener('keydown', this.handleInputKeydown.bind(this));
    };
    DBGrid.prototype.handleInputKeydown = function (e) {
        var _this = this;
        if (e.target.tagName.toLowerCase() == 'input') {
            var element = e.target;
            var keyCode = 0;
            keyCode = e.keyCode - 37;
            if (keyCode < 0 || keyCode > 3)
                return;
            var tr = element.closest('tr');
            var isMaster = tr.getAttribute('data-key').indexOf('master') > -1;
            if (keyCode % 2 == 0) {
                if (isMaster) {
                    var items = element.closest('tr').querySelectorAll('input');
                    var index = 0;
                    for (var i = 0; i < items.length; i++) {
                        if (items[i] == element)
                            index = i;
                        continue;
                    }
                    index = keyCode == 0 ? index - 1 : index + 1;
                    var cursor = element;
                    if ((cursor.selectionStart == 0 && keyCode == 0) || (cursor.selectionStart == cursor.value.length && keyCode == 2)) {
                        var input = items[index];
                        e.preventDefault();
                        if (input) {
                            if (e.ctrlKey)
                                this.initDataSet(input, element, index);
                            input.focus();
                        }
                    }
                }
            }
            else {
                var items = document.querySelectorAll(".aui-dbgrid-main input[name='".concat(element.getAttribute('name'), "']"));
                var index = 0;
                for (var i = 0; i < items.length; i++) {
                    if (items[i] == element)
                        index = i;
                    continue;
                }
                index = keyCode == 1 ? index - 1 : index + 1;
                var input = items[index];
                e.preventDefault();
                if (input) {
                    if (e.ctrlKey)
                        this.initDataSet(input, element, index);
                    input.focus();
                }
            }
        }
        else if (e.keyCode == 13) {
            e.preventDefault();
            this.setState({
                allowInput: !this.state.allowInput
            }, function () {
                if (!_this.state.allowInput)
                    _this.self.focus();
            });
        }
    };
    DBGrid.prototype.initDataSet = function (input, element, index) {
        input.value = element.value;
        if (this.props.dataSet.records[index].dataSet) {
            var row = this.props.dataSet.records[index];
            row.dataSet.setRecNo(index);
            row.dataSet.edit.bind(row)();
        }
        this.props.dataSet.records[index].setValue(element.name, element.value);
    };
    DBGrid.prototype.setSort = function (code, sortString) {
        var _a;
        if (!this.props.allowSort)
            return;
        var sortType = 'asc';
        if (this.state.sortData.code == code)
            sortType = this.state.sortData.sortType == 'asc' ? 'desc' : 'asc';
        var sort = [];
        if (sortString) {
            var sortArr = sortString.split(',');
            sortArr.forEach(function (sortCode) {
                sort.push("".concat(sortCode, " ").concat(sortType));
            });
        }
        else
            sort = ["".concat(code, " ").concat(sortType)];
        if (code == '_it_' && this.state.sortData.sortType)
            this.props.dataSet.reverse();
        else
            (_a = this.props.dataSet).setSort.apply(_a, sort);
        this.setState({
            sortData: {
                code: code,
                sortType: sortType
            }
        });
    };
    DBGrid.prototype.resetDirection = function () {
        this.setState({
            direction: [0, 0]
        });
    };
    DBGrid.prototype.changeIsInput = function (bool) {
        this.setState({
            isInput: bool
        });
    };
    DBGrid.defaultProps = {
        readOnly: true,
        openPage: true,
    };
    return DBGrid;
}(WebControl));
export default DBGrid;
export var ColumnType;
(function (ColumnType) {
    ColumnType[ColumnType["th"] = 0] = "th";
    ColumnType[ColumnType["td"] = 1] = "td";
    ColumnType[ColumnType["span"] = 2] = "span";
})(ColumnType || (ColumnType = {}));
var Column = /** @class */ (function (_super) {
    __extends(Column, _super);
    function Column(props) {
        var _this = _super.call(this, props) || this;
        _this.onChanged = function (meta) {
            _this.setState(_this.state);
            if (_this.props.dataRow && _this.props.recNo) {
                if (_this.props.onChangedOwner)
                    _this.props.onChangedOwner(_this.props.recNo, meta.code, _this.state.dataRow.getValue(meta.code));
                if (_this.props.onChanged)
                    _this.props.onChanged(_this.props.recNo, meta.code, _this.state.dataRow.getValue(meta.code));
            }
        };
        _this.state = {
            dataRow: _this.props.dataRow
        };
        return _this;
    }
    Column.prototype.componentWillReceiveProps = function () {
        var _this = this;
        setTimeout(function () {
            if (_this.props.allowInput) {
                _this.setState(__assign({}, _this.state), function () {
                    if (_this.self) {
                        var range = document.createRange();
                        range.selectNodeContents(_this.self);
                        var sel = window.getSelection();
                        sel.removeAllRanges();
                        sel.addRange(range);
                    }
                });
            }
        }, 100);
    };
    Column.prototype.render = function () {
        if (this.props.recNo)
            this.props.dataRow.dataSet.setRecNo(this.props.recNo);
        if (this.props.customText && this.props.tag != ColumnType.th) {
            var child = this.props.customText(this.props.dataRow);
            if (this.props.tag == ColumnType.td)
                return React.createElement("td", { "data-field": this.props.code, className: "".concat(this.props.checked ? 'aui-dbgrid-columnCheck' : ''), colSpan: this.props.colSpan, align: this.props.textAlign ? this.props.textAlign : 'left', style: { 'display': this.props.visible ? 'none' : 'table-cell' } }, child);
            else
                return React.createElement("span", { className: 'aui-dbgrid-inline', style: { 'width': this.props.width, 'textAlign': this.props.textAlign } },
                    this.props.name ? this.props.name + '：' : '',
                    child);
        }
        switch (this.props.tag) {
            case ColumnType.th:
                return (React.createElement("th", { style: { "width": this.props.width, 'display': this.props.visible ? 'none' : 'table-cell' }, onClick: this.setSort.bind(this) },
                    this.props.name,
                    this.getArrow()));
            case ColumnType.td: {
                return this.getTd();
            }
            case ColumnType.span: {
                return (React.createElement("span", { className: 'aui-dbgrid-inline', style: { "width": this.props.width } },
                    this.props.name ? this.props.name + '：' : '',
                    this.props.dataRow ? this.getValue() : ''));
            }
            default:
                throw Error('不支持的输出类型');
        }
    };
    Column.prototype.getTd = function () {
        var _this = this;
        return (React.createElement("td", { "data-field": this.props.code, className: "".concat(this.props.checked ? 'aui-dbgrid-columnCheck' : ''), colSpan: this.props.colSpan, align: this.props.textAlign ? this.props.textAlign : "left", style: { 'display': this.props.visible ? 'none' : 'table-cell' }, contentEditable: this.props.allowInput, onFocus: this.handleFocus.bind(this), ref: function (self) { return _this.self = self; }, onBlur: this.handleBlur.bind(this), onClick: this.handleClick.bind(this) }, this.getValue()));
    };
    Column.prototype.getValue = function () {
        if (!this.props.children) {
            var value = '';
            if (this.props.dataRow)
                value = this.props.dataRow.getString(this.props.code);
            return value;
        }
        return (React.createElement(React.Fragment, null, this.getContent().map(function (item) { return item; })));
    };
    Column.prototype.getContent = function () {
        var _this = this;
        var items = [];
        React.Children.map(this.props.children, function (child) {
            if (isValidElement(child)) {
                var bool = false;
                if (child.type == DBEdit && _this.state.dataRow.history)
                    bool = _this.state.dataRow.getString(child.props.dataField) != _this.state.dataRow.history.getString(child.props.dataField);
                items.push(React.cloneElement(child, {
                    key: items.length, dataRow: _this.state.dataRow,
                    onChanged: _this.onChanged,
                    changed: bool
                }));
            }
        });
        return items;
    };
    Column.prototype.setSort = function () {
        if (this.props.setSort)
            this.props.setSort(this.props.code, this.props.customSort);
    };
    Column.prototype.getArrow = function () {
        if (this.props.sortType) {
            var arrow = this.props.sortType == 'desc' ? '↓' : '↑';
            return React.createElement("span", { style: { 'color': 'red' } }, arrow);
        }
    };
    Column.prototype.handleFocus = function () {
        if (this.props.allowInput) {
            var range = document.createRange();
            range.selectNodeContents(this.self);
            var sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
            if (this.props.onChangeInput)
                this.props.onChangeInput(true);
        }
    };
    Column.prototype.handleBlur = function (e) {
        if (this.props.allowInput) {
            var text = e.target.innerText;
            this.props.dataRow.setValue(this.props.code, text);
            if (this.props.onChangeInput)
                this.props.onChangeInput(false);
        }
    };
    Column.prototype.handleClick = function (e) {
        if (this.props.allowInput) {
            e.preventDefault();
            e.stopPropagation();
        }
    };
    Column.className = "Column";
    Column.defaultProps = {
        tag: ColumnType.td,
        colSpan: 1
    };
    return Column;
}(WebControl));
export { Column };
var ChildRow = /** @class */ (function (_super) {
    __extends(ChildRow, _super);
    function ChildRow() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ChildRow.prototype.render = function () {
        var _this = this;
        var items = [];
        var oldItems = this.props.children.length || 1;
        var childNum = 0;
        React.Children.map(this.props.children, function (child) {
            childNum++;
            // @ts-ignore
            if (isValidElement(child) && child.type == Column) {
                var colSpan = child.props.colSpan;
                if (childNum == oldItems)
                    colSpan = _this.props.colSpan - oldItems + 1;
                items.push(React.cloneElement(child, {
                    tag: ColumnType.td, key: child.props.code, dataRow: _this.props.dataRow,
                    colSpan: colSpan,
                    visible: _this.props.visible
                }));
            }
            else if (isValidElement(child) && child.type == Line) {
                items.push(React.cloneElement(child, {
                    key: child.props.code, row: _this.props.dataRow,
                    recNo: _this.props.dataRow.dataSet.recNo
                }));
            }
        });
        return items;
    };
    return ChildRow;
}(React.Component));
export { ChildRow };
var MainRow = /** @class */ (function (_super) {
    __extends(MainRow, _super);
    function MainRow(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            allWidth: _this.getAllWidth(),
        };
        return _this;
    }
    MainRow.prototype.render = function () {
        var _this = this;
        var items = [];
        React.Children.map(this.props.children, function (child) {
            if (isValidElement(child)) {
                // @ts-ignore
                var className = child.type.className || '';
                if (className == Column.className) {
                    if (_this.props.tag == ColumnType.th) {
                        items.push(React.cloneElement(child, {
                            key: "head_".concat(child.props.code), tag: ColumnType.th, width: _this.getWidth(child.props.width)
                        }));
                    }
                    else {
                        items.push(React.cloneElement(child, {
                            key: child.props.code, dataRow: _this.props.dataRow,
                            recNo: _this.props.recNo
                        }));
                    }
                }
            }
        });
        return items;
    };
    MainRow.prototype.getAllWidth = function () {
        var width = 0;
        React.Children.map(this.props.children, function (child) {
            if (isValidElement(child)) {
                // @ts-ignore
                var className = child.type.className || '';
                if (className == Column.className) {
                    width += Number(child.props.width);
                }
            }
        });
        return width;
    };
    MainRow.prototype.getWidth = function (width) {
        return (Number(width) / this.state.allWidth) * 100 + "%";
    };
    MainRow.className = 'MainRow';
    return MainRow;
}(React.Component));
export { MainRow };
