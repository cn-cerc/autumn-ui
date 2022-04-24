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
import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import React from "react";
export var DefaultPageSize = 100;
export var USER_PAGE_SIZE_KEY = 'user:pageSize';
var MutiPage = /** @class */ (function (_super) {
    __extends(MutiPage, _super);
    function MutiPage(props) {
        var _this = _super.call(this, props) || this;
        _this.onPageSizeChange = function (sender) {
            var el = sender.target;
            var pageSize = Number.parseInt(el.value);
            if (pageSize) {
                localStorage.setItem(USER_PAGE_SIZE_KEY, String(pageSize));
            }
            var pageNo = _this.state.pageNo;
            var maxPage = Math.ceil(_this.props.total / pageSize);
            if (pageNo > maxPage)
                pageNo = maxPage;
            _this.setState(__assign(__assign({}, _this.state), { pageSize: pageSize, pageNo: pageNo, inputValue: '' + pageNo }));
            _this.pageChanged(pageSize, pageNo);
        };
        _this.onPageNoChange = function (sender) {
            var el = sender.target;
            _this.setState(__assign(__assign({}, _this.state), { inputValue: el.value }));
        };
        _this.onPageNoKeyPress = function (sender) {
            var el = sender.target;
            if (sender.charCode == 13)
                _this.updatePageNo(Number.parseInt(_this.state.inputValue));
        };
        _this.onPageNoBlur = function () {
            _this.updatePageNo(Number.parseInt(_this.state.inputValue));
        };
        _this.onNavigatorClick = function (el) {
            var pageNo = _this.state.pageNo;
            switch (el.target.id) {
                case 'first':
                    pageNo = 1;
                    break;
                case 'prior':
                    if (pageNo > 1)
                        pageNo -= 1;
                    break;
                case 'next':
                    var maxPage = Math.ceil(_this.props.total / _this.state.pageSize);
                    if (pageNo < maxPage)
                        pageNo += 1;
                    break;
                case 'last':
                    pageNo = Math.ceil(_this.props.total / _this.state.pageSize);
                    break;
                default:
                    throw Error('error: ' + el.target.id);
            }
            var dbgrid = document.querySelector('div[role="dbgrid"]');
            if (dbgrid)
                dbgrid.scroll({ top: 0 });
            var grid = document.querySelector('div[role="grid"]');
            if (grid)
                grid.scroll({ top: 0 });
            if (pageNo != _this.state.pageNo) {
                _this.setState(__assign(__assign({}, _this.state), { pageNo: pageNo, inputValue: '' + pageNo }));
                _this.pageChanged(_this.state.pageSize, pageNo);
            }
        };
        var value = localStorage.getItem(USER_PAGE_SIZE_KEY);
        var size = Number(value);
        if (!size) {
            size = DefaultPageSize;
            localStorage.setItem(USER_PAGE_SIZE_KEY, String(size));
        }
        _this.state = { pageSize: size, pageNo: 1, inputValue: '1' };
        return _this;
    }
    MutiPage.prototype.render = function () {
        var pages = Math.ceil(this.props.total / this.state.pageSize);
        return (_jsxs("div", __assign({ className: 'aui-muiPage-main' }, { children: [_jsxs("span", { children: ["\u5171 ", this.props.total, " \u6761"] }, void 0), _jsx("span", { style: { margin: '0.5rem' } }, void 0), _jsx("span", { children: "\u6BCF\u9875 " }, void 0), _jsxs("select", __assign({ value: this.state.pageSize, onChange: this.onPageSizeChange, style: {
                        width: "4rem",
                        padding: 0
                    } }, { children: [_jsx("option", __assign({ value: '20' }, { children: "20" }), void 0), _jsx("option", __assign({ value: '50' }, { children: "50" }), void 0), _jsx("option", __assign({ value: DefaultPageSize }, { children: DefaultPageSize }), void 0), _jsx("option", __assign({ value: '200' }, { children: "200" }), void 0), _jsx("option", __assign({ value: '500' }, { children: "500" }), void 0)] }), void 0), _jsx("span", { children: " \u6761" }, void 0), _jsx("span", { style: { margin: '0.5rem' } }, void 0), _jsx("span", { children: " \u7B2C " }, void 0), _jsx("input", { type: "text", style: { width: '3rem' }, value: this.state.inputValue, onChange: this.onPageNoChange, onKeyPress: this.onPageNoKeyPress, onBlur: this.onPageNoBlur }, void 0), _jsxs("span", { children: [" / ", pages, " \u9875"] }, void 0), _jsx("span", { style: { margin: '0.5rem' } }, void 0), _jsx("button", __assign({ id: 'first', onClick: this.onNavigatorClick }, { children: "\u9996\u9875" }), void 0), _jsx("button", __assign({ id: 'prior', onClick: this.onNavigatorClick }, { children: "\u4E0A\u9875" }), void 0), _jsx("button", __assign({ id: 'next', onClick: this.onNavigatorClick }, { children: "\u4E0B\u9875" }), void 0), _jsx("button", __assign({ id: 'last', onClick: this.onNavigatorClick }, { children: "\u5C3E\u9875" }), void 0)] }), void 0));
    };
    MutiPage.prototype.updatePageNo = function (pageNo) {
        var maxPage = Math.ceil(this.props.total / this.state.pageSize);
        if (pageNo > 0 && pageNo <= maxPage) {
            if (pageNo != this.state.pageNo) {
                this.setState(__assign(__assign({}, this.state), { pageNo: pageNo }));
                this.pageChanged(this.state.pageSize, pageNo);
            }
        }
        else {
            var inputValue = '' + this.state.pageNo;
            if (inputValue != this.state.inputValue)
                this.setState(__assign(__assign({}, this.state), { inputValue: inputValue }));
        }
    };
    MutiPage.prototype.pageChanged = function (pageSize, pageNo) {
        if (!this.props.onPageChanged)
            return;
        var total = this.props.total;
        var beginPoint = pageSize * (pageNo - 1) + 1;
        var endPoint = pageNo * pageSize > total ? total : pageNo * pageSize;
        this.props.onPageChanged(beginPoint, endPoint);
    };
    MutiPage.prototype.reload = function () {
        var value = localStorage.getItem(USER_PAGE_SIZE_KEY);
        var size = Number(value);
        if (!size) {
            size = DefaultPageSize;
            localStorage.setItem(USER_PAGE_SIZE_KEY, String(size));
        }
        this.setState({ pageSize: size, pageNo: 1, inputValue: '1' });
    };
    return MutiPage;
}(React.Component));
export default MutiPage;
