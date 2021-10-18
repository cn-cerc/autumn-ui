import DataRow from "./DataRow"
import DataSet from "./DataSet"

/**
 * 
 */
export default class SearchDataSet {
	private _dataSet: DataSet;
	private _items: Map<string, DataRow> = new Map()
	private _keys: Set<string> = new Set()
	private _fields: string;

	constructor(dataSet: DataSet) {
		this._dataSet = dataSet
	}

	get(currentFields: string, value: any): DataRow {
		if (!currentFields)
			throw new Error('fields can\'t be null')

		if (this._dataSet.size == 0)
			return null;

		let values: object[];
		if (typeof value !== 'object')
			values = [value]
		else
			values = value as object[];

		if (values.length === 0)
			throw new Error('keys can\'t values length = 0 ')

		if (this._fields !== currentFields) {
			this.clear()
			this._fields = currentFields
			for (let key of this._fields.split(';')) {
				if (!this._dataSet.exists(key))
					throw new Error(`field ${key} not find !`);
				this._keys.add(key)
			}

			// 重置索引
			if (this._keys.size > 0) {
				this._dataSet.first()
				while (this._dataSet.fetch()) {
					this.append(this._dataSet.getCurrent())
				}
			}
		}
		if (this._keys.size !== values.length) throw new Error('[参数名称]与[值]个数不匹配')

		return this._items.get(this.buildObjectKey(values))
	}

	remove(record: DataRow): void {
		this._items.delete(this.buildRecordKey(record));
	}

	append(record: DataRow): void {
		this._items.set(this.buildRecordKey(record), record)
	}

	clear(): void {
		this._fields = null;
		this._keys.clear()
		this._items.clear()
	}

	buildRecordKey(record: DataRow) {
		let result: string[] = [];
		this._keys.forEach((key: string) => result.push(record.getString(key) || 'null'));
		return result.join(';');
	}

	buildObjectKey(values: object[]) {
		let result: string[] = [];
		values.forEach((value) => result.push("" + value || 'null'))
		return result.join(';')
	}
}
