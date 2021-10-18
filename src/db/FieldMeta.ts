/**
 * 
 */

import DataRow from "./DataRow";

export default class FieldMeta {
    private _code: string = null;
    private _name: string = null;
    private _remark: string = null;
    private _type: string = null;
    private _kind: string = null;
    private _onGetText: (row: DataRow, meta: FieldMeta) => string;
    private _onSetText: (row: DataRow, meta: FieldMeta, value: string) => void;

    constructor(code: string, kind: string) {
        this._code = code;
        this._kind = kind;
    }

    getCode() {
        return this._code;
    }

    getName() {
        return this._name;
    }

    setName(name: string) {
        this._name = name;
        return this;
    }

    getRemark() {
        return this._remark;
    }

    setRemark(remark: string) {
        this._remark = remark;
        return;
    }

    getType() {
        return this._type;
    }

    setType(type: string) {
        this._type = type;
        return this;
    }

    getKind() {
        return this._kind;
    }

    setKind(kind: string) {
        this._kind = kind;
        return;
    }

    set onGetText(fn: (row: DataRow, meta: FieldMeta) => string) { this._onGetText = fn }
    get onGetText(): (row: DataRow, meta: FieldMeta) => string { return this._onGetText }

    set onSetText(fn: (row: DataRow, meta: FieldMeta, value: string) => void) { this._onSetText = fn }
    get onSetText(): (row: DataRow, meta: FieldMeta, value: string) => void { return this._onSetText };

}