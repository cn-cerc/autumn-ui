import DataRow from "../db/DataRow";
import TComponent from "../ui/TComponent";
import TInput from "../ui/TInput";
import TSpan from "../ui/TSpan";
import TText from "../ui/TText";

export default class TEdit extends TComponent {
    private _label: TSpan;
    private input: TInput;

    constructor(owner: TComponent, props: any = null) {
        super(owner, props);
        this.setRootLabel('div');
        if (this.id == undefined)
            this.setId(this.getUid());

        this._label = new TSpan(this);
        if (props && props.label)
            this._label.setText(props.label);
        else
            this._label.setText('label:');
        this.input = new TInput(this);
    }

    get label(): string { return this._label.text }
    setLLabel(value: string): TEdit { this._label.setText(value); return this; }

    get defaultValue(): string { return this.readProperty('value') }
    setDefaultValue(value: string): TEdit { this.writeProperty('value', value); return this; }

    get value(): string {
        let el = this.getElement();
        return el ? el.value : null;
    }
    setValue(value: string): TEdit {
        let el = this.getElement()
        if (el) el.value = value;
        return this;
    }

    private getElement(): HTMLInputElement {
        if (!this.id) return null;
        let el = document.getElementById(this.id);
        if (!el) return null;
        return el.children[1] as HTMLInputElement;
    }

}