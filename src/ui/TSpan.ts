import TComponent from "./TComponent";
import TText from "./TText";

export default class TSpan extends TComponent {
    span: TText;

    constructor(owner: TComponent) {
        super(owner);
        this.setRootLabel('span');
    }

    setText(text: string) {
        if (!this.span) {
            this.span = new TText(this);
        }
        this.span.setText(text);
        return this;
    }

    getText(): string {
        return this.span == null ? null : this.span.getText();
    }
}
