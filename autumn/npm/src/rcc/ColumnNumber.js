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
import { jsx as _jsx } from "react/jsx-runtime";
import { Column, ColumnType } from "./DBGrid";
var ColumnNumber = /** @class */ (function (_super) {
    __extends(ColumnNumber, _super);
    function ColumnNumber() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ColumnNumber.prototype.getValue = function () {
        //@ts-ignore
        var color = this.props.color;
        if (color) {
            return _jsx("span", __assign({ style: { color: color } }, { children: this.props.dataRow.getNumber(this.props.code) }), void 0);
        }
        else
            return this.props.dataRow.getNumber(this.props.code);
    };
    ColumnNumber.defaultProps = {
        tag: ColumnType.td,
        colSpan: 1,
        textAlign: 'right',
        color: '',
    };
    return ColumnNumber;
}(Column));
export { ColumnNumber };
