import HtmlWriter from '../ui/HtmlWriter';
import TComponent from '../ui/TComponent';
import TTd from '../ui/TTd';
import TText from '../ui/TText';
import TTr from '../ui/TTr';
import TGridColumn from './TGridColumn';
import TGridGroup from './TGridGroup';

export default class TGridGroupMaster extends TGridGroup {

    constructor(owner: TComponent) {
        super(owner);
    }

    output(html: HtmlWriter): void {
        let notNull = false;
        let tr = new TTr();
        tr.id = 'tr' + this.getCurrent().dataSet.recNo;
        this.forEach((child: TGridColumn) => {
            if (!child.visible)
                return;
            let value = this.getCurrent().getText(child.getCode());
            let td = new TTd(tr);
            if (child.getColspan())
                td.writeProperty("colspan", child.getColspan());

            if (child.getAlign()) {
                td.writeProperty("align", child.getAlign());
            }
            new TText(td, { text: value });
            if (value)
                notNull = true;
        });
        if (notNull)
            tr.output(html);
    }

    getColumnCount(): number {
        let count = 0;
        for (let item of this.getComponents()) {
            if (item instanceof TGridColumn) {
                let child = item as TGridColumn;
                count = count + 1;
            }
        }
        return count;
    }

}
