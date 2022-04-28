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
import WebControl from "./WebControl";
var BaseDialog = /** @class */ (function (_super) {
    __extends(BaseDialog, _super);
    function BaseDialog() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            dialogData: {
                moving: false,
                startX: 0,
                startY: 0,
                moveX: 0,
                moveY: 0,
                x: 0,
                y: 0
            },
            width: '50%',
            height: _this.isPhone ? '25rem' : '37.5rem',
        };
        _this._title = '弹窗选择';
        _this._dialogRole = '';
        _this._load = false;
        _this._loadMessage = '系统正在查询中,请稍后...';
        _this._showAsChild = false;
        _this._searchTimeOut = 259200000; //查询缓存超时时间(3天);
        _this.handleMouseDown = function (sender) {
            if (_this.allowDrag()) {
                _this.state.dialogData.moving = true;
                _this.state.dialogData.startX = sender.pageX;
                _this.state.dialogData.startY = sender.pageY;
                _this.state.dialogData.moveX = 0;
                _this.state.dialogData.moveY = 0;
            }
        };
        _this.handleMouseMove = function (sender) {
            if (_this.state.dialogData.moving) {
                sender.stopPropagation();
                sender.preventDefault();
                if (sender.pageX !== 0 && sender.pageY !== 0) {
                    _this.state.dialogData.moveX = sender.pageX - _this.state.dialogData.startX;
                    _this.state.dialogData.moveY = sender.pageY - _this.state.dialogData.startY;
                    $('.aui-base-main').eq($('.aui-base-main').length - 1).css({
                        'left': _this.state.dialogData.x + _this.state.dialogData.moveX,
                        'top': _this.state.dialogData.y + _this.state.dialogData.moveY
                    });
                }
            }
        };
        _this.handleMouseUp = function (sender) {
            if (_this.state.dialogData.moving) {
                _this.state.dialogData.moving = false;
                _this.state.dialogData.x = _this.state.dialogData.x + _this.state.dialogData.moveX;
                _this.state.dialogData.y = _this.state.dialogData.y + _this.state.dialogData.moveY;
                _this.setState(__assign({}, _this.state));
            }
        };
        return _this;
    }
    Object.defineProperty(BaseDialog.prototype, "title", {
        get: function () { return this._title; },
        enumerable: false,
        configurable: true
    });
    BaseDialog.prototype.setTitle = function (value) {
        this._title = value;
        return this;
    };
    Object.defineProperty(BaseDialog.prototype, "load", {
        get: function () { return this._load; },
        enumerable: false,
        configurable: true
    });
    BaseDialog.prototype.setLoad = function (value) {
        this._load = value;
        this.setState(__assign({}, this.state));
        return this;
    };
    BaseDialog.prototype.customLoad = function (message) {
        this._loadMessage = message;
        this._load = true;
        this.setState(__assign({}, this.state));
        return this;
    };
    BaseDialog.prototype.setStorage = function (key, value) {
        window.localStorage.setItem(this.getStorageKey(key), value);
    };
    BaseDialog.prototype.getStorage = function (key) {
        return window.localStorage.getItem(this.getStorageKey(key));
    };
    BaseDialog.prototype.delStorage = function (key) {
        window.localStorage.removeItem(this.getStorageKey(key));
    };
    BaseDialog.prototype.getStorageKey = function (key) {
        var account = localStorage.getItem('ErpKey_Account1');
        return "ditengDialog_" + account + "_" + key;
    };
    Object.defineProperty(BaseDialog.prototype, "searchTimeOut", {
        get: function () { return this._searchTimeOut; },
        enumerable: false,
        configurable: true
    });
    BaseDialog.prototype.render = function () {
        this._dialogRole = 'dialog' + document.querySelectorAll("[role='dialog']").length;
        return (_jsxs(React.Fragment, { children: [this.getAdornment(), this.getDialog()] }, void 0));
    };
    BaseDialog.prototype.componentDidMount = function () {
        this.initSite();
    };
    BaseDialog.prototype.allowDrag = function () {
        return true;
    };
    BaseDialog.prototype.initSite = function () {
        var _this = this;
        $(document).on('mousemove', function (e) { return _this.handleMouseMove(e); });
        $(document).on('mouseup', function (e) { return _this.handleMouseUp(e); });
        var offsetTop = ($(window).outerHeight() - $('.aui-base-main').outerHeight()) / 2;
        var dialogData = {
            x: ($(window).outerWidth() - $('.aui-base-main').outerWidth()) / 2,
            y: offsetTop < 0 ? 0 : offsetTop,
        };
        this.setState(__assign(__assign({}, this.state), { dialogData: Object.assign(__assign(__assign({}, this.state.dialogData), dialogData)) }));
    };
    BaseDialog.prototype.getStyle = function () {
        var width = this.state.width;
        var height = this.state.height;
        var style = {
            width: width,
            height: height
        };
        if (this.state.dialogData.x) {
            style.left = this.state.dialogData.x;
        }
        if (this.state.dialogData.y) {
            style.top = this.state.dialogData.y;
        }
        return style;
    };
    // 用于关闭窗口
    BaseDialog.prototype.handleClose = function () {
        if (this.props.isChild) {
            this._showAsChild = false;
            this.setState(__assign({}, this.state));
        }
        else {
            var box = document.getElementById('dialogBox');
            //@ts-ignore
            ReactDOM.unmountComponentAtNode(box);
            if (box)
                box.remove();
        }
    };
    // 用于弹窗选择完成之后关闭窗口
    BaseDialog.prototype.handleSelect = function () {
        var evt = new Event('input', { 'bubbles': true, 'cancelable': true });
        if (this.props.inputId) {
            var inputIds = this.props.inputId.split(',');
            if (inputIds.length == 1) {
                document.getElementById(this.props.inputId).dispatchEvent(evt);
            }
            else {
                inputIds.forEach(function (inputId) {
                    document.getElementById(inputId).dispatchEvent(evt);
                });
            }
        }
        this.handleClose();
    };
    BaseDialog.prototype.getDialog = function () {
        var _this = this;
        if (!this.props.isChild || this._showAsChild) {
            return (_jsx("div", __assign({ role: 'dialog', id: 'dialog' }, { children: _jsxs("div", __assign({ className: 'aui-base-main', style: this.getStyle.bind(this)(), role: this._dialogRole }, { children: [_jsxs("div", __assign({ className: 'aui-base-title', onMouseDown: function (e) { return _this.handleMouseDown(e); } }, { children: [_jsx("span", { children: this._title }, void 0), this.getOperate()] }), void 0), _jsxs("div", __assign({ className: 'aui-base-content' }, { children: [this.content(), this.getLoad()] }), void 0)] }), void 0) }), void 0));
        }
    };
    BaseDialog.prototype.getOperate = function () {
        return _jsx("span", __assign({ className: 'aui-base-close', onClick: this.handleClose.bind(this) }, { children: "\u00D7" }), void 0);
    };
    BaseDialog.prototype.getLoad = function () {
        if (this._load) {
            return (_jsxs("div", __assign({ className: 'aui-base-load' }, { children: [_jsx("img", { src: 'https://www.diteng.site/public/images/loading.gif' }, void 0), _jsx("span", { children: this._loadMessage }, void 0)] }), void 0));
        }
    };
    BaseDialog.prototype.getAdornment = function () {
        if (this.props.isChild)
            return _jsx("img", { src: 'https://www.diteng.site/public/images/searchIocn.png', onClick: this.showAsChild.bind(this), className: 'aui-base-showDialog' }, void 0);
    };
    BaseDialog.prototype.showAsChild = function () {
        var _this = this;
        this._showAsChild = true;
        this.setState(__assign({}, this.state), function () {
            _this.initSite();
        });
    };
    return BaseDialog;
}(WebControl));
export default BaseDialog;
