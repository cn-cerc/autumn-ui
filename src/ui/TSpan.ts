import TComponent from "./TComponent";
import TText from "./TText";

export default class TSpan extends TComponent {
    private _span: TText;

    constructor(owner: TComponent, props: any = null) {
        super(owner, props);
        this.rootLabel = 'span';
    }

    set text(text: string) {
        if (!this._span)
            this._span = new TText(this);
        this._span.text = text;
    }
    get text(): string { return this._span == null ? null : this._span.text; }
}
