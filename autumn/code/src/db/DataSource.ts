import DataRow from "./DataRow";

export interface IDataSource {
    asDataSource(): DataSource;
}

export default class DataSource {
    private _items: DataRow[];
    private _index: number = 0;

    constructor(items: DataRow[]) {
        this._items = items;
    }

    reset(): DataSource { this._index = 0; return this }

    hasNext(): boolean {
        if (this._items.length > this._index) {
            this._index++;
            return true;
        } else
            return false;
    }

    get first(): DataRow {
        if (this.items.length == 0)
            return null;
        return this._items[0];
    }

    get last(): DataRow {
        if (this.items.length == 0)
            return null;
        return this._items[this._items.length - 1];
    }

    get next(): DataRow {
        if (this._index == 0)
            throw Error('this.index == 0, please call hasNext')
        return this._items[this._index - 1]
    }

    get items(): DataRow[] { return this._items }

    get length(): number { return this._items.length }
}
