import TComponent from '../ui/TComponent';
import TGridColumn from './TGridColumn';

export default class TGridGroup extends TComponent {
    MaxWidth = 600;
    _titleVisiable: boolean = true;

    constructor(owner: TComponent) {
        super(owner);
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
        return this._titleVisiable
    }

    setTitleVisiable(value: boolean): TGridGroup {
        this._titleVisiable = value;
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

}

// let groups = new TGridGroup();

// new TGridColumn(groups).setWidth(10);
// new TGridColumn(groups).setWidth(15);

// JUnit.assertEquals(1, "25", groups.getTotalWidth());