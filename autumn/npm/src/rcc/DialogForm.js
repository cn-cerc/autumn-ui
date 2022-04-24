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
import React, { isValidElement } from "react";
import DataSet from "../db/DataSet";
var DialogForm = /** @class */ (function (_super) {
    __extends(DialogForm, _super);
    function DialogForm(props) {
        var _this = _super.call(this, props) || this;
        _this.onSelect = function (values) {
            if (_this.props.onSelect) {
                var ds = new DataSet();
                ds.append().copyRecord(values);
                _this.setState(__assign(__assign({}, _this.state), { active: function () { return false; } }));
                _this.props.onSelect(ds);
            }
        };
        _this.btnShow = function (sender) {
            if (_this.props.setActive)
                _this.props.setActive(true);
        };
        _this.btnClose = function (sender) {
            sender.preventDefault();
            sender.stopPropagation();
            if (_this.props.setActive)
                _this.props.setActive(false);
        };
        _this.handleMouseDown = function (sender) {
            if (!$(sender.target).hasClass('aui-dialogForm-btnClose')) {
                _this.state.move.moving = true;
                _this.state.move.startX = sender.pageX;
                _this.state.move.startY = sender.pageY;
            }
        };
        _this.handleMouseMove = function (sender) {
            if (_this.state.move.moving) {
                sender.stopPropagation();
                sender.preventDefault();
                if (sender.pageX !== 0 && sender.pageY !== 0) {
                    _this.state.move.moveX = sender.pageX - _this.state.move.startX;
                    _this.state.move.moveY = sender.pageY - _this.state.move.startY;
                    $("#dialogMain").css({
                        "left": _this.state.site.x + _this.state.move.moveX,
                        "top": _this.state.site.y + _this.state.move.moveY
                    });
                }
            }
        };
        _this.handleMouseUp = function (sender) {
            if (_this.state.move.moving) {
                _this.state.move.moving = false;
                _this.state.site.x = _this.state.site.x + _this.state.move.moveX;
                _this.state.site.y = _this.state.site.y + _this.state.move.moveY;
                _this.setState(__assign({}, _this.state));
            }
        };
        _this.state = {
            active: _this.props.active,
            move: {
                moving: false,
                startX: '',
                startY: '',
                moveX: '',
                moveY: ''
            },
            site: {
                x: 0,
                y: 0
            }
        };
        return _this;
    }
    DialogForm.prototype.render = function () {
        var _this = this;
        return (_jsxs("div", __assign({ className: 'aui-dialogForm-main' }, { children: [_jsx("button", __assign({ className: 'aui-dialogFrom-btnShow', onClick: this.btnShow }, { children: _jsx("img", { src: "https://www.diteng.site/public/images/searchIocn.png" }, void 0) }), void 0), _jsx("div", __assign({ className: this.props.active() ? 'aui-dialogForm-client' : 'aui-hidden', style: this.getStyle.bind(this)(), id: "dialogMain" }, { children: _jsxs("div", __assign({ className: 'aui-dialogForm-main' }, { children: [_jsxs("div", __assign({ className: 'aui-dialogForm-title', onMouseDown: function (e) { return _this.handleMouseDown(e); } }, { children: [_jsx("span", { children: this.props.title }, void 0), _jsx("span", __assign({ className: 'aui-dialogForm-btnClose', onClick: function (e) { return _this.btnClose(e); } }, { children: "X" }), void 0)] }), void 0), _jsx("div", __assign({ className: 'aui-dialogForm-content' }, { children: React.Children.map(this.props.children, function (child) {
                                    if (isValidElement(child))
                                        return React.cloneElement(child, { onSelect: _this.onSelect });
                                    else
                                        return child;
                                }) }), void 0)] }), void 0) }), void 0)] }), void 0));
    };
    DialogForm.prototype.componentDidMount = function () {
        var _this = this;
        this.state.site.x = ($(window).outerWidth() - $("#dialogMain").width()) / 2;
        this.state.site.y = ($(window).outerHeight() - $("#dialogMain").height()) / 2;
        $(document).on("mousemove", function (e) { return _this.handleMouseMove(e); });
        $(document).on("mouseup", function (e) { return _this.handleMouseUp(e); });
    };
    DialogForm.prototype.getStyle = function () {
        var style = {
            height: '80%',
            width: '80%',
        };
        if (this.state.site.x) {
            style.left = this.state.site.x;
        }
        if (this.state.site.y) {
            style.top = this.state.site.y;
        }
        return Object.assign(style, this.props.style);
    };
    return DialogForm;
}(React.Component));
export { DialogForm };
