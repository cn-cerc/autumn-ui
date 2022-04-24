import FieldMeta from "./FieldMeta";
export default class FieldDefs {
    private _items;
    get json(): object;
    setJson(json: any): FieldDefs;
    add(code: string, kind?: number): FieldMeta;
    exists(code: string): boolean;
    get(code: string): FieldMeta;
    get size(): number;
    clear(): void;
    forEach(fn: ((meta: FieldMeta) => void)): void;
    get items(): FieldMeta[];
    copy(src: FieldDefs): void;
}
