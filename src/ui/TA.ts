import TComponent from "./TComponent";
import TText from "./TText";

export default class TA extends TComponent {
    private _text: TText;

    constructor(owner: TComponent) {
        super(owner);
        this.rootLabel = 'a';
        this._text = new TText(this);
    }

    set href(value: string) { this.writeProperty('href', value) }
    get href(): string { return this.readProperty('href') }

    set text(value: string) { this._text.text = value }
    get text(): string { return this._text.text }

}