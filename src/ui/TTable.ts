import TComponent from "./TComponent";

export default class TTable extends TComponent {

    constructor(owner: TComponent, props: object = null) {
        super(owner, props);
        this.setRootLabel('table');
    }

    get border(): string { return this.readProperty('border') }
    setBorder(value: string): TComponent { this.writeProperty('border', value); return this; }

}
