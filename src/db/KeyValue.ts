export default class KeyValue {
    private _key: string;
    private _value: any;

    constructor(value: any) {
        this._value = value;
    }

    set key(value: string) { this._key = value }
    get key(): string { return this._key };

    set value(value: any) { this._value = value }
    get value(): any { return this._value };

    asString(): string { return '' + this.value }
    asBoolean(): boolean { return this.value ? true : false };
}