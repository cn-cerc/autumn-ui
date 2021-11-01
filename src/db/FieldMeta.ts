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

    get name(): string { return this._name }
    setName(value: string): FieldMeta { this._name = value; return this; }

    get remark(): string { return this._remark }
    setRemark(value: string): FieldMeta { this._remark = value; return this; }

    get type(): string { return this._type }
    setType(value: string): FieldMeta { this._type = value; return this; }

    get kind(): number { return this._kind }
    setKind(value: number): FieldMeta { this._kind = value; return this; }

    set onGetText(fn: (row: DataRow, meta: FieldMeta) => string) { this._onGetText = fn }
    get onGetText(): (row: DataRow, meta: FieldMeta) => string { return this._onGetText }

    set onSetText(fn: (row: DataRow, meta: FieldMeta, value: string) => void) { this._onSetText = fn }
    get onSetText(): (row: DataRow, meta: FieldMeta, value: string) => void { return this._onSetText };

}