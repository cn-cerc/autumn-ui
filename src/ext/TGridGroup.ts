import DataRow from '../db/DataRow';
import HtmlWriter from '../ui/HtmlWriter';
import TComponent from '../ui/TComponent';
import TTd from '../ui/TTd';
import TText from '../ui/TText';
import TTh from '../ui/TTh';
import TTr from '../ui/TTr';
import TGridColumn from './TGridColumn';

export default class TGridGroup extends TComponent {
    MaxWidth = 600;
    private titleVisiable: boolean = true;
    private current: DataRow;

    constructor(owner: TComponent) {
        super(owner);
    }

    setCurrent(row: DataRow) {
        this.current = row;
    }

    getCurrent(): DataRow {
        return this.current;
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
        if (result > this.MaxWidth) {
            throw new Error(`总列宽不允许大于 ${this.MaxWidth}`);
        }
        return result;
    }

    getTitleVisiable() {
        return this.titleVisiable
    }

    setTitleVisiable(value: boolean): TGridGroup {
        this.titleVisiable = value;
        return this;
    }

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
        if (!this.getTitleVisiable())
            return;
        let tr = new TTr();
        for (let item of this.getComponents()) {
            if (item instanceof TGridColumn) {
                let child = item as TGridColumn;
                if (!child.getVisible())
                    continue;
                let th = new TTh(tr);
                if (child.getColspan())
                    th.writeProperty("colspan", child.getColspan());
                if (this.getTotalWidth() > 0 && child.getWidth() > 0) {
                    let rate = child.getWidth() / this.getTotalWidth() * 100;
                    th.writeProperty("width", rate.toFixed(1) + "%");
                }
                new TText(th).setText(child.getName());
            }
        }
        tr.output(html);
    }

}
