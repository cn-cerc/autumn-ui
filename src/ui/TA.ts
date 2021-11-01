import TComponent from "./TComponent";
import TText from "./TText";

export default class TA extends TComponent {
    private _text: TText;

    constructor(owner: TComponent) {
        super(owner);
        this.setRootLabel('a');
        this._text = new TText(this);
    }

    get href(): string { return this.readProperty('href') }
    setHref(value: string): TA { this.writeProperty('href', value); return this; }

    get text(): string { return this._text.text }
    setText(value: string): TA { this._text.setText(value); return this; }

}