import { TComponent, TDiv, TSpan } from "../SummerCI"

export default class TStatusBar extends TDiv {
    private text: TSpan;

    constructor(owner: TComponent) {
        super(owner);
        this.text = new TSpan(this);
        this.setCssStyle('background-color:rgb(240,240,240);');
    }

    getText(): string{
        return this.text.getText();
    }
    setText(value: string): TStatusBar {
        this.text.setText(value);
        return this;
    }

}