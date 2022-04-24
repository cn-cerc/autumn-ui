import DataSet from "./DataSet";
import DataSource, { IDataSource } from "./DataSource";
import FieldDefs from "./FieldDefs";
export declare enum DataRowState {
    None = 0,
    Insert = 1,
    Update = 2,
    Delete = 3,
    History = 4
}
export default class DataRow implements IDataSource {
    private _dataSet;
    private _fields;
    private _state;
    private _items;
    private _delta;
    private _history;
    constructor(dataSet?: DataSet);
    asDataSource(): DataSource;
    get state(): number;
    setState(value: DataRowState): DataRow;
    close(): void;
    setValue(field: string, value: any): DataRow;
    copyValues(source: DataRow, defs?: FieldDefs): void;
    private addFieldDef;
    getValue(field: string): any;
    getNumber(field: string): number;
    getInt(field: string): number;
    getDouble(field: string): number;
    getString(field: string): string;
    getBoolean(field: string): boolean;
    getText(field: string): string;
    setText(field: string, value: string): DataRow;
    get size(): number;
    get delta(): Map<string, any>;
    get json(): string;
    setJson(jsonObj: string): DataRow;
    get jsonObject(): object;
    setJsonObject(jsonObject: any): DataRow;
    get fields(): FieldDefs;
    get items(): Map<string, object>;
    forEach(fn: (key: string, value: any) => void): void;
    get dataSet(): DataSet;
    get current(): DataRow;
    clone(): DataRow;
    get history(): DataRow;
    setHistory(history: DataRow): this;
    has(field: string): boolean;
}
