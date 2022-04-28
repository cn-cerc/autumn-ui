var DataSource = /** @class */ (function () {
    function DataSource(items) {
        this._index = 0;
        this._items = items;
    }
    DataSource.prototype.reset = function () { this._index = 0; return this; };
    DataSource.prototype.hasNext = function () {
        if (this._items.length > this._index) {
            this._index++;
            return true;
        }
        else
            return false;
    };
    Object.defineProperty(DataSource.prototype, "first", {
        get: function () {
            if (this.items.length == 0)
                return null;
            return this._items[0];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DataSource.prototype, "last", {
        get: function () {
            if (this.items.length == 0)
                return null;
            return this._items[this._items.length - 1];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DataSource.prototype, "next", {
        get: function () {
            if (this._index == 0)
                throw Error('this.index == 0, please call hasNext');
            return this._items[this._index - 1];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DataSource.prototype, "items", {
        get: function () { return this._items; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DataSource.prototype, "length", {
        get: function () { return this._items.length; },
        enumerable: false,
        configurable: true
    });
    return DataSource;
}());
export default DataSource;
