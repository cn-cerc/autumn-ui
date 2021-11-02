import DataRow from '../db/DataRow';
import KeyValue from '../db/KeyValue';
import HtmlWriter from '../ui/HtmlWriter';
import TComponent from '../ui/TComponent';
import TTd from '../ui/TTd';
import TText from '../ui/TText';
import TTh from '../ui/TTh';
import TTr from '../ui/TTr';
import TGridColumn from './TGridColumn';

const MaxWidth = 600;

interface IOnOutput {
    (child: TGridGroup, display: KeyValue): void
}

export default class TGridGroup extends TComponent {
    private _titleVisiable: boolean = true;
    private _current: DataRow;
    private _master: TGridGroup;
    private _onOutput: (child: TGridGroup, display: KeyValue) => void;

    constructor(owner: TComponent) {
        super(owner);
    }

    get current(): DataRow { return this._current }
    setCurrent(row: DataRow) {
        this._current = row;
    }

    get titleVisiable() { return this._titleVisiable }
    setTitleVisiable(value: boolean): TGridGroup { this._titleVisiable = value; return this; }

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

    getColumnCount(): number {
        return this.columns.length;
    }

    getColumn(columnCode: string): TGridColumn {
        for (let item of this.getComponents()) {
            let column = item as TGridColumn;
            if (column.code == columnCode)
                return column;
        }
        return null;
    }

    forEach(fn: (column: TGridColumn) => void) {
        for (let item of this.getComponents()) {
            if (item instanceof TGridColumn)
                fn.call(this, item as TGridColumn);
        }
    }

    get master() { return this._master }
    setMaster(value: TGridGroup): TGridGroup { this._master = value; return this; }

    get onOutput(): IOnOutput { return this._onOutput }
    setOnOutput(value: IOnOutput): TGridGroup { this._onOutput = value; return this; }

    outputOfGridTitle(html: HtmlWriter) {
        if (!this.titleVisiable)
            return;
        let tr = new TTr();
        for (let item of this.getComponents()) {
            if (item instanceof TGridColumn) {
                let child = item as TGridColumn;
                if (!child.visible)
                    continue;
                let th = new TTh(tr);
                if (child.colSpan)
                    th.writeProperty("colspan", child.colSpan);
                if (this.getTotalWidth() > 0 && child.width > 0) {
                    let rate = child.width / this.getTotalWidth() * 100;
                    th.writeProperty("width", rate.toFixed(1) + "%");
                }
                new TText(th, { text: child.name });
            }
        }
        tr.output(html);
    }

}
