import TComponent from "./TComponent";

export default class TForm extends TComponent {

    constructor(owner: TComponent) {
        super(owner);
        this.setRootLabel('form');
    }

    get method(): string { return this.readProperty('method') }
    setMethod(method: string): TForm { this.writeProperty('method', method); return this; }

    get action(): string { return this.readProperty('action') }
    setAction(action: string): TForm { this.writeProperty('action', action); return this; }

}