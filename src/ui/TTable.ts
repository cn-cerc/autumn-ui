import TComponent from "./TComponent";

export default class TTable extends TComponent {

    constructor(owner: TComponent, props: object = null) {
        super(owner, props);
        this.rootLabel = 'table';
    }

    set border(value: string) { this.writeProperty('border', value) }
    get border(): string { return this.readProperty('border') }

}
