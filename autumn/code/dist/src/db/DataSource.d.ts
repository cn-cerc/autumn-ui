import DataRow from "./DataRow";
export interface IDataSource {
    asDataSource(): DataSource;
}
export default class DataSource {
    private _items;
    private _index;
    constructor(items: DataRow[]);
    reset(): DataSource;
    hasNext(): boolean;
    get first(): DataRow;
    get last(): DataRow;
    get next(): DataRow;
    get items(): DataRow[];
    get length(): number;
}
