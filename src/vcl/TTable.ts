import TComponent from "./TComponent";

export default class TTable extends TComponent {
    constructor(owner: TComponent, props: object = null) {
        super(owner, props);
        this.setRootLabel('table');
    }

    get border(): string { return this.readProperty('border') }
    setBorder(value: string): TComponent { this.writeProperty('border', value); return this; }
}

export class TTr extends TComponent {
    constructor(owner: TComponent = null) {
        super(owner);
        this.setRootLabel("tr");
    }
}

export class TTh extends TComponent {
    constructor(owner: TComponent) {
        super(owner);
        this.setRootLabel("th");
    }
}

export  class TTd extends TComponent {
    constructor(owner: TComponent) {
        super(owner);
        this.setRootLabel("td");
    }
}