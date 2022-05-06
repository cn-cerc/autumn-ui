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
var DBCheckbox = /** @class */ (function (_super) {
    __extends(DBCheckbox, _super);
    function DBCheckbox(props) {
        var _this = _super.call(this, props) || this;
        _this.onChange = function (sender) {
            if (!_this.props.isUseChangedEvent)
                return;
            var el = sender.target;
            var row = _this.props.dataRow;
            row.setValue(_this.props.dataField, !row.getBoolean(_this.props.dataField));
            if (_this.props.onChanged)
                _this.props.onChanged(_this.props.dataRow.fields.get(el.name));
        };
        return _this;
    }
    DBCheckbox.prototype.render = function () {
        var row = this.props.dataRow;
        if (!row)
            return null;
        var value = false;
        if (row)
            value = row.getBoolean(this.props.dataField);
        var dataName;
        if (this.props.dataName) {
            dataName = (React.createElement("label", { htmlFor: this.props.dataField }, this.props.dataName));
        }
        return (React.createElement("div", { className: this.props.className || '' },
            React.createElement("input", { type: "checkbox", role: "".concat(this.props.dataRow.getString('columnName')), id: this.props.dataField, name: this.props.dataField, checked: value, onChange: this.onChange }),
            dataName));
    };
    DBCheckbox.defaultProps = {
        isUseChangedEvent: true
    };
    return DBCheckbox;
}(React.Component));
export default DBCheckbox;
