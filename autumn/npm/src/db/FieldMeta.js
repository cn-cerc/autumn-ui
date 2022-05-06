import { FieldKind } from "./FieldKind";
var FieldMeta = /** @class */ (function () {
    function FieldMeta(code, kind) {
        if (kind === void 0) { kind = FieldKind.Memory; }
        this._code = null;
        this._name = null;
        this._remark = null;
        this._type = null;
        this._kind = null;
        this._code = code;
        this._kind = kind;
    }
    Object.defineProperty(FieldMeta.prototype, "json", {
        get: function () {
            var json = {};
            json.code = this._code;
            json.name = this._name;
            json.remark = this._remark;
            json.type = this._type;
            json.kind = this._kind;
            return json;
        },
        enumerable: false,
        configurable: true
    });
    FieldMeta.prototype.setJson = function (value) {
        var code = value.code, name = value.name, remark = value.remark, type = value.type, kind = value.kind;
        if (code && (code != this.code))
            throw new Error("code(".concat(this.code, ") not update"));
        if (name)
            this._name = name;
        if (remark)
            this._remark = remark;
        if (type)
            this._type = type;
        if (kind)
            this._kind = kind;
        return this;
    };
    Object.defineProperty(FieldMeta.prototype, "code", {
        get: function () { return this._code; },
        enumerable: false,
        configurable: true
    });
    ;
    Object.defineProperty(FieldMeta.prototype, "name", {
        get: function () { return this._name; },
        enumerable: false,
        configurable: true
    });
    FieldMeta.prototype.setName = function (value) { this._name = value; return this; };
    Object.defineProperty(FieldMeta.prototype, "remark", {
        get: function () { return this._remark; },
        enumerable: false,
        configurable: true
    });
    FieldMeta.prototype.setRemark = function (value) { this._remark = value; return this; };
    Object.defineProperty(FieldMeta.prototype, "type", {
        get: function () { return this._type; },
        enumerable: false,
        configurable: true
    });
    FieldMeta.prototype.setType = function (value) { this._type = value; return this; };
    Object.defineProperty(FieldMeta.prototype, "kind", {
        get: function () { return this._kind; },
        enumerable: false,
        configurable: true
    });
    FieldMeta.prototype.setKind = function (value) { this._kind = value; return this; };
    Object.defineProperty(FieldMeta.prototype, "onGetText", {
        get: function () { return this._onGetText; },
        enumerable: false,
        configurable: true
    });
    FieldMeta.prototype.setOnGetText = function (value) { this._onGetText = value; return this; };
    Object.defineProperty(FieldMeta.prototype, "onSetText", {
        get: function () { return this._onSetText; },
        enumerable: false,
        configurable: true
    });
    ;
    FieldMeta.prototype.setOnSetText = function (value) { this._onSetText = value; return this; };
    return FieldMeta;
}());
export default FieldMeta;
