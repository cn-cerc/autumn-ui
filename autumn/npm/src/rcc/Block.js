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
import { ChildRow, Column, ColumnType } from "./DBGrid";
import Control from "./WebControl";
var Block = /** @class */ (function (_super) {
    __extends(Block, _super);
    function Block(props) {
        var _this = _super.call(this, props) || this;
        _this.arriveBottom = false;
        _this.onTrClick = function (sender) {
            if (!_this.props.onRowClick)
                return;
            var tr = sender.target.closest('div[role="tr"]');
            var reactKey = tr.dataset.key;
            var recNo = Number(reactKey.split('_')[1].split('\.')[0]);
            _this.props.dataSet.setRecNo(recNo);
            _this.props.onRowClick(_this.props.dataSet.current);
        };
        _this.state = {
            rowMax: 50,
        };
        return _this;
    }
    Block.prototype.scroll = function () {
        if (!document.getElementById('more'))
            return;
        var clientHeight = document.documentElement.clientHeight;
        var bottom = document.getElementById('more').getBoundingClientRect().bottom;
        if (Math.abs(clientHeight - bottom) < 100 && !this.arriveBottom && this.state.rowMax < this.props.dataSet.size) {
            this.arriveBottom = true;
            var rowMax = this.state.rowMax + 50;
            rowMax = rowMax > this.props.dataSet.size ? this.props.dataSet.size : rowMax;
            this.setState(__assign(__assign({}, this.state), { rowMax: rowMax }));
        }
    };
    Block.prototype.componentWillMount = function () {
        document.querySelector('main').addEventListener('scroll', this.scroll.bind(this), false);
    };
    Block.prototype.render = function () {
        return (React.createElement("div", { className: 'aui-block-block' },
            this.getRows(),
            this.state.rowMax <= this.props.dataSet.size ? React.createElement("div", { id: 'more', className: 'aui-block-more' },
                "\u603B\u8BB0\u5F55\u6570\uFF1A",
                this.props.dataSet.size) : ''));
    };
    Block.prototype.getRows = function () {
        var _this = this;
        var items = [];
        var ds = this.props.dataSet;
        ds.first();
        var _loop_1 = function () {
            var recNo = ds.recNo;
            var dataRow = ds.current;
            items.push(React.createElement("div", { className: 'aui-block-row', key: "master_".concat(recNo), "data-key": "master_".concat(recNo), role: 'tr', onClick: this_1.onTrClick }, this_1.getLines(dataRow, recNo)));
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
                    var display = 'block';
                    if (child.props.visible || (child.props.autoJudge && isHide_1))
                        display = 'none';
                    items.push(React.createElement("div", { className: 'aui-block-row aui-block-childRow', key: "child_".concat(key), id: "child_".concat(key), "data-key": "child_".concat(key), role: 'tr', onClick: _this.onTrClick }, React.cloneElement(child, { key: child.props.code, colSpan: 1, dataRow: dataRow })));
                }
            });
            if (this_1.state.rowMax <= ds.recNo) {
                return "break";
            }
        };
        var this_1 = this;
        while (ds.fetch()) {
            var state_1 = _loop_1();
            if (state_1 === "break")
                break;
        }
        this.arriveBottom = false;
        return items;
    };
    Block.prototype.getLines = function (row, recNo) {
        var items = [];
        var lineNo = 0;
        React.Children.map(this.props.children, function (child) {
            if (isValidElement(child) && child.type == Line) {
                items.push(React.cloneElement(child, { row: row, key: lineNo++, recNo: recNo }));
            }
        });
        return items;
    };
    return Block;
}(Control));
export default Block;
var Line = /** @class */ (function (_super) {
    __extends(Line, _super);
    function Line(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            allWidth: _this.getAllWidth()
        };
        return _this;
    }
    Line.prototype.render = function () {
        return (React.createElement("div", { className: this.props.className ? 'aui-block-line' + " ".concat(this.props.className) : 'aui-block-line' }, this.getRow()));
    };
    Line.prototype.getRow = function () {
        var _this = this;
        var items = [];
        React.Children.map(this.props.children, function (child) {
            if (isValidElement(child)) {
                // @ts-ignore
                var className = child.type.className || '';
                if (className == Column.className)
                    items.push(React.cloneElement(child, {
                        tag: ColumnType.span, key: child.props.code, dataRow: _this.props.row, recNo: _this.props.recNo, width: _this.getWidth(child.props.width)
                    }));
            }
        });
        return items;
    };
    Line.prototype.getAllWidth = function () {
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
    Line.prototype.getWidth = function (width) {
        return (Number(width) / this.state.allWidth) * 100 + "%";
    };
    return Line;
}(Control));
export { Line };
