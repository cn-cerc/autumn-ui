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
        this.rootLabel = 'div';
        if (this.id == undefined)
            this.id = this.getUid();

        this._label = new TSpan(this);
        if (props && props.label)
            this._label.text = props.label;
        else
            this._label.text = 'label:';
        this.input = new TInput(this);
    }

    set label(value: string) { this._label.text = value }
    get label(): string { return this._label.text }

    set defaultValue(value: string) { this.writeProperty('value', value) }
    get defaultValue(): string { return this.readProperty('value') }

    set value(value: string) {
        let el = this.getElement()
        if (el) el.value = value
    }
    get value(): string {
        let el = this.getElement();
        return el ? el.value : null;
    }

    private getElement(): HTMLInputElement {
        if (!this.id) return null;
        let el = document.getElementById(this.id);
        if (!el) return null;
        return el.children[1] as HTMLInputElement;
    }

}