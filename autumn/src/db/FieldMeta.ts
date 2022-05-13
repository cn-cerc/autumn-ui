import DataRow from "./DataRow";
import { FieldKind } from "./FieldKind";

export type OnGetText = (row: DataRow, meta: FieldMeta) => string;
export type OnSetText = (row: DataRow, meta: FieldMeta, value: string) => void;

export default class FieldMeta {
    private _code: string = null;
    private _name: string = null;
    private _remark: string = null;
    private _type: string = null;
    private _kind: number = null;
    private _onGetText: OnGetText;
    private _onSetText: OnSetText;

    constructor(code: string, kind: number = FieldKind.Memory) {
        this._code = code;
        this._kind = kind;
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
    setJson(value: any): FieldMeta {
        const { code, name, remark, type, kind } = value;
        if (code && (code != this.code))
            throw new Error(`code(${this.code}) not update`);
        if (name) this._name = name;
        if (remark) this._remark = remark;
        if (type) this._type = type;
        if (kind) this._kind = kind;
        return this;
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

    get onGetText(): OnGetText { return this._onGetText }
    setOnGetText(value: OnGetText): FieldMeta { this._onGetText = value; return this; }

    get onSetText(): OnSetText { return this._onSetText };
    setOnSetText(value: OnSetText): FieldMeta { this._onSetText = value; return this; }

}