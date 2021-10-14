import TComponent from "./TComponent";

export default class TTable extends TComponent {

    constructor(owner: TComponent) {
        super(owner);
        this.setRootLabel('table');
    }

    setBorder(value: string) {
        this.writerProperty('border', value)
        return this;
    }

    getBorder(): string {
        return this.readProperty('border');
    }

}
