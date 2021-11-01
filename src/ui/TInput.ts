import TComponent from "./TComponent";

export default class TInput extends TComponent {

    constructor(owner: TComponent) {
        super(owner);
        this.setRootLabel('input');
    }

    get name() { return this.readProperty('name') }
    setName(name: string): TInput { this.writeProperty('name', name); return this; }

    get defaultValue() { return this.readProperty('value') }
    setDefaultValue(value: string): TInput { this.writeProperty('value', value); return this; }

    get value(): string { return document.getElementById(this.id).innerText }
    setValue(value: string): TInput { document.getElementById(this.id).innerText = value; return this; }

    private getElement(): HTMLInputElement {
        if (!this.id)
            throw new Error('this is is null');
        let el = document.getElementById(this.id);
        if (!el)
            throw new Error(`not find elementById: ${this.id}`);

        return el.children[1] as HTMLInputElement;
    }
}