import DataRow from '../db/DataRow';
import HtmlWriter from '../ui/HtmlWriter';
import TComponent from '../ui/TComponent';
import TTd from '../ui/TTd';
import TText from '../ui/TText';
import TTh from '../ui/TTh';
import TTr from '../ui/TTr';
import TGridColumn from './TGridColumn';

const MaxWidth = 600;

export default class TGridGroup extends TComponent {
    private _titleVisiable: boolean = true;
    private _current: DataRow;

    constructor(owner: TComponent) {
        super(owner);
    }

    setCurrent(row: DataRow) {
        this._current = row;
    }

    getCurrent(): DataRow {
        return this._current;
    }

    getTotalWidth() {
        let result = 0;
        this.getComponents().forEach((item) => {
            if (item instanceof TGridColumn)
                result = result + item.getWidth();
        });
        if (result < 0) {
            throw new Error("总列宽不允许小于1");
        }
        if (result > MaxWidth) {
            throw new Error(`总列宽不允许大于 ${MaxWidth}`);
        }
        return result;
    }

    get titleVisiable() { return this._titleVisiable }

    set titleVisiable(value: boolean) { this._titleVisiable = value }

    getColumn(columnCode: string): TGridColumn {
        for (let item of this.getComponents()) {
            let column = item as TGridColumn;
            if (column.getCode() == columnCode)
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
                if (child.getColspan())
                    th.writeProperty("colspan", child.getColspan());
                if (this.getTotalWidth() > 0 && child.getWidth() > 0) {
                    let rate = child.getWidth() / this.getTotalWidth() * 100;
                    th.writeProperty("width", rate.toFixed(1) + "%");
                }
                new TText(th, { text: child.getName() });
            }
        }
        tr.output(html);
    }

}
