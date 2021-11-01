import TComponent from "../ui/TComponent";
import TDiv from "../ui/TDiv";
import TSpan from "../ui/TSpan";

export default class TStatusBar extends TDiv {
    private _text: TSpan;

    constructor(owner: TComponent, props: any = null) {
        super(owner, props);
        this._text = new TSpan(this);
        this.setCssStyle('background-color:rgb(240,240,240);');
    }

    get text(): string { return this._text.text }
    setText(value: string): TStatusBar { this._text.setText(value); return this; }

}