import { FieldKind } from "./FieldKind";
import FieldMeta from "./FieldMeta";

export default class FieldDefs {
    private _items: FieldMeta[] = [];

    get json(): object {
        let json: any = [];
        for (let meta of this._items)
            json.push(meta.json);
        return json;
    }
    setJson(json: any): FieldDefs {
        this._items = [];
        for (let field of json) {
            const { code, kind, remark, type } = field;
            let meta = new FieldMeta(code, kind);
            meta.setRemark(remark);
            meta.setType(type);
            this._items.push(meta);
        }
        return this;
    }

    add(code: string, kind: number = FieldKind.Memory): FieldMeta {
        if (this.exists(code))
            return this.get(code);
        let item = new FieldMeta(code, kind);
        this._items.push(item);
        return item;
    }

    exists(code: string): boolean {
        for (let i = 0; i < this._items.length; i++) {
            let meta = this._items[i];
            if (meta.code == code) {
                return true;
            }
        }
        return false;
    }

    get(code: string): FieldMeta {
        let result = null;
        this._items.forEach((item) => {
            if (item.code == code) {
                result = item;
                return;
            }
        })
        return result;
    }

    get size(): number { return this._items.length }

    clear(): void { this._items = [] }

    forEach(fn: ((meta: FieldMeta) => void)) {
        for (let meta of this._items)
            fn.call(this, meta);
    }

    get items(): FieldMeta[] { return this._items }

    copy(src: FieldDefs) {
        for (let meta of src.items) {
            if (!this.exists(meta.code))
                this._items.push(meta);
        }
    }

}

// let defs = new FieldDefs();
// defs.add('code');
// defs.add('name').setName('名称');
// defs.add('code');
// defs.get('code').setName('代码').setType('s0');
// defs.forEach((item) => {
//     console.log(item);
// })
