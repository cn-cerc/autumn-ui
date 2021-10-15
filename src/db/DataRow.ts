import { assertEquals } from "../JUnit";
import DataSet from "./DataSet";
import FieldDefs from "./FieldDefs";
import FieldMeta from "./FieldMeta";
import * as RecordState from "./RecordState";

export default class DataRow {
    private dataSet: DataSet;
    private fieldDefs: FieldDefs;
    private state: number = RecordState.dsNone;
    private items: Map<string, any> = new Map<string, any>();
    private delta: Map<string, any> = new Map<string, any>();

    constructor(dataSet: DataSet = null) {
        if (dataSet) {
            this.dataSet = dataSet;
            this.fieldDefs = dataSet.getFieldDefs();
        } else {
            this.fieldDefs = new FieldDefs();
        }
    }

    getState(): number {
        return this.state;
    }

    setState(recordState: number): DataRow {
        if (recordState == RecordState.dsEdit) {
            if (this.state == RecordState.dsInsert) {
                // throw new Error("当前记录为插入状态 不允许被修改");
                return this;
            }
        }
        if (recordState == RecordState.dsNone) {
            this.delta.clear();
        }
        this.state = recordState;
        return this;
    }

    close(): void {
        this.items.clear();
    }

    setValue(field: string, value: any): DataRow {
        if (!field)
            throw new Error('field is null!');

        this.addFieldDef(field);

        this.items.set(field, value);

        return this;
    }

    copyValues(source: DataRow, defs: FieldDefs = null) {
        if (defs == null)
            defs = source.getFieldDefs();

        defs.forEach((meta: FieldMeta) => {
            this.setValue(meta.getCode(), source.getValue(meta.getCode()));
        });
    }

    private addFieldDef(field: string) {
        if (field == null)
            throw new Error("field is null");
        if (!this.fieldDefs.exists(field)) {
            this.fieldDefs.add(field);
        }
    }

    getValue(field: string): any {
        if (!field)
            throw new Error('field is null!')
        let value = this.items.get(field);
        return value == undefined ? null : value;
    }

    getString(field: string): string {
        let value = this.getValue(field);
        return value ? "" + value : "";
    }

    getBoolean(field: string): boolean {
        return this.getValue(field) ? true : false;
    }

    getDouble(field: string): number {
        let value = this.getString(field);
        return parseFloat(value) ? parseFloat(value) : 0;
    }

    getText(field: string) {
        let meta = this.getFieldDefs().add(field);
        if (meta.onGetText != undefined) {
            return meta.onGetText(this, meta);
        } else
            return this.getString(field);
    }

    setText(field: string, value: object): DataRow {
        let meta = this.getFieldDefs().add(field);
        if (meta.OnSetText != undefined) {
            this.setValue(meta.getCode(), meta.OnSetText(this, meta));
        } else
            this.setValue(field, value);
        return this;
    }

    size(): number {
        return this.items.size;
    }

    getDelta(): Map<string, any> {
        return this.delta;
    }

    getJson(): string {
        let obj: any = {}
        for(let meta of this.fieldDefs.getItems()){
            let key = meta.getCode();
            obj[key] = this.getValue(key);
        }
        return JSON.stringify(obj);
    }

    setJson(jsonObj: string | JSON) {
        if (!jsonObj) {
            throw new Error('jsonText is null!')
        }
        let json: any;
        if (typeof jsonObj === 'string') {
            json = JSON.parse(jsonObj)
        } else {
            json = jsonObj;
        }
        for (let k in json) {
            this.setValue(k, json[k])
        }
    }

    getFieldDefs(): FieldDefs {
        if (this.dataSet) {
            return this.dataSet.getFieldDefs();
        } else {
            if (!this.fieldDefs)
                this.fieldDefs = new FieldDefs();
            return this.fieldDefs;
        }
    }

    getItems(): Map<string, object> {
        return this.items;
    }

    forEach(fn: (key: string, value: any) => void) {
        for(let meta of this.fieldDefs.getItems()){
            let key = meta.getCode();
            fn.call(this, key, this.getValue(key));
        }
    }

    getDataSet(): DataSet{
        return this.dataSet;
    }
}

// let row1 = new DataRow();
// row1.setValue('code', 'a');
// row1.setValue('name', 'jason');
// row1.setValue("flag", false);

// assertEquals(1, row1.getJson(), '{"code":"a","name":"jason","flag":false}');
// assertEquals(2, row1.getValue('value'), null);
// assertEquals(3, false, row1.getBoolean('flag'));

// let row2 = new DataRow();
// row2.copyValues(row1);
// assertEquals(4, row1.getJson(), row2.getJson());
