import DataRow from './DataRow';
import FieldDefs from './FieldDefs';
import FieldMeta from './FieldMeta';
import SearchDataSet from './SearchDataSet';
import DataBind from './DataBind';
import DataControl from './DataControl';
import DataSource from './DataSource';

export default class DataSet implements DataBind, DataSource {
    private _recNo: number = 0;
    private _fetchNo: number = -1;
    private _state: number = 0;
    private _message: string = '';
    private _fieldDefs: FieldDefs = new FieldDefs();
    private _metaInfo: boolean = false;
    private _meta: any;
    private _head: DataRow = new DataRow();
    private _records: DataRow[] = [];
    private _search: SearchDataSet;
    //提供数据绑定服务
    private _bindControls: Set<DataControl> = new Set<DataControl>();
    private _bindEnabled: boolean = true;

    constructor(props: any = null) {
        if (props) {
            const { state, message } = props;
            if (state)
                this._state = state;
            if (message)
                this._message = message;
        }
    }

    get current(): DataRow {
        if (this.eof() || this.bof())
            return null;

        let i = this._recNo - 1;
        return this._records[i];
    }

    append(): DataSet {
        let record = new DataRow(this);
        this._records.push(record)
        this._recNo = this._records.length;
        return this
    }

    delete(): void {
        let row = this.current;
        if (row) {
            let cur = this.recNo;
            this._records.splice(this.recNo - 1, 1);
            if (cur > this.size && this.size > 0)
                cur = this.size;
            else if (this.size == 0)
                cur = 0;

            this.recNo = cur;
            this.refreshBind({ size: true });
        }
    }

    first(): boolean {
        if (this._records.length > 0) {
            this.recNo = 1
        } else {
            this.recNo = 0;
        }
        this._fetchNo = -1
        return this._recNo > 0;
    }

    last(): boolean {
        this.recNo = this._records.length;
        return this._recNo > 0;
    }

    prior(): boolean {
        if (this._recNo > 0)
            this.recNo = this.recNo - 1;
        return this._recNo > 0 && this._recNo <= this._records.length;
    }

    next(): boolean {
        if (this._recNo <= this._records.length)
            this.recNo = this.recNo + 1;
        return this._recNo > 0 && this._recNo <= this._records.length;
    }

    bof(): boolean {
        return this._recNo == 0
    }

    eof(): boolean {
        return this._records.length == 0 || this._recNo > this._records.length
    }

    get size(): number { return this._records.length }

    set recNo(recNo: number) {
        if (recNo > (this._records.length + 1)) {
            throw new Error(`RecNo ${this._recNo} 大于总长度 ${this._records.length}`)
        } else if (recNo < 0) {
            throw new Error(`RecNo ${this._recNo} 不允许小于零`)
        } else if (this._recNo != recNo) {
            this._recNo = recNo;
            this.refreshBind({ recNo: true });
        }
    }
    get recNo(): number { return this._recNo }

    fetch(): boolean {
        var result = false
        if (this._fetchNo < (this._records.length - 1)) {
            this._fetchNo++;
            this.recNo = this._fetchNo + 1;
            result = true;
        }
        return result
    }

    copyRecord(source: DataRow, defs: FieldDefs) {
        let record = this.current;

        if (this._search) {
            this._search.remove(record)
            record.copyValues(source, defs)
            this._search.append(record)
        } else {
            record.copyValues(source, defs)
        }
    }

    exists(field: string) {
        return this._fieldDefs.exists(field);
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

    get fieldDefs(): FieldDefs { return this._fieldDefs }

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

    clear(): void {
        this.head.fieldDefs.clear();
        this._fieldDefs.clear();
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
            this.recNo = Array.from(this._records).indexOf(record) + 1;
            return true;
        } else {
            return false;
        }
    }

    get jsonString(): string {
        let json: any = {}
        if (this._state !== 0) {
            json.state = this._state
        }
        if (this._message) {
            json.message = this._message
        }
        if (this._metaInfo) {
            json.meta = {};

            if (this.head.fieldDefs.size > 0) {
                let head: any = [];
                this.head.fieldDefs.forEach((meta: FieldMeta) => {
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
                json.meta.head = head;
            }

            if (this._records.length > 0) {
                let body: any = [];
                this._fieldDefs.forEach((meta: FieldMeta) => {
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
                });
                json.meta.body = body;
            }
        }
        if (this._head.size > 0) {
            if (this._metaInfo) {
                json.head = []
                this._head.fieldDefs.forEach((meta: FieldMeta) => {
                    json.head.push(this._head.getValue(meta.code))
                })
            } else {
                json.head = {};
                this._head.forEach((key: string, value: any) => {
                    json.head[key] = value;
                });
            }
        }
        if (this.size > 0) {
            json.body = [];

            if (!this._metaInfo) {
                let item: any = [];
                for (let meta of this._fieldDefs.fields)
                    item.push(meta.code);
                json.body.push(item);
            }

            for (let row of this._records) {
                var item: any = []
                for (let meta of this._fieldDefs.fields) {
                    item.push(row.getValue(meta.code))
                }
                json.body.push(item)
            }
        }
        return JSON.stringify(json);
    }

    setJsonString(jsonObj: any) {
        this.clear();
        if (!jsonObj) {
            return;
        }
        if (!jsonObj) {
            throw new Error('json is null!')
        }
        if (typeof jsonObj === 'string') {
            jsonObj = JSON.parse(jsonObj)
        }
        if (jsonObj.hasOwnProperty('state')) {
            this._state = jsonObj.state
        }
        if (jsonObj.hasOwnProperty('message')) {
            this._message = jsonObj.message
        }

        let fields: string[] = [];
        if (jsonObj.hasOwnProperty('meta')) {
            this.setMetaInfo(true);
            this._meta = jsonObj.meta;
            if (this._meta.head) {
                this._head = new DataRow();
                let i = 0;
                this._meta.head.forEach((map: any) => {
                    for (let key in map) {
                        let values = map[key];
                        let meta = this._head.fieldDefs.add(key);
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
                        let values = map[key];
                        let meta = this._fieldDefs.add(key);
                        if (values.length > 2)
                            meta.setRemark(values[2]);
                        if (values.length > 1)
                            meta.setType(values[1]);
                        if (values.length > 0)
                            meta.setName(values[0]);
                        fields[i] = key;
                        i = i + 1;
                    }
                });
            }
        } else {
            this.setMetaInfo(false);
            if (jsonObj.hasOwnProperty('head'))
                this._head.setJson(jsonObj.head);
        }

        var data = jsonObj.dataset || jsonObj.body;
        if (data) {
            if (data && data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    if (!this._meta && i == 0) {
                        fields = data[0];
                        continue;
                    }
                    let item = data[i];
                    let row = this.append().current
                    for (let j = 0; j < fields.length; j++)
                        row.setValue(fields[j], item[j]);
                }
            }
            this.first()
        }
    }
    get json(): object {
        let json: any = {};
        json.state = this._state;
        json.message = this._message;
        json.head = this.head.json;
        json.body = [];
        for (let row of this._records)
            json.body.push(row.json);
        json.metaInfo = this._metaInfo;
        if (this._metaInfo) {
            json.meta = { head: {}, body: {} };
            json.meta.head = this.head.fieldDefs.json;
            json.meta.body = this.fieldDefs.json;;
        }
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

    get metaInfo() { return this._metaInfo }
    setMetaInfo(metaInfo: boolean): DataSet {
        this._metaInfo = metaInfo;
        return this;
    }

    appendDataSet(source: DataSet) {
        source.head.fieldDefs.forEach((meta: FieldMeta) => {
            this.head.setValue(meta.code, source.head.getValue(meta.code))
        })
        //保存当前状态
        let srcEnable = source.bindEnabled;
        let srcRecNo = source.recNo;
        let tarEnable = this.bindEnabled;
        //开始复制
        source.setBindEnabled(false);
        this.setBindEnabled(false);
        source.first();
        while (source.fetch()) {
            this.append();
            source._fieldDefs.forEach((meta: FieldMeta) => {
                this.setValue(meta.code, source.getValue(meta.code))
            });
        }
        //恢复状态
        source.recNo = srcRecNo;
        source.setBindEnabled(srcEnable);
        this.setBindEnabled(tarEnable);
    }

    forEach(fn: (row: DataRow) => void) {
        for (let row of this._records)
            fn.call(this, row);
    }

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
    setBindEnabled(value: boolean): DataSet { this._bindEnabled = value; return this; }

    getPromise(): Promise<DataSet> {
        return new Promise<DataSet>((resolve, reject) => {
            if (this.state > 0)
                resolve(this);
            else
                reject(this)
        });
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
// ds.fieldDefs.get("code").name = "代码";
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

