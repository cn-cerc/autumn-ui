import { TSpan } from "../SummerCI";
import TComponent from "../ui/TComponent";
import TInput from "../ui/TInput";
import TText from "../ui/TText";

export default class TEditText extends TComponent {
    private label: TSpan;
    private input: TInput;
    private value: string;

    constructor(owner: TComponent) {
        super(owner);
        this.setRootLabel('div');

        this.label = new TSpan(this);
        this.label.setText('label:');
        this.input = new TInput(this);
    }

    getLabel(): string {
        return this.label.getText();
    }
    setLabel(label: string): TEditText {
        this.label.setText(label);
        return this;
    }

    getDefaultValue(): string {
        return this.input.getValue();
    }
    setDefaultValue(value: string): TEditText {
        this.input.setValue(value);
        return this;
    }

    getValue() {
        if (!this.getId())
            throw new Error('this is is null');
        let el = document.getElementById(this.getId());
        if (!el)
            throw new Error(`not find elementById: ${this.getId()}`);

        let child = el.children[1] as HTMLInputElement;
        return child.value;
    }

}