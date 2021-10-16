import DataRow from "../db/DataRow";
import TComponent from "../ui/TComponent";
import TInput from "../ui/TInput";
import TSpan from "../ui/TSpan";
import TText from "../ui/TText";

export default class TEdit extends TComponent {
    private label: TSpan;
    private input: TInput;
    private value: string;
    private _record: DataRow;

    constructor(owner: TComponent, props: any = null) {
        super(owner, props);
        this.setRootLabel('div');
        if (this.getId() == undefined)
            this.setId(this.getUid());

        this.label = new TSpan(this);
        if (props && props.label)
            this.label.setText(props.label);
        else
            this.label.setText('label:');
        this.input = new TInput(this);
    }

    getLabel(): string {
        return this.label.getText();
    }
    setLabel(label: string): TEdit {
        this.label.setText(label);
        return this;
    }

    getDefaultValue(): string {
        return this.input.getValue();
    }
    setDefaultValue(value: string): TEdit {
        this.input.setValue(value);
        return this;
    }

    getRecord(): DataRow {
        return this._record;
    }
    setRecord(value: DataRow): TEdit {
        this._record = value;
        return this;
    }

    setValue(value: string): TEdit {
        this.getElement().value = value;
        return this;
    }

    getValue(): string {
        return this.getElement().value;
    }

    private getElement(): HTMLInputElement {
        if (!this.getId())
            throw new Error('this is is null');
        let el = document.getElementById(this.getId());
        if (!el)
            throw new Error(`not find elementById: ${this.getId()}`);

        return el.children[1] as HTMLInputElement;
    }

}