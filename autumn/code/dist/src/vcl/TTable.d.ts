import TComponent from "./TComponent";
export default class TTable extends TComponent {
    constructor(owner: TComponent, props?: object);
    get border(): string;
    setBorder(value: string): TComponent;
}
export declare class TTr extends TComponent {
    constructor(owner?: TComponent);
}
export declare class TTh extends TComponent {
    constructor(owner: TComponent);
}
export declare class TTd extends TComponent {
    constructor(owner: TComponent);
}
