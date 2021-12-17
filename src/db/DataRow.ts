import DataSet from "./DataSet";
import DataSource, { IDataSource } from "./DataSource";
import FieldDefs from "./FieldDefs";
import FieldMeta from "./FieldMeta";

export enum DataRowState {
    None,
    Insert,
    Update,
    Delete,
    History
}

export default class DataRow implements IDataSource {
    private _dataSet: DataSet;
    private _fields: FieldDefs;
    private _state: number = DataRowState.None;
    private _items: Map<string, any> = new Map<string, any>();
    private _delta: Map<string, any> = new Map<string, any>();
    private _history: DataRow;
    //提供数据绑定服务
    // private _bindControls: Set<DataControl> = new Set<DataControl>();
    // private _bindEnabled: boolean = true;

    constructor(dataSet: DataSet = null) {
        if (dataSet) {
            this._dataSet = dataSet;
            this._fields = dataSet.fields;
        } else {
            this._fields = new FieldDefs();
        }
    }

    asDataSource(): DataSource {
        return new DataSource([this]);
    }

    get state(): number { return this._state }
    setState(value: DataRowState): DataRow {
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
    }

    close(): void {
        this._items.clear();
    }

    setValue(field: string, value: any): DataRow {
        if (!field)
            throw new Error('field is null!');

        this.addFieldDef(field);

        this._items.set(field, value);

        // if (this.bindEnabled) this.refreshBind();

        return this;
    }

    copyValues(source: DataRow, defs: FieldDefs = null) {
        if (defs == null)
            defs = source.fields;

        defs.forEach((meta: FieldMeta) => {
            this.setValue(meta.code, source.getValue(meta.code));
        });
    }

    private addFieldDef(field: string) {
        if (field == null)
            throw new Error("field is null");
        if (!this._fields.exists(field)) {
            this._fields.add(field);
        }
    }

    getValue(field: string): any {
        if (!field)
            throw new Error('field is null!')
        let value = this._items.get(field);
        return value == undefined ? null : value;
    }

    getNumber(field: string): number {
        let value = this.getValue(field);
        if (value == null || value == '') {
            return 0;
        }
        if (typeof value == 'number') {
            return value;
        } else if (value instanceof Number) {
            let tmp: Number = value;
            return tmp.valueOf();
        } else {
            return Number.parseFloat(value);
        }
    }
    getInt(field: string): number { return this.getNumber(field) }
    getDouble(field: string): number { return this.getNumber(field) }

    getString(field: string): string {
        let value = this.getValue(field);
        return value ? "" + value : "";
    }

    getBoolean(field: string): boolean {
        return this.getValue(field) ? true : false;
    }

    getText(field: string) {
        let meta = this.fields.add(field);
        if (meta.onGetText != undefined) {
            return meta.onGetText(this, meta);
        } else
            return this.getString(field);
    }

    setText(field: string, value: string): DataRow {
        let meta = this.fields.add(field);
        if (meta.onSetText != undefined) {
            this.setValue(meta.code, meta.onSetText(this, meta, value));
        } else
            this.setValue(field, value);
        return this;
    }

    get size(): number { return this._items.size }

    get delta(): Map<string, any> { return this._delta }

    get json(): string {
        let obj: any = {}
        for (let meta of this._fields.items) {
            let key = meta.code;
            obj[key] = this.getValue(key);
        }
        return JSON.stringify(obj);
    }
    setJson(jsonObj: string): DataRow {
        if (!jsonObj)
            throw new Error('jsonText is null!')
        let json = JSON.parse(jsonObj)
        for (let k in json)
            this.setValue(k, json[k])
        return this;
    }

    get jsonObject(): object {
        let json: any = {};
        for (let meta of this._fields.items)
            json[meta.code] = this.getValue(meta.code);
        return json;
    }
    setJsonObject(jsonObject: any): DataRow {
        let keys = Object.keys(jsonObject);
        for (let key of keys)
            this.setValue(key, jsonObject[key]);
        return this;
    }

    get fields(): FieldDefs {
        if (this._dataSet) {
            return this._dataSet.fields;
        } else {
            if (!this._fields)
                this._fields = new FieldDefs();
            return this._fields;
        }
    }

    get items(): Map<string, object> { return this._items }

    forEach(fn: (key: string, value: any) => void) {
        for (let meta of this._fields.items) {
            let key = meta.code;
            fn.call(this, key, this.getValue(key));
        }
    }

    get dataSet(): DataSet { return this._dataSet }

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

    get current(): DataRow {
        return this;
    }

    clone(): DataRow {
        let row = new DataRow();
        for (let meta of this._fields.items) {
            let key = meta.code;
            row.setValue(key, this.getValue(key));
        }
        return row;
    }

    get history(): DataRow { return this._history }
    setHistory(history: DataRow) {
        this._history = history;
        if (this._history)
            this._history.setState(DataRowState.History);
        return this
    }

    has(field: string): boolean {
        return this.fields.exists(field) && this.getString(field) != '';
    }
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
// console.log(row2.jsonObject);

// let row3 = new DataRow();
// row3.jsonObject = row2.jsonObject;
// console.log(row3.jsonObject);
// console.log(row3.json);
