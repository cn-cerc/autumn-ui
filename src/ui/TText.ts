import HtmlWriter from "./HtmlWriter";
import TComponent from "./TComponent";

export default class TText extends TComponent {
    text: string;

    constructor(owner: TComponent) {
        super(owner);
    }

    setText(text: string) {
        this.text = text;
    }

    getText() {
        return this.text;
    }

    output(html: HtmlWriter){
        html.print(this.text);
    }
}