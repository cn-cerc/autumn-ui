import HtmlWriter from "./HtmlWriter";
import TComponent from "./TComponent";

export default class TText extends TComponent {
    private _text: string;

    constructor(owner: TComponent, props: any = null) {
        super(owner, props);
        if (props) {
            const { text } = props;
            if (text)
                this.text = text;
        }
    }

    set text(text: string) { this._text = text }
    get text() { return this._text }

    output(html: HtmlWriter) {
        if (this._text)
            html.print(this._text);
    }
}