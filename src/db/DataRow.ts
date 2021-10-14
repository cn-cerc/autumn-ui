import FieldDefs from "./FieldDefs.js";
import * as RecordState from "./RecordState.js";

export default class DataRow {
    dataSet;
    fieldDefs;
    state = RecordState.dsNone;
    items = new Map();
    delta = new Map();

    constructor(dataSet) {
        if (dataSet) {
            this.dataSet = dataSet;
            this.fieldDefs = dataSet.getFieldDefs();
        } else {
            this.fieldDefs = new FieldDefs();
        }
    }

    getState() {
        return this.state;
    }

    setState(recordState) {
        if (recordState == RecordState.dsEdit) {
            if (this.state == RecordState.dsInsert) {
                // throw new Error("当前记录为插入状态 不允许被修改");
                return this;
            }
        }
        if (recordState.equals(RecordState.dsNone)) {
            delta.clear();
        }
        this.state = recordState;
        return this;
    }

    close() {
        this.items.clear();
    }

    setField(field, value) {
        return this.setValue(field, value);
    }

    setValue(field, value) {
        if (!field)
            throw new Error('field is null!');

        this.addFieldDef(field);

        this.items.set(field, value)
    }

    copyValues(source, defs) {
        if (defs == undefined)
            defs = source.getFieldDefs();

        defs.forEach((meta) => {
            this.setField(meta.getCode(), source.getValue(meta.getCode()));
        });
    }

    addFieldDef(field) {
        if (field == null)
            throw new Error("field is null");
        if (!this.fieldDefs.exists(field)) {
            this.fieldDefs.add(field);
        }
    }

    getField(field) {
        return this.getValue(field);
    }

    getValue(field) {
        if (!field) {
            throw new Error('field is null!')
        }
        let value = this.items.get(field);
        return value == undefined ? null : value;
    }

    getString(field) {
        let value = this.getValue(field);
        return value ? "" + value : "";
    }

    getBoolean(field) {
        let value = this.getField(field);
        return value;
    }

    getDouble(field) {
        let value = this.getValue(field);
        return parseFloat(value) ? parseFloat(value) : 0;
    }

    getText(field) {
        let meta = this.getFieldDefs().add(field);
        if (meta.OnGetText != undefined) {
            return meta.OnGetText(this, meta);
        } else
            return this.getField(field);
    }

    setText(field, value) {
        let meta = this.getFieldDefs().add(field);
        if (meta.OnSetText != undefined) {
            this.setField(meta.OnSetText(this, meta));
        } else
            this.setField(field, value);
        return this;
    }

    size() {
        return this.items.size;
    }

    getDelta() {
        return this.delta;
    }

    getJson() {
        var obj = {}
        this.items.forEach((v, k) => {
            obj[k] = v
        })
        return obj
    }

    setJson(jsonObj) {
        if (!jsonObj) {
            throw new Error('field is null!')
        }
        if (typeof jsonObj === 'string') {
            jsonObj = JSON.parse(jsonObj)
        }
        for (var k in jsonObj) {
            this.setField(k, jsonObj[k])
        }
    }

    getFieldDefs() {
        if (this.dataSet) {
            return this.dataSet.getFieldDefs();
        } else {
            if (!this.fieldDefs)
                this.fieldDefs = new FieldDefs();
            return this.fieldDefs;
        }
    }

    getItems() {
        return this.items;
    }
}

DataRow.prototype.forEach = function (callback) {
    var arr = this.items;
    for (var i = 0; i < arr.length; i++)
        callback(arr[i], i);
    return;
}

// let row = new DataRow();
// row.setField('code', 'a');
// row.setField('name', 'jason');
// row.setField("flag", false);
// console.log(row.getJson())

// row.getItems().forEach((k, v) => {
//     console.log(k + "=" + v);
// })

// console.log(row.getField('value'));
// console.log(row.getBoolean('flag') ? "true" : "false");

// let row2 = new DataRow();
// row2.copyValues(row, row.getFieldDefs());
// console.log(row2.getJson());