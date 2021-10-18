import TComponent from "./TComponent";

export default class TForm extends TComponent {

    constructor(owner: TComponent) {
        super(owner);
        this.rootLabel = 'form';
    }

    set method(method: string) { this.writeProperty('method', method) }
    get method(): string { return this.readProperty('method') }

    set action(action: string) { this.writeProperty('action', action) }
    get action(): string { return this.readProperty('action') }

}