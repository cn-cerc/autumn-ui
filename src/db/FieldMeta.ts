/**
 * 
 */

import DataRow from "./DataRow";
import { FieldKind } from "./FieldKind";

export default class FieldMeta {
    private _code: string = null;
    private _name: string = null;
    private _remark: string = null;
    private _type: string = null;
    private _kind: number = null;
    private _onGetText: (row: DataRow, meta: FieldMeta) => string;
    private _onSetText: (row: DataRow, meta: FieldMeta, value: string) => void;

    constructor(code: string, kind: number = FieldKind.Memory) {
        this._code = code;
        this._kind = kind;
    }

    set json(value: any) {
        const { code, name, remark, type, kind } = value;
        if (code) {
            if (code != this.code)
                throw new Error(`code(${this.code}) not update`);
        }
        if (name) this._name = name;
        if (remark) this._remark = remark;
        if (type) this._type = type;
        if (kind) this._kind = kind;
    }
    get json(): object {
        let json: any = {};
        json.code = this._code;
        json.name = this._name;
        json.remark = this._remark;
        json.type = this._type;
        json.kind = this._kind;
        return json;
    }

    get code() { return this._code };

    set name(value: string) { this._name = value }
    get name(): string { return this._name }

    set remark(value: string) { this._remark = value }
    get remark(): string { return this._remark }

    set type(value: string) { this._type = value }
    get type(): string { return this._type }

    set kind(value: number) { this._kind = value }
    get kind(): number { return this._kind }

    set onGetText(fn: (row: DataRow, meta: FieldMeta) => string) { this._onGetText = fn }
    get onGetText(): (row: DataRow, meta: FieldMeta) => string { return this._onGetText }

    set onSetText(fn: (row: DataRow, meta: FieldMeta, value: string) => void) { this._onSetText = fn }
    get onSetText(): (row: DataRow, meta: FieldMeta, value: string) => void { return this._onSetText };

}