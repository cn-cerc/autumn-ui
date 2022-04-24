var KeyValue = /** @class */ (function () {
    function KeyValue(value) {
        this._value = value;
    }
    Object.defineProperty(KeyValue.prototype, "key", {
        get: function () { return this._key; },
        enumerable: false,
        configurable: true
    });
    ;
    KeyValue.prototype.setKey = function (value) { this._key = value; return this; };
    Object.defineProperty(KeyValue.prototype, "value", {
        get: function () { return this._value; },
        enumerable: false,
        configurable: true
    });
    ;
    KeyValue.prototype.setValue = function (value) { this._value = value; return this; };
    KeyValue.prototype.asString = function () { return '' + this.value; };
    KeyValue.prototype.asBoolean = function () { return this.value ? true : false; };
    ;
    return KeyValue;
}());
export default KeyValue;
