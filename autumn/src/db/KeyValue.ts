export default class KeyValue {
    private _key: string;
    private _value: any;

    constructor(value: any) {
        this._value = value;
    }

    get key(): string { return this._key };
    setKey(value: string): KeyValue { this._key = value; return this }

    get value(): any { return this._value };
    setValue(value: any): KeyValue { this._value = value; return this }

    asString(): string { return '' + this.value }
    asBoolean(): boolean { return this.value ? true : false };
}