import KeyValue from '../db/KeyValue';
import HtmlWriter from '../ui/HtmlWriter';
import TComponent from '../ui/TComponent';
import TTd from '../ui/TTd';
import TText from '../ui/TText';
import TTr from '../ui/TTr';
import TGridColumn from './TGridColumn';
import TGridGroup from './TGridGroup';
import TGridGroupMaster from './TGridGroupMaster';

interface IOnOutput {
    (child: TGridGroupChild, display: KeyValue): void
}

export default class TGridGroupChild extends TGridGroup {
    private _master: TGridGroupMaster;
    private _onOutput: (child: TGridGroupChild, display: KeyValue) => void;

    constructor(owner: TComponent) {
        super(owner);
        this.setTitleVisiable(false);
        this.setVisible(false);
    }

    output(html: HtmlWriter) {
        let display = new KeyValue(this.visible);
        if (this._onOutput) {
            this._onOutput(this, display);
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
                let text = this.current.getText(child.code);
                if (text)
                    value = value + child.name + ": " + text + " ";
            }
        });

        if (value.length > 0) {
            let tr = new TTr();
            tr.setId('tr' + this.current.dataSet.recNo + "_" + it);
            if (!display.asBoolean())
                tr.setCssStyle('display:none');
            let td = new TTd(tr);
            if (this._master)
                td.writeProperty("colspan", "" + this._master.getColumnCount());
            new TText(td, { text: value });
            tr.output(html);
        }
    }

    get master() { return this._master }
    setMaster(value: TGridGroupMaster): TGridGroupChild { this._master = value; return this; }

    get onOutput(): IOnOutput { return this._onOutput }
    setOnOutput(value: IOnOutput): TGridGroupChild { this._onOutput = value; return this; }

}
