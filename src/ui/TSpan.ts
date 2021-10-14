import TComponent from "./TComponent";
import TText from "./TText";

export default class TSpan extends TComponent {
    span;

    constructor(owner) {
        super(owner);
        this.setRootLabel('span');
    }

    setText(text) {
        if (!this.span) {
            this.span = new TText(this);
        }
        this.span.setText(text);
        return this;
    }

    getText() {
        return this.span == null ? null : this.span.getText();
    }
}
