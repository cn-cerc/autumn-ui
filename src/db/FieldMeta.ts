/**
 * 
 */

import DataRow from "./DataRow";

export default class FieldMeta {
    code: string = null;
    name: string = null;
    remark: string = null;
    type: string = null;
    kind: string = null;
    private _onGetText: (row: DataRow, meta: FieldMeta) => string;
    OnSetText: any;

    constructor(code: string, kind: string) {
        this.code = code;
        this.kind = kind;
    }

    getCode() {
        return this.code;
    }

    getName() {
        return this.name;
    }

    setName(name: string) {
        this.name = name;
        return this;
    }

    getRemark() {
        return this.remark;
    }

    setRemark(remark: string) {
        this.remark = remark;
        return;
    }

    getType() {
        return this.type;
    }

    setType(type: string) {
        this.type = type;
        return this;
    }

    getKind() {
        return this.kind;
    }

    setKind(kind: string) {
        this.kind = kind;
        return;
    }

    set onGetText(fn: (row: DataRow, meta: FieldMeta) => string) { this._onGetText = fn }
    get onGetText(): (row: DataRow, meta: FieldMeta) => string { return this._onGetText }
}