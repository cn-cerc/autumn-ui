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
import React from "react";
var DBDrop = /** @class */ (function (_super) {
    __extends(DBDrop, _super);
    function DBDrop(props) {
        var _this = _super.call(this, props) || this;
        _this.handleChange = function (sender) {
            var el = sender.target;
            var option = el.selectedOptions[0];
            _this.props.dataRow.setValue(_this.props.dataField, option.value);
            _this.setState(__assign({}, _this.state), function () {
                var dataSet = _this.props.dataRow.dataSet;
                if (dataSet) {
                    dataSet.setRecNo(dataSet.locationRow(_this.props.dataRow));
                    dataSet.edit();
                }
            });
            if (_this.props.onChanged)
                _this.props.onChanged(_this.props.dataRow.fields.get(_this.props.dataField));
        };
        return _this;
    }
    DBDrop.prototype.render = function () {
        var dataName;
        if (this.props.dataName)
            dataName = (React.createElement("label", { htmlFor: this.props.dataField },
                this.props.dataName,
                "\uFF1A"));
        return (React.createElement("span", { className: "aui-form-main ".concat(this.props.className) },
            dataName,
            React.createElement("select", { id: this.props.dataField, onChange: this.handleChange.bind(this), value: this.props.dataRow.getString(this.props.dataField), disabled: this.props.disabled }, this.getOptions())));
    };
    DBDrop.prototype.getOptions = function () {
        var options = [];
        this.props.options.forEach(function (value, key) {
            options.push(React.createElement("option", { key: key, value: value }, key));
        });
        return options;
    };
    return DBDrop;
}(React.Component));
export default DBDrop;
