export default class KeyValue {
    private _key;
    private _value;
    constructor(value: any);
    get key(): string;
    setKey(value: string): KeyValue;
    get value(): any;
    setValue(value: any): KeyValue;
    asString(): string;
    asBoolean(): boolean;
}
