import DataSource from "./DataSource";
import FieldDefs from "./FieldDefs";
export var DataRowState;
(function (DataRowState) {
    DataRowState[DataRowState["None"] = 0] = "None";
    DataRowState[DataRowState["Insert"] = 1] = "Insert";
    DataRowState[DataRowState["Update"] = 2] = "Update";
    DataRowState[DataRowState["Delete"] = 3] = "Delete";
    DataRowState[DataRowState["History"] = 4] = "History";
})(DataRowState || (DataRowState = {}));
var DataRow = /** @class */ (function () {
    //提供数据绑定服务
    // private _bindControls: Set<DataControl> = new Set<DataControl>();
    // private _bindEnabled: boolean = true;
    function DataRow(dataSet) {
        if (dataSet === void 0) { dataSet = null; }
        this._state = DataRowState.None;
        this._items = new Map();
        this._delta = new Map();
        if (dataSet) {
            this._dataSet = dataSet;
            this._fields = dataSet.fields;
        }
        else {
            this._fields = new FieldDefs();
        }
    }
    DataRow.prototype.asDataSource = function () {
        return new DataSource([this]);
    };
    Object.defineProperty(DataRow.prototype, "state", {
        get: function () { return this._state; },
        enumerable: false,
        configurable: true
    });
    DataRow.prototype.setState = function (value) {
        if (this._state != value) {
            if ((this.state == DataRowState.Insert) && (value == DataRowState.Update))
                throw new Error("change state error: insert => update");
            this._state = value;
            if (this._state == DataRowState.None)
                this.setHistory(null);
            else if (this._state == DataRowState.Update)
                this.setHistory(this.clone());
        }
        return this;
    };
    DataRow.prototype.close = function () {
        this._items.clear();
    };
    DataRow.prototype.setValue = function (field, value) {
        if (!field)
            throw new Error('field is null!');
        this.addFieldDef(field);
        if (this.dataSet && this._dataSet.search) {
            var search = this._dataSet.search;
            search.remove(this);
            this._items.set(field, value);
            search.append(this);
        }
        else {
            this._items.set(field, value);
        }
        // if (this.bindEnabled) this.refreshBind();
        return this;
    };
    DataRow.prototype.copyValues = function (source, defs) {
        var _this = this;
        if (defs === void 0) { defs = null; }
        if (defs == null)
            defs = source.fields;
        defs.forEach(function (meta) {
            _this.setValue(meta.code, source.getValue(meta.code));
        });
    };
    DataRow.prototype.addFieldDef = function (field) {
        if (field == null)
            throw new Error("field is null");
        if (!this._fields.exists(field)) {
            this._fields.add(field);
        }
    };
    DataRow.prototype.getValue = function (field) {
        if (!field)
            throw new Error('field is null!');
        var value = this._items.get(field);
        return value == undefined ? null : value;
    };
    DataRow.prototype.getNumber = function (field) {
        var value = this.getValue(field);
        if (value == null || value == '') {
            return 0;
        }
        if (typeof value == 'number') {
            return value;
        }
        else if (value instanceof Number) {
            var tmp = value;
            return tmp.valueOf();
        }
        else {
            return Number.parseFloat(value);
        }
    };
    DataRow.prototype.getInt = function (field) { return this.getNumber(field); };
    DataRow.prototype.getDouble = function (field) { return this.getNumber(field); };
    DataRow.prototype.getString = function (field) {
        var value = this.getValue(field);
        if (typeof value == 'number' || value)
            return value.toString();
        else
            return "";
    };
    DataRow.prototype.getBoolean = function (field) {
        return this.getValue(field) ? true : false;
    };
    DataRow.prototype.getText = function (field) {
        var meta = this.fields.add(field);
        if (meta.onGetText != undefined) {
            return meta.onGetText(this, meta);
        }
        else
            return this.getString(field);
    };
    DataRow.prototype.setText = function (field, value) {
        var meta = this.fields.add(field);
        if (meta.onSetText != undefined) {
            this.setValue(meta.code, meta.onSetText(this, meta, value));
        }
        else
            this.setValue(field, value);
        return this;
    };
    Object.defineProperty(DataRow.prototype, "size", {
        get: function () { return this._items.size; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DataRow.prototype, "delta", {
        get: function () { return this._delta; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DataRow.prototype, "json", {
        get: function () {
            var obj = {};
            for (var _i = 0, _a = this._fields.items; _i < _a.length; _i++) {
                var meta = _a[_i];
                var key = meta.code;
                obj[key] = this.getValue(key);
            }
            return JSON.stringify(obj);
        },
        enumerable: false,
        configurable: true
    });
    DataRow.prototype.setJson = function (jsonObj) {
        if (!jsonObj)
            throw new Error('jsonText is null!');
        var json = JSON.parse(jsonObj);
        for (var k in json)
            this.setValue(k, json[k]);
        return this;
    };
    Object.defineProperty(DataRow.prototype, "jsonObject", {
        get: function () {
            var json = {};
            for (var _i = 0, _a = this._fields.items; _i < _a.length; _i++) {
                var meta = _a[_i];
                json[meta.code] = this.getValue(meta.code);
            }
            return json;
        },
        enumerable: false,
        configurable: true
    });
    DataRow.prototype.setJsonObject = function (jsonObject) {
        var keys = Object.keys(jsonObject);
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var key = keys_1[_i];
            this.setValue(key, jsonObject[key]);
        }
        return this;
    };
    Object.defineProperty(DataRow.prototype, "fields", {
        get: function () {
            if (this._dataSet) {
                return this._dataSet.fields;
            }
            else {
                if (!this._fields)
                    this._fields = new FieldDefs();
                return this._fields;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DataRow.prototype, "items", {
        get: function () { return this._items; },
        enumerable: false,
        configurable: true
    });
    DataRow.prototype.forEach = function (fn) {
        for (var _i = 0, _a = this._fields.items; _i < _a.length; _i++) {
            var meta = _a[_i];
            var key = meta.code;
            fn.call(this, key, this.getValue(key));
        }
    };
    Object.defineProperty(DataRow.prototype, "dataSet", {
        get: function () { return this._dataSet; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DataRow.prototype, "current", {
        // interfact DataBind
        // registerBind(client: DataControl, register: boolean = true): void {
        //     if (register)
        //         this._bindControls.add(client);
        //     else
        //         this._bindControls.delete(client);
        // }
        // refreshBind(content: any = undefined): void {
        //     if (this._bindEnabled) {
        //         this._bindControls.forEach(child => {
        //             child.doChange(content);
        //         });
        //     }
        // }
        // get bindEnabled(): boolean { return this._bindEnabled };
        // setBindEnabled(value: boolean): DataRow { this._bindEnabled = value; return this; }
        get: function () {
            return this;
        },
        enumerable: false,
        configurable: true
    });
    DataRow.prototype.clone = function () {
        var row = new DataRow();
        for (var _i = 0, _a = this._fields.items; _i < _a.length; _i++) {
            var meta = _a[_i];
            var key = meta.code;
            row.setValue(key, this.getValue(key));
        }
        return row;
    };
    Object.defineProperty(DataRow.prototype, "history", {
        get: function () { return this._history; },
        enumerable: false,
        configurable: true
    });
    DataRow.prototype.setHistory = function (history) {
        this._history = history;
        if (this._history)
            this._history.setState(DataRowState.History);
        return this;
    };
    DataRow.prototype.has = function (field) {
        return this.fields.exists(field) && this.getString(field) !== '';
    };
    return DataRow;
}());
export default DataRow;
// let row1 = new DataRow();
// row1.setValue('code', 'a');
// row1.setValue('name', 'jason');
// row1.setValue("flag", false);
// assertEquals(1, row1.json, '{"code":"a","name":"jason","flag":false}');
// assertEquals(2, row1.getValue('value'), null);
// assertEquals(3, false, row1.getBoolean('flag'));
// let row2 = new DataRow();
// row2.copyValues(row1);
// assertEquals(4, row1.json, row2.json);
// console.log(row2.jsonObject);
// let row3 = new DataRow();
// row3.jsonObject = row2.jsonObject;
// console.log(row3.jsonObject);
// console.log(row3.json);
