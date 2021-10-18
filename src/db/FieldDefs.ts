import FieldMeta from "./FieldMeta";

export default class FieldDefs {
    private _fields: FieldMeta[] = [];

    add(code: string, name: string = null): FieldMeta {
        if (this.exists(code))
            return this.get(code);
        let item = new FieldMeta(code, name);
        this._fields.push(item);
        return item;
    }

    exists(code: string): boolean {
        for (let i = 0; i < this._fields.length; i++) {
            let meta = this._fields[i];
            if (meta.getCode() == code) {
                return true;
            }
        }
        return false;
    }

    get(code: string): FieldMeta {
        let result = null;
        this._fields.forEach((item) => {
            if (item.getCode() == code) {
                result = item;
                return;
            }
        })
        return result;
    }

    get size(): number { return this._fields.length }

    clear(): void { this._fields = [] }

    forEach(fn: ((meta: FieldMeta) => void)) {
        for (let meta of this._fields)
            fn.call(this, meta);
    }

    get fields(): FieldMeta[] { return this._fields }

    copy(src: FieldDefs) {
        for (let meta of src.fields) {
            if (!this.exists(meta.getCode()))
                this._fields.push(meta);
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
