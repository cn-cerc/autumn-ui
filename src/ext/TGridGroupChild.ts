import HtmlWriter from '../ui/HtmlWriter';
import TComponent from '../ui/TComponent';
import TTd from '../ui/TTd';
import TText from '../ui/TText';
import TTh from '../ui/TTh';
import TTr from '../ui/TTr';
import TGridColumn from './TGridColumn';
import TGridGroup from './TGridGroup';
import TGridGroupMaster from './TGridGroupMaster';

export default class TGridGroupChild extends TGridGroup {
    private master: TGridGroupMaster;

    constructor(owner: TComponent) {
        super(owner);
        this.setTitleVisiable(false);
    }

    output(html: HtmlWriter) {
        let it = 0;
        for(let child of this.getOwner().getComponents()){
            if(child == this)
                break;
            it = it + 1;
        }

        let text: string = "";
        this.forEach((child: TGridColumn) => {
            if (child.getVisible()) {
                let value = this.getCurrent().getText(child.getCode());
                if (value)
                    text = text + child.getName() + ": " + value + " ";
            }
        });

        if (text.length > 0) {
            let tr = new TTr();
            tr.setId('tr' + this.getCurrent().getDataSet().getRecNo() + "_" + it);
            tr.setCssStyle('display:none');
            let td = new TTd(tr);
            if (this.master)
                td.writerProperty("colspan", "" + this.master.getColumnCount());
            new TText(td).setText(text);
            tr.output(html);
        }
    }

    getMaster() {
        return this.master;
    }

    setMaster(value: TGridGroupMaster): TGridGroupChild {
        this.master = value;
        return this;
    }

}
