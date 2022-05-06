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
var SearchText = /** @class */ (function (_super) {
    __extends(SearchText, _super);
    function SearchText(props) {
        var _this = _super.call(this, props) || this;
        _this.onClick = function (el) {
            if (_this.props.onChanged != undefined)
                _this.props.onChanged(_this.state.value);
        };
        _this.changeValue = function (event) {
            var text = event.target.value;
            _this.setState({ value: text });
        };
        _this.state = {
            value: props.defaultValue ? props.defaultValue : ""
        };
        return _this;
    }
    SearchText.prototype.render = function () {
        return (React.createElement("div", null,
            React.createElement("div", null,
                this.props.label,
                React.createElement("input", { type: "input", value: this.state.value, onChange: this.changeValue }),
                React.createElement("button", { id: "btnSearch", onClick: this.onClick }, "\u641C\u7D22"))));
    };
    return SearchText;
}(React.Component));
export default SearchText;
