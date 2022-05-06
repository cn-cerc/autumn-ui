/**
 *
 */
var SearchDataSet = /** @class */ (function () {
    function SearchDataSet(dataSet) {
        this._items = new Map();
        this._keys = new Set();
        this._dataSet = dataSet;
    }
    SearchDataSet.prototype.get = function (currentFields, value) {
        if (!currentFields)
            throw new Error('fields can\'t be null');
        if (this._dataSet.size == 0)
            return null;
        var values;
        if (typeof value !== 'object')
            values = [value];
        else
            values = value;
        if (values.length === 0)
            throw new Error('keys can\'t values length = 0 ');
        if (this._fields !== currentFields) {
            this.clear();
            this._fields = currentFields;
            for (var _i = 0, _a = this._fields.split(';'); _i < _a.length; _i++) {
                var key = _a[_i];
                if (!this._dataSet.exists(key))
                    throw new Error("field ".concat(key, " not find !"));
                this._keys.add(key);
            }
            // 重置索引
            if (this._keys.size > 0) {
                this._dataSet.first();
                while (this._dataSet.fetch()) {
                    this.append(this._dataSet.current);
                }
            }
        }
        if (this._keys.size !== values.length)
            throw new Error('[参数名称]与[值]个数不匹配');
        return this._items.get(this.buildObjectKey(values));
    };
    SearchDataSet.prototype.remove = function (record) {
        this._items.delete(this.buildRecordKey(record));
    };
    SearchDataSet.prototype.append = function (record) {
        this._items.set(this.buildRecordKey(record), record);
    };
    SearchDataSet.prototype.clear = function () {
        this._fields = null;
        this._keys.clear();
        this._items.clear();
    };
    SearchDataSet.prototype.buildRecordKey = function (record) {
        var result = [];
        this._keys.forEach(function (key) { return result.push(record.getString(key) || 'null'); });
        return result.join(';');
    };
    SearchDataSet.prototype.buildObjectKey = function (values) {
        var result = [];
        values.forEach(function (value) { return result.push("" + value || 'null'); });
        return result.join(';');
    };
    return SearchDataSet;
}());
export default SearchDataSet;
