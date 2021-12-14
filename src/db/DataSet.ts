import DataRow, { DataRowState } from './DataRow';
import DataSource, { IDataSource } from './DataSource';
import FieldDefs from './FieldDefs';
import FieldMeta from './FieldMeta';
import SearchDataSet from './SearchDataSet';

export type DataSetProps = {
    state?: number;
    message?: string;
}


export default class DataSet implements IDataSource {
    private _recNo: number = 0;
    private _fetchNo: number = -1;
    private _state: number = 0;
    private _message: string = '';
    private _fields: FieldDefs = new FieldDefs();
    private _metaInfo: boolean = false;
    private _meta: any;
    private _head: DataRow = new DataRow();
    private _records: DataRow[] = [];
    private _garbage: DataRow[] = [];
    private _search: SearchDataSet;
    private _crud: boolean;
    //提供数据绑定服务
    // private _bindControls: Set<DataControl> = new Set<DataControl>();
    // private _bindEnabled: boolean = true;

    constructor(props: DataSetProps = {}) {
        if (props) {
            const { state, message } = props;
            if (state)
                this._state = state;
            if (message)
                this._message = message;
        }
    }

    asDataSource(): DataSource {
        return new DataSource(this.records);
    }

    get current(): DataRow {
        if (this.eof() || this.bof())
            return null;

        let i = this._recNo - 1;
        return this._records[i];
    }

    append(): DataSet {
        let record = new DataRow(this);
        record.setState(DataRowState.Insert);
        this._records.push(record)
        this._recNo = this._records.length;
        return this
    }

    edit(): DataSet {
        let row = this.current;
        if (row.state == DataRowState.None) {
            row.setHistory(row.clone());
            row.setState(DataRowState.Update);
        }
        return this;
    }

    delete(): DataSet {
        if (!this.current)
            throw new Error("current is null, delete fail")
        this._garbage.push(this.current.setState(DataRowState.Delete));

        this._records.splice(this.recNo - 1, 1);

        if (this._fetchNo > -1) {
            this._fetchNo--;
        }

        // this.refreshBind({ size: true });
        return this;
    }

    first(): boolean {
        if (this._records.length > 0) {
            this.setRecNo(1)
        } else {
            this.setRecNo(0);
        }
        this._fetchNo = -1
        return this._recNo > 0;
    }

    last(): boolean {
        this.setRecNo(this._records.length);
        return this._recNo > 0;
    }

    prior(): boolean {
        if (this._recNo > 0)
            this.setRecNo(this.recNo - 1);
        return this._recNo > 0 && this._recNo <= this._records.length;
    }

    next(): boolean {
        if (this._recNo <= this._records.length)
            this.setRecNo(this.recNo + 1);
        return this._recNo > 0 && this._recNo <= this._records.length;
    }

    bof(): boolean {
        return this._recNo == 0
    }

    eof(): boolean {
        return this._records.length == 0 || this._recNo > this._records.length
    }

    get size(): number { return this._records.length }

    get recNo(): number { return this._recNo }
    setRecNo(recNo: number): DataSet {
        if (recNo > (this._records.length + 1)) {
            throw new Error(`RecNo ${this._recNo} 大于总长度 ${this._records.length}`)
        } else if (recNo < 0) {
            throw new Error(`RecNo ${this._recNo} 不允许小于零`)
        } else if (this._recNo != recNo) {
            this._recNo = recNo;
            // this.refreshBind({ recNo: true });
        }
        return this;
    }

    fetch(): boolean {
        var result = false
        if (this._fetchNo < (this._records.length - 1)) {
            this._fetchNo++;
            this.setRecNo(this._fetchNo + 1);
            result = true;
        }
        return result
    }

    copyRecord(source: DataRow, fields: FieldDefs = null) {
        let defs = fields ? fields : source.fields;
        if (this._search) {
            this._search.remove(this.current)
            this.current.copyValues(source, defs)
            this._search.append(this.current)
        } else {
            this.current.copyValues(source, defs)
        }
    }

    exists(field: string) {
        return this._fields.exists(field);
    }

    get head(): DataRow {
        if (this._head == null) {
            this._head = new DataRow();
        }
        return this._head;
    }
    getHead(): DataRow { return this.head }

    get records(): DataRow[] {
        return this._records;
    }

    get fields(): FieldDefs { return this._fields }

    setValue(field: string, value: any): DataSet {
        this.current.setValue(field, value)
        return this;
    }

    getValue(field: string): object {
        return this.current.getValue(field);
    }

    getString(field: string): string {
        return this.current.getString(field);
    }

    getDouble(field: string): number {
        return this.current.getDouble(field);
    }

    getText(field: string): string {
        return this.current.getText(field);
    }

    mergeChangeLog(): DataSet {
        for (let row of this.records) {
            row.setState(DataRowState.None);
            row.setHistory(null);
        }
        this._garbage = [];
        this._recNo = 0;
        return this;
    }

    clear(): void {
        this.head.fields.clear();
        this._fields.clear();
        this.close();
    }

    close(): void {
        this._head.close();
        this._search = null;
        this._records = [];
        this._recNo = 0;
        this._fetchNo = -1;
    }

    // 用于查找多次，调用时，会先进行排序，以方便后续的相同Key查找
    locate(fields: string, value: any): boolean {
        if (!this._search) {
            this._search = new SearchDataSet(this)
        }

        let record = this._search.get(fields, value)
        if (record) {
            this.setRecNo(Array.from(this._records).indexOf(record) + 1);
            return true;
        } else {
            return false;
        }
    }

    get json(): string {
        let jsonObj: any = {}
        if (this._state !== 0) {
            jsonObj.state = this._state
        }
        if (this._message) {
            jsonObj.message = this._message
        }
        if (this._metaInfo) {
            jsonObj.meta = {};

            if (this.head.fields.size > 0) {
                let head: any = [];
                this.head.fields.forEach((meta: FieldMeta) => {
                    let item: any = {};
                    if (meta.remark) {
                        item[meta.code] = [meta.name, meta.type, meta.remark];
                    } else if (meta.type) {
                        item[meta.code] = [meta.name, meta.type];
                    } else if (meta.name) {
                        item[meta.code] = [meta.name];
                    } else {
                        item[meta.code] = [];
                    }
                    head.push(item);
                })
                jsonObj.meta.head = head;
            }

            if (this.fields.items.length > 0) {
                let body: any = [];
                for (let meta of this.fields.items) {
                    let item: any = {};
                    if (meta.remark) {
                        item[meta.code] = [meta.name, meta.type, meta.remark];
                    } else if (meta.type) {
                        item[meta.code] = [meta.name, meta.type];
                    } else if (meta.name) {
                        item[meta.code] = [meta.name];
                    } else {
                        item[meta.code] = [];
                    }
                    body.push(item);
                }
                if (this._crud)
                    body.push({ _state_: [] });
                jsonObj.meta.body = body;
            }
        }
        if (this._head.size > 0) {
            if (this._metaInfo) {
                jsonObj.head = []
                this._head.fields.forEach((meta: FieldMeta) => {
                    jsonObj.head.push(this._head.getValue(meta.code))
                })
            } else {
                jsonObj.head = {};
                this._head.forEach((key: string, value: any) => {
                    jsonObj.head[key] = value;
                });
            }
        }
        jsonObj.body = [];
        if (!this._metaInfo) {
            let item: any = [];
            for (let meta of this._fields.items)
                item.push(meta.code);
            item.push('_state_');
            jsonObj.body.push(item);
        }
        if (this.crud) {
            //insert && update
            for (let row of this._records) {
                if (row.state == DataRowState.Insert) {
                    let item: any = [];
                    for (let meta of this._fields.items) {
                        item.push(row.getValue(meta.code));
                    }
                    item.push(row.state);
                    jsonObj.body.push(item)
                } else if (row.state == DataRowState.Update) {
                    let item: any = [];
                    for (let meta of this._fields.items) {
                        item.push(row.history.getValue(meta.code));
                    }
                    item.push(row.history.state);
                    jsonObj.body.push(item)
                    item = [];
                    for (let meta of this._fields.items) {
                        item.push(row.getValue(meta.code));
                    }
                    item.push(row.state);
                    jsonObj.body.push(item)
                }
            }
            //delete
            for (let row of this._garbage) {
                var item: any = []
                for (let meta of this._fields.items) {
                    item.push(row.getValue(meta.code));
                }
                item.push(row.state);
                jsonObj.body.push(item)
            }
        } else if (this.size > 0) {
            for (let row of this._records) {
                var item: any = []
                for (let meta of this._fields.items)
                    item.push(row.getValue(meta.code));
                jsonObj.body.push(item)
            }
        }
        return JSON.stringify(jsonObj);
    }

    setJson(value: string) {
        this.clear();
        if (!value)
            throw new Error('json is null!')
        let jsonObj = JSON.parse(value);
        if (jsonObj.hasOwnProperty('state')) {
            this._state = jsonObj.state
        }
        if (jsonObj.hasOwnProperty('message')) {
            this._message = jsonObj.message
        }

        let defs: string[] = [];
        if (jsonObj.hasOwnProperty('meta')) {
            this.setMetaInfo(true);
            this._meta = jsonObj.meta;
            if (this._meta.head) {
                this._head = new DataRow();
                let i = 0;
                this._meta.head.forEach((map: any) => {
                    for (let key in map) {
                        let values = map[key];
                        let meta = this._head.fields.add(key);
                        if (values.length > 2)
                            meta.setRemark(values[2]);
                        if (values.length > 1)
                            meta.setType(values[1]);
                        if (values.length > 0)
                            meta.setName(values[0]);
                        this._head.setValue(key, jsonObj.head[i]);
                        i = i + 1;
                    }
                })
            }
            if (this._meta.body) {
                let i = 0;
                this._meta.body.forEach((map: any) => {
                    for (let key in map) {
                        defs[i] = key;
                        if ('_state_' == key) {
                            this.setCrud(true);
                            continue;
                        }
                        let values = map[key];
                        let meta = this._fields.add(key);
                        if (values.length > 2)
                            meta.setRemark(values[2]);
                        if (values.length > 1)
                            meta.setType(values[1]);
                        if (values.length > 0)
                            meta.setName(values[0]);
                        i = i + 1;
                    }
                });
            }
        } else {
            this.setMetaInfo(false);
            if (jsonObj.hasOwnProperty('head'))
                this._head.setJsonObject(jsonObj.head);
        }

        var data = jsonObj.dataset || jsonObj.body;
        if (data) {
            if (data && data.length > 0) {
                let history: DataRow = null;
                for (var i = 0; i < data.length; i++) {
                    if (!this._meta && i == 0) {
                        defs = data[0];
                        if (this._crud)
                            defs.push('_state_');
                        continue;
                    }
                    let item = data[i];
                    let row = new DataRow(this);
                    for (let j = 0; j < defs.length; j++) {
                        if ('_state_' == defs[j]) {
                            switch (item[j]) {
                                case 0: row.setState(DataRowState.None); break;
                                case 1: row.setState(DataRowState.Insert); break;
                                case 2: row.setState(DataRowState.Update); break;
                                case 3: {
                                    row.setState(DataRowState.Delete); break;
                                }
                                case 4: row.setState(DataRowState.History); break;
                                default:
                                    throw Error('error state value: ' + item[j]);
                            }
                        } else
                            row.setValue(defs[j], item[j]);
                    }
                    //
                    if (row.state == DataRowState.Delete)
                        this._garbage.push(row);
                    else if (row.state == DataRowState.History) {
                        if (history != null)
                            throw Error("history is not null");
                        history = row;
                    } else if (row.state == DataRowState.Update) {
                        if (history == null)
                            throw Error("history is null");
                        row.setHistory(history);
                        history = null;
                        this.records.push(row);
                    } else
                        this.records.push(row);
                }
            }
            this.first()
        }
    }
    get jsonObject(): object {
        let json: any = {};
        json.state = this._state;
        json.message = this._message;
        if (this._metaInfo) {
            json.meta = { head: {}, body: {} };
            json.meta.head = this.head.fields.json;
            json.meta.body = this.fields.json;;
        }
        json.head = this.head.jsonObject;
        json.body = [];
        for (let row of this._records)
            json.body.push(row.jsonObject);
        json.metaInfo = this._metaInfo;
        return json;
    }

    get state(): number { return this._state }
    setState(state: number): DataSet {
        this._state = state;
        return this;
    }

    get message(): string { return this._message }
    setMessage(message: string): DataSet {
        this._message = message;
        return this;
    }

    get metaInfo(): boolean { return this._metaInfo }
    setMetaInfo(metaInfo: boolean): DataSet {
        this._metaInfo = metaInfo;
        return this;
    }

    get crud(): boolean { return this._crud }
    setCrud(value: boolean): DataSet { this._crud = value; return this; }

    appendDataSet(source: DataSet) {
        source.head.fields.forEach((meta: FieldMeta) => {
            this.head.setValue(meta.code, source.head.getValue(meta.code))
        })
        //保存当前状态
        // let srcEnable = source.bindEnabled;
        let srcRecNo = source.recNo;
        // let tarEnable = this.bindEnabled;
        //开始复制
        // source.setBindEnabled(false);
        // this.setBindEnabled(false);
        source.first();
        while (source.fetch()) {
            this.append();
            source._fields.forEach((meta: FieldMeta) => {
                this.setValue(meta.code, source.getValue(meta.code))
            });
        }
        //恢复状态
        source.setRecNo(srcRecNo);
        // source.setBindEnabled(srcEnable);
        // this.setBindEnabled(tarEnable);
    }

    setSort(...fields: string[]) {
        let sort = 0;
        this._records.sort(function (row1, row2) {
            for (let i = 0; i < fields.length; i++) {
                let item = fields[i];
                if (!item) {
                    throw new Error("sort field is empty");
                }
                let params = item.split(" ");
                let field = params[0];
                let param1 = row1.getValue(field);
                let param2 = row2.getValue(field);
                if (typeof param1 == "number" && typeof param2 == "number") {
                    if (param1 > param2) sort = 1;
                    if (param1 == param2) sort = 0;
                    if (param1 < param2) sort = -1;
                } else if(Number(param1) && Number(param2)) {
                    param1 = Number(param1);
                    param2 = Number(param2);
                    if (param1 > param2) sort = 1;
                    if (param1 == param2) sort = 0;
                    if (param1 < param2) sort = -1;
                } else {
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
                    } else if (params[1].toLowerCase() == "desc") {
                        sort = sort > 0 ? -1 : 1;
                    } else {
                        throw new Error(`not support [${params[1]}] sort mode`);
                    }
                    return sort;
                }
            }
            return sort;
        })
    }

    forEach(fn: (row: DataRow) => void) {
        for (let row of this._records)
            fn.call(this, row);
    }

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

    getPromise(): Promise<DataSet> {
        return new Promise<DataSet>((resolve, reject) => {
            if (this.state > 0)
                resolve(this);
            else
                reject(this)
        });
    }

    locationRow(row: DataRow): number {
        let recNo = 0;
        this.records.forEach((value, index) => {
            if (value.json === row.json) {
                recNo = index + 1
                return recNo;
            }
        })
        return recNo
    }
}

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
