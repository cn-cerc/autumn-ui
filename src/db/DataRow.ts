import DataBind from "./DataBind";
import DataControl from "./DataControl";
import DataSet from "./DataSet";
import FieldDefs from "./FieldDefs";
import FieldMeta from "./FieldMeta";
import * as RecordState from "./RecordState";

export default class DataRow implements DataBind {
    private _dataSet: DataSet;
    private _fieldDefs: FieldDefs;
    private _state: number = RecordState.dsNone;
    private _items: Map<string, any> = new Map<string, any>();
    private _delta: Map<string, any> = new Map<string, any>();
    //提供数据绑定服务
    private _bindControls: Set<DataControl> = new Set<DataControl>();
    private _bindEnabled: boolean = true;

    constructor(dataSet: DataSet = null) {
        if (dataSet) {
            this._dataSet = dataSet;
            this._fieldDefs = dataSet.fieldDefs;
        } else {
            this._fieldDefs = new FieldDefs();
        }
    }

    set state(recordState: number) {
        if (recordState == RecordState.dsEdit) {
            if (this._state == RecordState.dsInsert) {
                // throw new Error("当前记录为插入状态 不允许被修改");
            }
        }
        if (recordState == RecordState.dsNone) {
            this._delta.clear();
        }
        this._state = recordState;
    }
    get state(): number { return this._state }

    public close(): void {
        this._items.clear();
    }

    public setValue(field: string, value: any): DataRow {
        if (!field)
            throw new Error('field is null!');

        this.addFieldDef(field);

        this._items.set(field, value);

        if (this.bindEnabled)
            this.refreshBind();

        return this;
    }

    public copyValues(source: DataRow, defs: FieldDefs = null) {
        if (defs == null)
            defs = source.fieldDefs;

        defs.forEach((meta: FieldMeta) => {
            this.setValue(meta.getCode(), source.getValue(meta.getCode()));
        });
    }

    private addFieldDef(field: string) {
        if (field == null)
            throw new Error("field is null");
        if (!this._fieldDefs.exists(field)) {
            this._fieldDefs.add(field);
        }
    }

    public getValue(field: string): any {
        if (!field)
            throw new Error('field is null!')
        let value = this._items.get(field);
        return value == undefined ? null : value;
    }

    public getString(field: string): string {
        let value = this.getValue(field);
        return value ? "" + value : "";
    }

    public getBoolean(field: string): boolean {
        return this.getValue(field) ? true : false;
    }

    public getDouble(field: string): number {
        let value = this.getString(field);
        return parseFloat(value) ? parseFloat(value) : 0;
    }

    public getText(field: string) {
        let meta = this.fieldDefs.add(field);
        if (meta.onGetText != undefined) {
            return meta.onGetText(this, meta);
        } else
            return this.getString(field);
    }

    public setText(field: string, value: string): DataRow {
        let meta = this.fieldDefs.add(field);
        if (meta.onSetText != undefined) {
            this.setValue(meta.getCode(), meta.onSetText(this, meta, value));
        } else
            this.setValue(field, value);
        return this;
    }

    get size(): number { return this._items.size }

    get delta(): Map<string, any> { return this._delta }

    get json(): string {
        let obj: any = {}
        for (let meta of this._fieldDefs.fields) {
            let key = meta.getCode();
            obj[key] = this.getValue(key);
        }
        return JSON.stringify(obj);
    }

    set json(jsonObj: string | JSON) {
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

    get fieldDefs(): FieldDefs {
        if (this._dataSet) {
            return this._dataSet.fieldDefs;
        } else {
            if (!this._fieldDefs)
                this._fieldDefs = new FieldDefs();
            return this._fieldDefs;
        }
    }

    get items(): Map<string, object> { return this._items }

    forEach(fn: (key: string, value: any) => void) {
        for (let meta of this._fieldDefs.fields) {
            let key = meta.getCode();
            fn.call(this, key, this.getValue(key));
        }
    }

    get dataSet(): DataSet { return this._dataSet }

    registerBind(client: DataControl, register: boolean = true): void {
        if (register)
            this._bindControls.add(client);
        else
            this._bindControls.delete(client);
    }
    refreshBind(content: any = undefined): void {
        if (this._bindEnabled) {
            this._bindControls.forEach(child => {
                child.doChange(content);
            });
        }
    }
    get bindEnabled(): boolean { return this._bindEnabled };
    set bindEnabled(value: boolean) { this._bindEnabled = value }

}

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
