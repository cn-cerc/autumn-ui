import TComponent from "./TComponent";
import TText from "./TText";

export default class TA extends TComponent {
    private text: TText;

    constructor(owner: TComponent) {
        super(owner);
        this.setRootLabel('a');
        this.text = new TText(this);
    }

    getHref(): string {
        return this.readProperty('href');
    }
    setHref(value: string): TA {
        this.writeProperty('href', value);
        return this;
    }

    getText(): string {
        return this.text.getText();
    }
    setText(value: string): TA {
        this.text.setText(value);
        return this;
    }

}