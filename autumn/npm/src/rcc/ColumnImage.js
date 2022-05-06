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
import { Column, ColumnType } from "./DBGrid";
var ColumnImage = /** @class */ (function (_super) {
    __extends(ColumnImage, _super);
    function ColumnImage(props) {
        return _super.call(this, props) || this;
    }
    ColumnImage.prototype.getValue = function () {
        var url = this.props.dataRow.getString(this.props.code);
        if (url) {
            return (
            // @ts-ignore
            React.createElement("img", { src: url, width: this.props.imgWidth, height: this.props.imgHeight }));
        }
        else
            return '';
    };
    ColumnImage.defaultProps = {
        tag: ColumnType.td,
        colSpan: 1,
        textAlign: 'right',
        imgWidth: '100',
        imgHeight: '100',
    };
    return ColumnImage;
}(Column));
export { ColumnImage };
