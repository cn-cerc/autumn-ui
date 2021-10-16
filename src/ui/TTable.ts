import TComponent from "./TComponent";

export default class TTable extends TComponent {

    constructor(owner: TComponent, id: string = null) {
        super(owner, id);
        this.setRootLabel('table');
    }

    setBorder(value: string) {
        this.writeProperty('border', value)
        return this;
    }

    getBorder(): string {
        return this.readProperty('border');
    }

}
