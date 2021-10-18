import HtmlWriter from "./HtmlWriter";
import TComponent from "./TComponent";

export default class TButton extends TComponent {
    private _text: string;

    constructor(owner: TComponent, props: any = null) {
        super(owner, props);
        this.rootLabel = 'button';
        if (props) {
            const { text } = props;
            if (text)
                this.text = text;
        }
    }

    set text(text: string) { this._text = text }
    get text(): string { return this._text }

    output(html: HtmlWriter) {
        this.beginOutput(html);
        if (this._text) {
            html.print(this._text);
        }
        this.endOutput(html);
    }
}