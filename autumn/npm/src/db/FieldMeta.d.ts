import DataRow from "./DataRow";
export declare type OnGetText = (row: DataRow, meta: FieldMeta) => string;
export declare type OnSetText = (row: DataRow, meta: FieldMeta, value: string) => void;
export default class FieldMeta {
    private _code;
    private _name;
    private _remark;
    private _type;
    private _kind;
    private _onGetText;
    private _onSetText;
    constructor(code: string, kind?: number);
    get json(): object;
    setJson(value: any): FieldMeta;
    get code(): string;
    get name(): string;
    setName(value: string): FieldMeta;
    get remark(): string;
    setRemark(value: string): FieldMeta;
    get type(): string;
    setType(value: string): FieldMeta;
    get kind(): number;
    setKind(value: number): FieldMeta;
    get onGetText(): OnGetText;
    setOnGetText(value: OnGetText): FieldMeta;
    get onSetText(): OnSetText;
    setOnSetText(value: OnSetText): FieldMeta;
}
