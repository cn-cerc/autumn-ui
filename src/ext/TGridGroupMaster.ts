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
        tr.setId('tr' + this.current.dataSet.recNo);
        this.forEach((child: TGridColumn) => {
            if (!child.visible)
                return;
            let value = this.current.getText(child.code);
            let td = new TTd(tr);
            if (child.colSpan)
                td.writeProperty("colspan", child.colSpan);

            if (child.align) {
                td.writeProperty("align", child.align);
            }
            new TText(td, { text: value });
            if (value)
                notNull = true;
        });
        if (notNull)
            tr.output(html);
    }

}
