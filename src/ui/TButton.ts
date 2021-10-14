import HtmlWriter from "./HtmlWriter";
import TComponent from "./TComponent";

export default class TButton extends TComponent {
    text: string;

    constructor(owner: TComponent) {
        super(owner);
        this.setRootLabel('button');
    }

    setText(text: string) {
        this.text = text;
        return this;
    }

    getText(): string {
        return this.text;
    }

    output(html: HtmlWriter) {
        this.beginOutput(html);
        if (this.text) {
            html.print(this.text);
        }
        this.endOutput(html);
    }
}