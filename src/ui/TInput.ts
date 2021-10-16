import TComponent from "./TComponent";

export default class TInput extends TComponent {

    constructor(owner: TComponent) {
        super(owner);
        this.setRootLabel('input');
    }

    setName(name: string) {
        this.writeProperty('name', name);
        return this;
    }

    getName() {
        return this.readProperty('name');
    }

    setValue(value: string) {
        this.writeProperty('value', value);
        return this;
    }

    getValue() {
        return this.readProperty('value');
    }

    getHtmlValue(): string {
        return document.getElementById(this.getId()).innerText;
    }
}