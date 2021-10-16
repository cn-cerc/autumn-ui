import DataRow from "./DataRow"
import DataSet from "./DataSet"

/**
 * 
 */
export default class SearchDataSet {
	dataSet: DataSet;
	items: Map<string, DataRow> = new Map()
	keys: Set<string> = new Set()
	fields: string;

	constructor(dataSet: DataSet) {
		this.dataSet = dataSet
	}

	get(currentFields: string, value: any): DataRow {
		if (!currentFields) {
			throw new Error('fields can\'t be null')
		}

		let values: object[];
		if (typeof value !== 'object')
			values = [value]
		else
			values = value as object[];

		if (values.length === 0)
			throw new Error('keys can\'t values length = 0 ')

		if (this.fields !== currentFields) {
			this.clear()
			this.fields = currentFields
			for (let key of this.fields.split(';')) {
				if (!this.dataSet.exists(key))
					throw new Error(`field ${key} not find !`);
				this.keys.add(key)
			}

			// 重置索引
			if (this.keys.size > 0) {
				this.dataSet.first()
				while (this.dataSet.fetch()) {
					this.append(this.dataSet.getCurrent())
				}
			}
		}
		if (this.keys.size !== values.length) throw new Error('[参数名称]与[值]个数不匹配')

		return this.items.get(this.buildObjectKey(values))
	}

	remove(record: DataRow): void {
		this.items.delete(this.buildRecordKey(record));
	}

	append(record: DataRow): void {
		this.items.set(this.buildRecordKey(record), record)
	}

	clear(): void {
		this.fields = null;
		this.keys.clear()
		this.items.clear()
	}

	buildRecordKey(record: DataRow) {
		let result: string[] = [];
		this.keys.forEach((key: string) => result.push(record.getString(key) || 'null'));
		return result.join(';');
	}

	buildObjectKey(values: object[]) {
		let result: string[] = [];
		values.forEach((value) => result.push("" + value || 'null'))
		return result.join(';')
	}
}
