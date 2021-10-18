import TComponent from "./TComponent";

export default class TInput extends TComponent {

    constructor(owner: TComponent) {
        super(owner);
        this.rootLabel = 'input';
    }

    set name(name: string) { this.writeProperty('name', name) }
    get name() { return this.readProperty('name') }

    set defaultValue(value: string) { this.writeProperty('value', value) }
    get defaultValue() { return this.readProperty('value') }

    set value(value: string) { document.getElementById(this.id).innerText = value }
    get value(): string { return document.getElementById(this.id).innerText }

    private getElement(): HTMLInputElement {
        if (!this.id)
            throw new Error('this is is null');
        let el = document.getElementById(this.id);
        if (!el)
            throw new Error(`not find elementById: ${this.id}`);

        return el.children[1] as HTMLInputElement;
    }
}