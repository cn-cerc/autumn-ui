import DataRow from './DataRow';
import FieldDefs from './FieldDefs';
import FieldMeta from './FieldMeta';
import SearchDataSet from './SearchDataSet';
import * as JUnit from "../JUnit";
import DataBind from './DataBind';
import { TComponent } from '../SummerCI';
import DataControl from './DataControl';
import DataSource from './DataSource';

export default class DataSet implements DataBind, DataSource {
    private recNo: number = 0;
    private fetchNo: number = -1;
    private state: number = 0;
    private message: string = '';
    private fieldDefs: FieldDefs = new FieldDefs();
    private metaInfo: boolean = false;
    private meta: any;
    private head: DataRow = new DataRow();
    private records: DataRow[] = [];
    private search: SearchDataSet;
    //提供数据绑定服务
    private bindControls: Set<DataControl> = new Set<DataControl>();
    private bindEnabled: boolean = true;

    constructor(json: string = null) {
        if (json) this.setJson(json);
    }

    getCurrent(): DataRow {
        if (this.eof()) {
            throw new Error('eof == true')
        } else if (this.bof()) {
            throw new Error('bof == true')
        } else {
            let i = this.recNo - 1;
            return this.records[i];
        }
    }

    append(): DataSet {
        let record = new DataRow(this);
        this.records.push(record)
        this.recNo = this.records.length;
        return this
    }

    delete(): void {
        let row = this.getCurrent();
        if (row) {
            this.setRecNo(this.getRecNo() - 1);
            this.records.splice(this.getRecNo(), 1);
        }
    }

    first(): boolean {
        if (this.records.length > 0) {
            this.recNo = 1
        } else {
            this.recNo = 0
        }
        this.fetchNo = -1
        return this.recNo > 0
    }

    last(): boolean {
        this.recNo = this.records.length;
        return this.recNo > 0
    }

    prior(): boolean {
        if (this.records.length == 0)
            return false;

        if (this.recNo > 1) {
            this.recNo--;
            return true
        } else {
            return false
        }
    }

    next(): boolean {
        if (this.records.length == 0)
            return false;

        if (this.recNo < this.records.length) {
            this.recNo++
            return true
        } else {
            return false
        }
    }

    bof(): boolean {
        return this.recNo === 0
    }

    eof(): boolean {
        return this.records.length === 0 || this.recNo > this.records.length
    }

    size(): number {
        return this.records.length
    }

    getRecNo(): number {
        return this.recNo
    }

    setRecNo(recNo: number): void {
        if (recNo > this.records.length) {
            throw new Error(`RecNo ${this.recNo} 大于总长度 ${this.records.length}`)
        } else {
            if (recNo > -1)
                this.recNo = recNo;
        }
    }

    fetch(): boolean {
        var result = false
        if (this.fetchNo < (this.records.length - 1)) {
            this.fetchNo++
            this.setRecNo(this.fetchNo + 1)
            result = true
        }
        return result
    }

    copyRecord(source: DataRow, defs: FieldDefs) {
        let record = this.getCurrent()

        if (this.search) {
            this.search.remove(record)
            record.copyValues(source, defs)
            this.search.append(record)
        } else {
            record.copyValues(source, defs)
        }
    }

    exists(field: string) {
        return this.fieldDefs.exists(field);
    }

    getHead(): DataRow {
        if (this.head == null) {
            this.head = new DataRow();
        }
        return this.head;
    }

    getRecords(): DataRow[] {
        return this.records;
    }

    getFieldDefs(): FieldDefs {
        return this.fieldDefs;
    }

    setValue(field: string, value: any): DataSet {
        this.getCurrent().setValue(field, value)
        return this;
    }

    getValue(field: string): object {
        return this.getCurrent().getValue(field);
    }

    getString(field: string): string {
        return this.getCurrent().getString(field);
    }

    getDouble(field: string): number {
        return this.getCurrent().getDouble(field);
    }

    getText(field: string): string {
        return this.getCurrent().getText(field);
    }

    clear(): void {
        this.getHead().getFieldDefs().clear();
        this.getFieldDefs().clear();
        this.close();
    }

    close(): void {
        this.head.close();
        this.search = null;
        this.records = [];
        this.recNo = 0;
        this.fetchNo = -1;
    }

    // 用于查找多次，调用时，会先进行排序，以方便后续的相同Key查找
    locate(fields: string, value: any): boolean {
        if (!this.search) {
            this.search = new SearchDataSet(this)
        }

        let record = this.search.get(fields, value)
        if (record) {
            this.setRecNo(Array.from(this.records).indexOf(record) + 1)
            return true;
        } else {
            return false;
        }
    }

    getJson(): string {
        let json: any = {}
        if (this.state !== 0) {
            json.state = this.state
        }
        if (this.message) {
            json.message = this.message
        }
        if (this.metaInfo) {
            json.meta = {};

            if (this.getHead().getFieldDefs().size() > 0) {
                let head: any = [];
                this.getHead().getFieldDefs().forEach((meta: FieldMeta) => {
                    let item: any = {};
                    if (meta.getRemark()) {
                        item[meta.getCode()] = [meta.getType(), meta.getName(), meta.getRemark()];
                    } else if (meta.getName()) {
                        item[meta.getCode()] = [meta.getType(), meta.getName()];
                    } else {
                        item[meta.getCode()] = [meta.getType()];
                    }
                    head.push(item);
                })
                json.meta.head = head;
            }

            if (this.records.length > 0) {
                let body: any = [];
                this.getFieldDefs().forEach((meta: FieldMeta) => {
                    let item: any = {};
                    if (meta.getRemark()) {
                        item[meta.getCode()] = [meta.getType(), meta.getName(), meta.getRemark()];
                    } else if (meta.getName()) {
                        item[meta.getCode()] = [meta.getType(), meta.getName()];
                    } else {
                        item[meta.getCode()] = [meta.getType()];
                    }
                    body.push(item);
                });
                json.meta.body = body;
            }
        }
        if (this.head.size() > 0) {
            if (this.metaInfo) {
                json.head = []
                this.head.getFieldDefs().forEach((field: FieldMeta) => {
                    json.head.push(this.head.getValue(field.getCode()))
                })
            } else {
                json.head = {};
                this.head.forEach((key: string, value: any) => {
                    json.head[key] = value;
                });
            }
        }
        if (this.size() > 0) {
            json.body = [];

            if (!this.metaInfo) {
                let item: any = [];
                for (let meta of this.getFieldDefs().getItems())
                    item.push(meta.getCode());
                json.body.push(item);
            }

            for (let row of this.records) {
                var item: any = []
                for (let meta of this.getFieldDefs().getItems()) {
                    item.push(row.getValue(meta.getCode()))
                }
                json.body.push(item)
            }
        }
        return JSON.stringify(json);
    }

    setJson(jsonObj: any): DataSet {
        this.clear();
        if (!jsonObj) {
            return this
        }
        if (!jsonObj) {
            throw new Error('json is null!')
        }
        if (typeof jsonObj === 'string') {
            jsonObj = JSON.parse(jsonObj)
        }
        if (jsonObj.hasOwnProperty('state')) {
            this.state = jsonObj.state
        }
        if (jsonObj.hasOwnProperty('message')) {
            this.message = jsonObj.message
        }

        let fields: string[] = [];
        if (jsonObj.hasOwnProperty('meta')) {
            this.setMetaInfo(true);
            this.meta = jsonObj.meta;
            if (this.meta.head) {
                this.head = new DataRow();
                let i = 0;
                this.meta.head.forEach((map: any) => {
                    for (let key in map) {
                        let values = map[key];
                        let meta = this.head.getFieldDefs().add(key);
                        if (values.length > 2)
                            meta.setRemark(values[2]);
                        if (values.length > 1)
                            meta.setName(values[1]);
                        if (values.length > 0)
                            meta.setType(values[0]);
                        this.head.setValue(key, jsonObj.head[i]);
                        i = i + 1;
                    }
                })
            }
            if (this.meta.body) {
                let i = 0;
                this.meta.body.forEach((map: any) => {
                    for (let key in map) {
                        let values = map[key];
                        let meta = this.getFieldDefs().add(key);
                        if (values.length > 2)
                            meta.setRemark(values[2]);
                        if (values.length > 1)
                            meta.setName(values[1]);
                        if (values.length > 0)
                            meta.setType(values[0]);
                        fields[i] = key;
                        i = i + 1;
                    }
                });
            }
        } else {
            this.setMetaInfo(false);
            if (jsonObj.hasOwnProperty('head'))
                this.head.setJson(jsonObj.head);
        }

        var data = jsonObj.dataset || jsonObj.body;
        if (data) {
            if (data && data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    if (!this.meta && i == 0) {
                        fields = data[0];
                        continue;
                    }
                    let item = data[i];
                    let row = this.append().getCurrent()
                    for (let j = 0; j < fields.length; j++)
                        row.setValue(fields[j], item[j]);
                }
            }
            this.first()
        }
        return this;
    }

    getState(): number {
        return this.state;
    }

    setState(state: number): DataSet {
        this.state = state;
        return this;
    }

    getMessage(): string {
        return this.message;
    }

    setMessage(message: string): DataSet {
        this.message = message;
        return this;
    }

    setMetaInfo(metaInfo: boolean): DataSet {
        this.metaInfo = metaInfo;
        return this;
    }

    getMetaInfo() {
        return this.metaInfo;
    }

    appendDataSet(source: DataSet) {
        source.getHead().getFieldDefs().forEach((meta: FieldMeta) => {
            this.getHead().setValue(meta.getCode(), source.getHead().getValue(meta.getCode()))
        })
        source.first();
        while (source.fetch()) {
            this.append();
            source.getFieldDefs().forEach((meta: FieldMeta) => {
                this.setValue(meta.getCode(), source.getValue(meta.getCode()))
            });
        }
    }

    forEach(fn: (row: DataRow) => void) {
        for (let row of this.records)
            fn.call(this, row);
    }

    bindClient(client: DataControl, register: boolean = true): void {
        if (register)
            this.bindControls.add(client);
        else
            this.bindControls.delete(client);
    }
    bindRefresh(): void {
        if (this.bindEnabled) {
            this.bindControls.forEach(child => {
                child.doChange();
            });
        }
    }
    enableControls(): void {
        if (this.bindEnabled)
            return;
        this.bindEnabled = true;
        this.bindRefresh();
    }
    disableControls(): void {
        this.bindEnabled = false;
    }
}

// let ds = new DataSet();
// ds.getHead().setValue('id', 100);
// ds.append();
// ds.setValue('code', 'a');
// ds.setValue('name', 'jason');
// ds.append();
// ds.setValue('code', 'b');
// ds.setValue('name', 'bade');
// ds.getFieldDefs().get("code").setName("代码");

// JUnit.assertEquals(1, ds.getJson(), '{"head":{"id":100},"body":[["code","name"],["a","jason"],["b","bade"]]}');
// JUnit.assertEquals(2, ds.setMetaInfo(true).getJson(), '{"meta":{"head":[{"id":[null]}],"body":[{"code":[null,"代码"]},{"name":[null]}]},"head":[100],"body":[["a","jason"],["b","bade"]]}')
// JUnit.assertEquals(3, ds.setMetaInfo(false).getJson(), '{"head":{"id":100},"body":[["code","name"],["a","jason"],["b","bade"]]}');
// JUnit.assertEquals(4, ds.setMetaInfo(false).getJson(), '{"head":{"id":100},"body":[["code","name"],["a","jason"],["b","bade"]]}');

// let json = '{"meta":{"head":[{"id":["n1","ID","DataID"]}],"body":[{"code":[null]},{"name":["s10","代码"]}]},"head":[100],"body":[["a","jason"],["b","bade"]]}';
// let ds2 = new DataSet().setJson(json);
// JUnit.assertEquals(11, ds2.getJson(), json);

// ds2.setMetaInfo(false);
// ds2.last();
// ds2.delete();
// JUnit.assertEquals(13, ds2.getJson(), '{"head":{"id":100},"body":[["code","name"],["a","jason"]]}');
// ds2.last();
// ds2.delete();
// JUnit.assertEquals(14, ds2.getJson(), '{"head":{"id":100}}');
