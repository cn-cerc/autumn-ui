import DataRow, { DataRowState } from './DataRow';
import DataSource from './DataSource';
import FieldDefs from './FieldDefs';
import SearchDataSet from './SearchDataSet';
var DataSet = /** @class */ (function () {
    //提供数据绑定服务
    // private _bindControls: Set<DataControl> = new Set<DataControl>();
    // private _bindEnabled: boolean = true;
    function DataSet(props) {
        if (props === void 0) { props = {}; }
        this._recNo = 0;
        this._fetchNo = -1;
        this._state = 0;
        this._message = '';
        this._fields = new FieldDefs();
        this._metaInfo = false;
        this._head = new DataRow();
        this._records = [];
        this._garbage = [];
        if (props) {
            var state = props.state, message = props.message;
            if (state)
                this._state = state;
            if (message)
                this._message = message;
        }
    }
    DataSet.prototype.asDataSource = function () {
        return new DataSource(this.records);
    };
    Object.defineProperty(DataSet.prototype, "search", {
        get: function () { return this._search; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DataSet.prototype, "current", {
        get: function () {
            if (this.eof() || this.bof())
                return null;
            var i = this._recNo - 1;
            return this._records[i];
        },
        enumerable: false,
        configurable: true
    });
    DataSet.prototype.append = function () {
        var record = new DataRow(this);
        record.setState(DataRowState.Insert);
        this._records.push(record);
        this._recNo = this._records.length;
        if (this._search)
            this._search.append(record);
        return this;
    };
    DataSet.prototype.edit = function () {
        var row = this.current;
        if (row.state == DataRowState.None) {
            row.setHistory(row.clone());
            row.setState(DataRowState.Update);
        }
        return this;
    };
    DataSet.prototype.delete = function () {
        if (!this.current)
            throw new Error("current is null, delete fail");
        var record = this._records.splice(this.recNo - 1, 1)[0];
        if (this._search)
            this._search.remove(record);
        if (this._fetchNo > -1) {
            this._fetchNo--;
        }
        if (record.state == DataRowState.Insert)
            return this;
        if (record.state == DataRowState.Update)
            record = record.history;
        this._garbage.push(record.setState(DataRowState.Delete));
        return this;
    };
    DataSet.prototype.first = function () {
        if (this._records.length > 0) {
            this.setRecNo(1);
        }
        else {
            this.setRecNo(0);
        }
        this._fetchNo = -1;
        return this._recNo > 0;
    };
    DataSet.prototype.last = function () {
        this.setRecNo(this._records.length);
        return this._recNo > 0;
    };
    DataSet.prototype.prior = function () {
        if (this._recNo > 0)
            this.setRecNo(this.recNo - 1);
        return this._recNo > 0 && this._recNo <= this._records.length;
    };
    DataSet.prototype.next = function () {
        if (this._recNo <= this._records.length)
            this.setRecNo(this.recNo + 1);
        return this._recNo > 0 && this._recNo <= this._records.length;
    };
    DataSet.prototype.bof = function () {
        return this._recNo == 0;
    };
    DataSet.prototype.eof = function () {
        return this._records.length == 0 || this._recNo > this._records.length;
    };
    Object.defineProperty(DataSet.prototype, "size", {
        get: function () { return this._records.length; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DataSet.prototype, "recNo", {
        get: function () { return this._recNo; },
        enumerable: false,
        configurable: true
    });
    DataSet.prototype.setRecNo = function (recNo) {
        if (recNo > (this._records.length + 1)) {
            throw new Error("RecNo ".concat(this._recNo, " \u5927\u4E8E\u603B\u957F\u5EA6 ").concat(this._records.length));
        }
        else if (recNo < 0) {
            throw new Error("RecNo ".concat(this._recNo, " \u4E0D\u5141\u8BB8\u5C0F\u4E8E\u96F6"));
        }
        else if (this._recNo != recNo) {
            this._recNo = recNo;
            // this.refreshBind({ recNo: true });
        }
        return this;
    };
    DataSet.prototype.fetch = function () {
        var result = false;
        if (this._fetchNo < (this._records.length - 1)) {
            this._fetchNo++;
            this.setRecNo(this._fetchNo + 1);
            result = true;
        }
        return result;
    };
    DataSet.prototype.copyRecord = function (source, fields) {
        if (fields === void 0) { fields = null; }
        var defs = fields ? fields : source.fields;
        if (this._search) {
            this._search.remove(this.current);
            this.current.copyValues(source, defs);
            this._search.append(this.current);
        }
        else {
            this.current.copyValues(source, defs);
        }
    };
    DataSet.prototype.exists = function (field) {
        return this._fields.exists(field);
    };
    Object.defineProperty(DataSet.prototype, "head", {
        get: function () {
            if (this._head == null) {
                this._head = new DataRow();
            }
            return this._head;
        },
        enumerable: false,
        configurable: true
    });
    DataSet.prototype.getHead = function () { return this.head; };
    Object.defineProperty(DataSet.prototype, "records", {
        get: function () {
            return this._records;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DataSet.prototype, "fields", {
        get: function () { return this._fields; },
        enumerable: false,
        configurable: true
    });
    DataSet.prototype.setValue = function (field, value) {
        this.current.setValue(field, value);
        return this;
    };
    DataSet.prototype.getValue = function (field) {
        return this.current.getValue(field);
    };
    DataSet.prototype.getString = function (field) {
        return this.current.getString(field);
    };
    DataSet.prototype.getDouble = function (field) {
        return this.current.getDouble(field);
    };
    DataSet.prototype.getText = function (field) {
        return this.current.getText(field);
    };
    DataSet.prototype.getBoolean = function (field) {
        return this.current.getBoolean(field);
    };
    DataSet.prototype.mergeChangeLog = function () {
        for (var _i = 0, _a = this.records; _i < _a.length; _i++) {
            var row = _a[_i];
            row.setState(DataRowState.None);
            row.setHistory(null);
        }
        this._garbage = [];
        this._recNo = 0;
        return this;
    };
    DataSet.prototype.clear = function () {
        this.head.fields.clear();
        this._fields.clear();
        this.close();
    };
    DataSet.prototype.close = function () {
        this._head.close();
        this._search = null;
        this._records = [];
        this._recNo = 0;
        this._fetchNo = -1;
    };
    // 用于查找多次，调用时，会先进行排序，以方便后续的相同Key查找
    DataSet.prototype.locate = function (fields, value) {
        if (!this._search) {
            this._search = new SearchDataSet(this);
        }
        var record = this._search.get(fields, value);
        if (record) {
            this.setRecNo(Array.from(this._records).indexOf(record) + 1);
            return true;
        }
        else {
            return false;
        }
    };
    Object.defineProperty(DataSet.prototype, "json", {
        get: function () {
            var _this = this;
            var jsonObj = {};
            if (this._state !== 0) {
                jsonObj.state = this._state;
            }
            if (this._message) {
                jsonObj.message = this._message;
            }
            if (this._metaInfo) {
                jsonObj.meta = {};
                if (this.head.fields.size > 0) {
                    var head_1 = [];
                    this.head.fields.forEach(function (meta) {
                        var item = {};
                        if (meta.remark) {
                            item[meta.code] = [meta.name, meta.type, meta.remark];
                        }
                        else if (meta.type) {
                            item[meta.code] = [meta.name, meta.type];
                        }
                        else if (meta.name) {
                            item[meta.code] = [meta.name];
                        }
                        else {
                            item[meta.code] = [];
                        }
                        head_1.push(item);
                    });
                    jsonObj.meta.head = head_1;
                }
                if (this.fields.items.length > 0) {
                    var body = [];
                    for (var _i = 0, _a = this.fields.items; _i < _a.length; _i++) {
                        var meta = _a[_i];
                        var item_1 = {};
                        if (meta.remark) {
                            item_1[meta.code] = [meta.name, meta.type, meta.remark];
                        }
                        else if (meta.type) {
                            item_1[meta.code] = [meta.name, meta.type];
                        }
                        else if (meta.name) {
                            item_1[meta.code] = [meta.name];
                        }
                        else {
                            item_1[meta.code] = [];
                        }
                        body.push(item_1);
                    }
                    if (this._crud)
                        body.push({ _state_: [] });
                    jsonObj.meta.body = body;
                }
            }
            if (this._head.size > 0) {
                if (this._metaInfo) {
                    jsonObj.head = [];
                    this._head.fields.forEach(function (meta) {
                        jsonObj.head.push(_this._head.getValue(meta.code));
                    });
                }
                else {
                    jsonObj.head = {};
                    this._head.forEach(function (key, value) {
                        jsonObj.head[key] = value;
                    });
                }
            }
            jsonObj.body = [];
            if (!this._metaInfo) {
                var item_2 = [];
                for (var _b = 0, _c = this._fields.items; _b < _c.length; _b++) {
                    var meta = _c[_b];
                    item_2.push(meta.code);
                }
                if (this._crud)
                    item_2.push('_state_');
                jsonObj.body.push(item_2);
            }
            if (this.crud) {
                //insert && update
                for (var _d = 0, _e = this._records; _d < _e.length; _d++) {
                    var row = _e[_d];
                    if (row.state == DataRowState.Insert) {
                        var item_3 = [];
                        for (var _f = 0, _g = this._fields.items; _f < _g.length; _f++) {
                            var meta = _g[_f];
                            item_3.push(row.getValue(meta.code));
                        }
                        item_3.push(row.state);
                        jsonObj.body.push(item_3);
                    }
                    else if (row.state == DataRowState.Update) {
                        var item_4 = [];
                        for (var _h = 0, _j = this._fields.items; _h < _j.length; _h++) {
                            var meta = _j[_h];
                            item_4.push(row.history.getValue(meta.code));
                        }
                        item_4.push(row.history.state);
                        jsonObj.body.push(item_4);
                        item_4 = [];
                        for (var _k = 0, _l = this._fields.items; _k < _l.length; _k++) {
                            var meta = _l[_k];
                            item_4.push(row.getValue(meta.code));
                        }
                        item_4.push(row.state);
                        jsonObj.body.push(item_4);
                    }
                }
                //delete
                for (var _m = 0, _o = this._garbage; _m < _o.length; _m++) {
                    var row = _o[_m];
                    var item = [];
                    for (var _p = 0, _q = this._fields.items; _p < _q.length; _p++) {
                        var meta = _q[_p];
                        item.push(row.getValue(meta.code));
                    }
                    item.push(row.state);
                    jsonObj.body.push(item);
                }
            }
            else if (this.size > 0) {
                for (var _r = 0, _s = this._records; _r < _s.length; _r++) {
                    var row = _s[_r];
                    var item = [];
                    for (var _t = 0, _u = this._fields.items; _t < _u.length; _t++) {
                        var meta = _u[_t];
                        item.push(row.getValue(meta.code));
                    }
                    jsonObj.body.push(item);
                }
            }
            return JSON.stringify(jsonObj);
        },
        enumerable: false,
        configurable: true
    });
    DataSet.prototype.setJson = function (value) {
        var _this = this;
        this.clear();
        if (!value)
            throw new Error('json is null!');
        var jsonObj = JSON.parse(value);
        if (jsonObj.hasOwnProperty('state')) {
            this._state = jsonObj.state;
        }
        if (jsonObj.hasOwnProperty('message')) {
            this._message = jsonObj.message;
        }
        var defs = [];
        if (jsonObj.hasOwnProperty('meta')) {
            this.setMetaInfo(true);
            this._meta = jsonObj.meta;
            if (this._meta.head) {
                this._head = new DataRow();
                var i_1 = 0;
                this._meta.head.forEach(function (map) {
                    for (var key in map) {
                        var values = map[key];
                        var meta = _this._head.fields.add(key);
                        if (values.length > 2)
                            meta.setRemark(values[2]);
                        if (values.length > 1)
                            meta.setType(values[1]);
                        if (values.length > 0)
                            meta.setName(values[0]);
                        _this._head.setValue(key, jsonObj.head[i_1]);
                        i_1 = i_1 + 1;
                    }
                });
            }
            if (this._meta.body) {
                var i_2 = 0;
                this._meta.body.forEach(function (map) {
                    for (var key in map) {
                        defs[i_2] = key;
                        if ('_state_' == key) {
                            _this.setCrud(true);
                            continue;
                        }
                        var values = map[key];
                        var meta = _this._fields.add(key);
                        if (values.length > 2)
                            meta.setRemark(values[2]);
                        if (values.length > 1)
                            meta.setType(values[1]);
                        if (values.length > 0)
                            meta.setName(values[0]);
                        i_2 = i_2 + 1;
                    }
                });
            }
        }
        else {
            this.setMetaInfo(false);
            if (jsonObj.hasOwnProperty('head'))
                this._head.setJsonObject(jsonObj.head);
        }
        var data = jsonObj.dataset || jsonObj.body;
        if (data) {
            if (data && data.length > 0) {
                var history_1 = null;
                for (var i = 0; i < data.length; i++) {
                    if (!this._meta && i == 0) {
                        defs = data[0];
                        if (this._crud)
                            defs.push('_state_');
                        continue;
                    }
                    var item = data[i];
                    var row = new DataRow(this);
                    for (var j = 0; j < defs.length; j++) {
                        if ('_state_' == defs[j]) {
                            switch (item[j]) {
                                case 0:
                                    row.setState(DataRowState.None);
                                    break;
                                case 1:
                                    row.setState(DataRowState.Insert);
                                    break;
                                case 2:
                                    row.setState(DataRowState.Update);
                                    break;
                                case 3: {
                                    row.setState(DataRowState.Delete);
                                    break;
                                }
                                case 4:
                                    row.setState(DataRowState.History);
                                    break;
                                default:
                                    throw Error('error state value: ' + item[j]);
                            }
                        }
                        else
                            row.setValue(defs[j], item[j]);
                    }
                    //
                    if (row.state == DataRowState.Delete)
                        this._garbage.push(row);
                    else if (row.state == DataRowState.History) {
                        if (history_1 != null)
                            throw Error("history is not null");
                        history_1 = row;
                    }
                    else if (row.state == DataRowState.Update) {
                        if (history_1 == null)
                            throw Error("history is null");
                        row.setHistory(history_1);
                        history_1 = null;
                        this.records.push(row);
                    }
                    else
                        this.records.push(row);
                }
            }
            this.first();
        }
    };
    Object.defineProperty(DataSet.prototype, "jsonObject", {
        get: function () {
            var json = {};
            json.state = this._state;
            json.message = this._message;
            if (this._metaInfo) {
                json.meta = { head: {}, body: {} };
                json.meta.head = this.head.fields.json;
                json.meta.body = this.fields.json;
                ;
            }
            json.head = this.head.jsonObject;
            json.body = [];
            for (var _i = 0, _a = this._records; _i < _a.length; _i++) {
                var row = _a[_i];
                json.body.push(row.jsonObject);
            }
            json.metaInfo = this._metaInfo;
            return json;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DataSet.prototype, "state", {
        get: function () { return this._state; },
        enumerable: false,
        configurable: true
    });
    DataSet.prototype.setState = function (state) {
        this._state = state;
        return this;
    };
    Object.defineProperty(DataSet.prototype, "message", {
        get: function () { return this._message; },
        enumerable: false,
        configurable: true
    });
    DataSet.prototype.setMessage = function (message) {
        this._message = message;
        return this;
    };
    Object.defineProperty(DataSet.prototype, "metaInfo", {
        get: function () { return this._metaInfo; },
        enumerable: false,
        configurable: true
    });
    DataSet.prototype.setMetaInfo = function (metaInfo) {
        this._metaInfo = metaInfo;
        return this;
    };
    Object.defineProperty(DataSet.prototype, "crud", {
        get: function () { return this._crud; },
        enumerable: false,
        configurable: true
    });
    DataSet.prototype.setCrud = function (value) { this._crud = value; return this; };
    DataSet.prototype.appendDataSet = function (source) {
        var _this = this;
        source.head.fields.forEach(function (meta) {
            _this.head.setValue(meta.code, source.head.getValue(meta.code));
        });
        //保存当前状态
        // let srcEnable = source.bindEnabled;
        var srcRecNo = source.recNo;
        // let tarEnable = this.bindEnabled;
        //开始复制
        // source.setBindEnabled(false);
        // this.setBindEnabled(false);
        source.first();
        while (source.fetch()) {
            this.append();
            source._fields.forEach(function (meta) {
                _this.setValue(meta.code, source.getValue(meta.code));
            });
        }
        //恢复状态
        source.setRecNo(srcRecNo);
        // source.setBindEnabled(srcEnable);
        // this.setBindEnabled(tarEnable);
    };
    DataSet.prototype.setSort = function () {
        var fields = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            fields[_i] = arguments[_i];
        }
        var sort = 0;
        this._records.sort(function (row1, row2) {
            for (var i = 0; i < fields.length; i++) {
                var item = fields[i];
                if (!item) {
                    throw new Error("sort field is empty");
                }
                var params = item.split(" ");
                var field = params[0];
                var param1 = row1.getValue(field);
                var param2 = row2.getValue(field);
                if (typeof param1 == "number" && typeof param2 == "number") {
                    if (param1 > param2)
                        sort = 1;
                    if (param1 == param2)
                        sort = 0;
                    if (param1 < param2)
                        sort = -1;
                }
                else if (Number(param1) && Number(param2)) {
                    param1 = Number(param1);
                    param2 = Number(param2);
                    if (param1 > param2)
                        sort = 1;
                    if (param1 == param2)
                        sort = 0;
                    if (param1 < param2)
                        sort = -1;
                }
                else {
                    param1 = String(param1);
                    param2 = String(param2);
                    if (param1 == param2)
                        sort = 0;
                    else
                        sort = param1 > param2 ? 1 : -1;
                }
                if (sort != 0) {
                    if (params.length == 1 || params[1].toLowerCase() == "asc") {
                        sort = sort > 0 ? 1 : -1;
                    }
                    else if (params[1].toLowerCase() == "desc") {
                        sort = sort > 0 ? -1 : 1;
                    }
                    else {
                        throw new Error("not support [".concat(params[1], "] sort mode"));
                    }
                    return sort;
                }
            }
            return sort;
        });
    };
    DataSet.prototype.reverse = function () {
        var _this = this;
        var records = this._records.reverse();
        this.clear();
        records.forEach(function (row) {
            _this.append();
            var items = Array.from(row.items);
            items.forEach(function (item) {
                _this.setValue(item[0], item[1]);
            });
        });
    };
    DataSet.prototype.forEach = function (fn) {
        for (var _i = 0, _a = this._records; _i < _a.length; _i++) {
            var row = _a[_i];
            fn.call(this, row);
        }
    };
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
    // setBindEnabled(value: boolean): DataSet { this._bindEnabled = value; return this; }
    DataSet.prototype.getPromise = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.state > 0)
                resolve(_this);
            else
                reject(_this);
        });
    };
    DataSet.prototype.locationRow = function (row) {
        var recNo = 0;
        this.records.forEach(function (value, index) {
            if (value.json === row.json) {
                recNo = index + 1;
                return recNo;
            }
        });
        return recNo;
    };
    return DataSet;
}());
export default DataSet;
// let ds = new DataSet();
// ds.head.setValue('id', 100);
// ds.append();
// ds.setValue('code', 'a');
// ds.setValue('name', 'jason');
// ds.append();
// ds.setValue('code', 'b');
// ds.setValue('name', 'bade');
// ds.fields.get("code").name = "代码";
// ds.metaInfo = true;
// console.log(ds.json);
// JUnit.assertEquals(1, ds.json, '{"head":{"id":100},"body":[["code","name"],["a","jason"],["b","bade"]]}');
// JUnit.assertEquals(2, ds.setMetaInfo(true).json, '{"meta":{"head":[{"id":[null]}],"body":[{"code":[null,"代码"]},{"name":[null]}]},"head":[100],"body":[["a","jason"],["b","bade"]]}')
// JUnit.assertEquals(3, ds.setMetaInfo(false).json, '{"head":{"id":100},"body":[["code","name"],["a","jason"],["b","bade"]]}');
// JUnit.assertEquals(4, ds.setMetaInfo(false).json, '{"head":{"id":100},"body":[["code","name"],["a","jason"],["b","bade"]]}');
// let json = '{"meta":{"head":[{"id":["n1","ID","DataID"]}],"body":[{"code":[null]},{"name":["s10","代码"]}]},"head":[100],"body":[["a","jason"],["b","bade"]]}';
// let ds2 = new DataSet().json = json;
// JUnit.assertEquals(11, ds2.json, json);
// ds2.setMetaInfo(false);
// ds2.last();
// ds2.delete();
// JUnit.assertEquals(13, ds2.json, '{"head":{"id":100},"body":[["code","name"],["a","jason"]]}');
// ds2.last();
// ds2.delete();
// JUnit.assertEquals(14, ds2.json, '{"head":{"id":100}}');
