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
import { Column, ColumnType } from "./DBGrid";
var ColumnIt = /** @class */ (function (_super) {
    __extends(ColumnIt, _super);
    function ColumnIt() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ColumnIt.prototype.getValue = function () {
        var bool = this.props.sortType == 'desc';
        return bool ? this.props.dataRow.dataSet.size - this.props.recNo + 1 : this.props.recNo;
    };
    ColumnIt.defaultProps = {
        tag: ColumnType.td,
        colSpan: 1,
        code: '_it_',
        width: '5',
        textAlign: 'center',
        name: '序'
    };
    return ColumnIt;
}(Column));
export { ColumnIt };
