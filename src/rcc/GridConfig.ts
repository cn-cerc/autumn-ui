import DataRow from '../db/DataRow';
import DataSet from '../db/DataSet';
import KeyValue from '../db/KeyValue';
import TGridColumn from '../ext/TGridColumn';
import TComponent from '../ui/TComponent';

const MaxWidth = 600;

interface IOnOutput {
    (child: GridConfig, display: KeyValue): void
}

export default class GridConfig extends TComponent {
    private _dataSet: DataSet
    private _titleVisiable: boolean = true;
    private _current: DataRow;
    private _children: GridConfig[] = [];
    private _onOutput: (child: GridConfig, display: KeyValue) => void;

    constructor(owner: GridConfig = null) {
        super(owner);
    }

    get current(): DataRow { return this._current }
    setCurrent(row: DataRow) {
        this._current = row;
    }

    get titleVisiable() { return this._titleVisiable }
    setTitleVisiable(value: boolean): GridConfig { this._titleVisiable = value; return this; }

    getTotalWidth() {
        let result = 0;
        this.getComponents().forEach((item) => {
            if (item instanceof TGridColumn)
                result = result + item.width;
        });
        if (result < 0) {
            throw new Error("总列宽不允许小于1");
        }
        if (result > MaxWidth) {
            throw new Error(`总列宽不允许大于 ${MaxWidth}`);
        }
        return result;
    }

    get columns(): TGridColumn[] {
        let items: TGridColumn[] = [];
        for (let item of this.getComponents()) {
            if (item instanceof TGridColumn)
                items.push(item as TGridColumn);
        }
        return items;
    }

    getColumn(columnCode: string): TGridColumn {
        for (let item of this.getComponents()) {
            let column = item as TGridColumn;
            if (column.code == columnCode)
                return column;
        }
        return null;
    }

    get master(): GridConfig {
        if (this.owner instanceof GridConfig)
            return this.owner as GridConfig;
        else
            return null;
    }

    newChild(): GridConfig {
        let child = new GridConfig(this);
        this._children.push(child);
        return child;
    }
    get children(): GridConfig[] { return this._children }

    get onOutput(): IOnOutput { return this._onOutput }
    setOnOutput(value: IOnOutput): GridConfig { this._onOutput = value; return this; }

    get dataSet(): DataSet { return this._dataSet };
    setDataSet(value: DataSet): GridConfig { this._dataSet = value; return this; };
}
