import { FieldKind } from "./FieldKind";
import FieldMeta from "./FieldMeta";
var FieldDefs = /** @class */ (function () {
    function FieldDefs() {
        this._items = [];
    }
    Object.defineProperty(FieldDefs.prototype, "json", {
        get: function () {
            var json = [];
            for (var _i = 0, _a = this._items; _i < _a.length; _i++) {
                var meta = _a[_i];
                json.push(meta.json);
            }
            return json;
        },
        enumerable: false,
        configurable: true
    });
    FieldDefs.prototype.setJson = function (json) {
        this._items = [];
        for (var _i = 0, json_1 = json; _i < json_1.length; _i++) {
            var field = json_1[_i];
            var code = field.code, kind = field.kind, remark = field.remark, type = field.type;
            var meta = new FieldMeta(code, kind);
            meta.setRemark(remark);
            meta.setType(type);
            this._items.push(meta);
        }
        return this;
    };
    FieldDefs.prototype.add = function (code, kind) {
        if (kind === void 0) { kind = FieldKind.Memory; }
        if (this.exists(code))
            return this.get(code);
        var item = new FieldMeta(code, kind);
        this._items.push(item);
        return item;
    };
    FieldDefs.prototype.exists = function (code) {
        for (var i = 0; i < this._items.length; i++) {
            var meta = this._items[i];
            if (meta.code == code) {
                return true;
            }
        }
        return false;
    };
    FieldDefs.prototype.get = function (code) {
        var result = null;
        this._items.forEach(function (item) {
            if (item.code == code) {
                result = item;
                return;
            }
        });
        return result;
    };
    Object.defineProperty(FieldDefs.prototype, "size", {
        get: function () { return this._items.length; },
        enumerable: false,
        configurable: true
    });
    FieldDefs.prototype.clear = function () { this._items = []; };
    FieldDefs.prototype.forEach = function (fn) {
        for (var _i = 0, _a = this._items; _i < _a.length; _i++) {
            var meta = _a[_i];
            fn.call(this, meta);
        }
    };
    Object.defineProperty(FieldDefs.prototype, "items", {
        get: function () { return this._items; },
        enumerable: false,
        configurable: true
    });
    FieldDefs.prototype.copy = function (src) {
        for (var _i = 0, _a = src.items; _i < _a.length; _i++) {
            var meta = _a[_i];
            if (!this.exists(meta.code))
                this._items.push(meta);
        }
    };
    return FieldDefs;
}());
export default FieldDefs;
// let defs = new FieldDefs();
// defs.add('code');
// defs.add('name').setName('名称');
// defs.add('code');
// defs.get('code').setName('代码').setType('s0');
// defs.forEach((item) => {
//     console.log(item);
// })
