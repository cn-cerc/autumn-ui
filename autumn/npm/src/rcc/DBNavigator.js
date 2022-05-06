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
var divStyle = {
    padding: '0.25rem'
};
var DBNavigator = /** @class */ (function (_super) {
    __extends(DBNavigator, _super);
    function DBNavigator(props) {
        var _this = _super.call(this, props) || this;
        _this.onClick = function (el) {
            console.log(_this.props.dataSet.recNo);
            switch (el.target.id) {
                case 'first':
                    _this.props.dataSet.first();
                    break;
                case 'prior':
                    _this.props.dataSet.prior();
                    break;
                case 'next':
                    _this.props.dataSet.next();
                    break;
                case 'last':
                    _this.props.dataSet.last();
                    break;
                default:
                    alert('error');
            }
            var row = _this.props.dataSet.current;
            if (_this.props.onNavigator && row != null)
                _this.props.onNavigator(row);
        };
        return _this;
    }
    DBNavigator.prototype.render = function () {
        return (React.createElement("div", { style: divStyle },
            React.createElement("button", { id: 'first', onClick: this.onClick }, "\u7B2C\u4E00\u7B14"),
            React.createElement("button", { id: 'prior', onClick: this.onClick }, "\u4E0A\u7B14"),
            React.createElement("button", { id: 'next', onClick: this.onClick }, "\u4E0B\u7B14"),
            React.createElement("button", { id: 'last', onClick: this.onClick }, "\u6700\u540E\u4E00\u7B14")));
    };
    return DBNavigator;
}(React.Component));
export default DBNavigator;
