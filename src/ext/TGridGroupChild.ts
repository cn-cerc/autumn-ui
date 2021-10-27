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
    private _master: TGridGroupMaster;
    private _onOutput: (child: TGridGroupChild) => void;

    constructor(owner: TComponent) {
        super(owner);
        this.titleVisiable = false;
        this.visible = false;
    }

    output(html: HtmlWriter) {
        if (this._onOutput) {
            this._onOutput(this);
        }

        let it = 0;
        for (let child of this.owner.getComponents()) {
            if (child == this)
                break;
            it = it + 1;
        }

        let value: string = "";
        this.forEach((child: TGridColumn) => {
            if (child.visible) {
                let text = this.getCurrent().getText(child.getCode());
                if (text)
                    value = value + child.getName() + ": " + text + " ";
            }
        });

        if (value.length > 0) {
            let tr = new TTr();
            tr.id = 'tr' + this.getCurrent().dataSet.recNo + "_" + it;
            if (!this.visible)
                tr.setCssStyle('display:none');
            let td = new TTd(tr);
            if (this._master)
                td.writeProperty("colspan", "" + this._master.getColumnCount());
            new TText(td, { text: value });
            tr.output(html);
        }
    }

    set master(value: TGridGroupMaster) { this._master = value }
    get master() { return this._master }

    set onOutput(value: (child: TGridGroupChild) => void) { this._onOutput = value }
    get onOutput(): (child: TGridGroupChild) => void { return this._onOutput }

}
