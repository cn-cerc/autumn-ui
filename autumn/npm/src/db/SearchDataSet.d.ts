import DataRow from "./DataRow";
import DataSet from "./DataSet";
/**
 *
 */
export default class SearchDataSet {
    private _dataSet;
    private _items;
    private _keys;
    private _fields;
    constructor(dataSet: DataSet);
    get(currentFields: string, value: any): DataRow;
    remove(record: DataRow): void;
    append(record: DataRow): void;
    clear(): void;
    buildRecordKey(record: DataRow): string;
    buildObjectKey(values: object[]): string;
}
