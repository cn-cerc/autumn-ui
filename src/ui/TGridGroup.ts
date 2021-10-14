import TComponent from './TComponent';
import TGridColumn from './TGridColumn';

export default class TGridGroup extends TComponent {
    MaxWidth = 600;

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

}

// let groups = new TGridGroup();

// new TGridColumn(groups).setWidth(10);
// new TGridColumn(groups).setWidth(15);

// JUnit.assertEquals(1, "25", groups.getTotalWidth());