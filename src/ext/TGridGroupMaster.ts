import HtmlWriter from '../ui/HtmlWriter';
import TComponent from '../ui/TComponent';
import TTd from '../ui/TTd';
import TText from '../ui/TText';
import TTh from '../ui/TTh';
import TTr from '../ui/TTr';
import TGridColumn from './TGridColumn';
import TGridGroup from './TGridGroup';

export default class TGridGroupMaster extends TGridGroup {

    constructor(owner: TComponent) {
        super(owner);
    }

    output(html: HtmlWriter): void{
        console.log('master');
        let notNull = false;
        let tr = new TTr();
        this.forEach((child: TGridColumn) => {
            if (!child.getVisible())
                return;
            let value = this.getCurrent().getText(child.getCode());
            let td = new TTd(tr);
            if (child.getColspan())
                td.writerProperty("colspan", child.getColspan());

            if (child.getAlign()) {
                td.writerProperty("align", child.getAlign());
            }
            new TText(td).setText(value);
            if (value)
                notNull = true;
        });
        if (notNull)
            tr.output(html);
    }

    getColumnCount(): number {
        let count = 0;
        for(let item  of this.getComponents()){
            if(item instanceof TGridColumn){
                let child = item as TGridColumn;
                count = count + 1;
            }
        }
        return count;
    }

}
