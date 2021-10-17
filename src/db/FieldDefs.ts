import FieldMeta from "./FieldMeta";

export default class FieldDefs {
    fields: FieldMeta[] = [];

    add(code: string, name: string = null): FieldMeta {
        if (this.exists(code))
            return this.get(code);
        let item = new FieldMeta(code, name);
        this.fields.push(item);
        return item;
    }

    exists(code: string): boolean {
        for (let i = 0; i < this.fields.length; i++) {
            let meta = this.fields[i];
            if (meta.getCode() == code) {
                return true;
            }
        }
        return false;
    }

    get(code: string): FieldMeta {
        let result = null;
        this.fields.forEach((item) => {
            if (item.getCode() == code) {
                result = item;
                return;
            }
        })
        return result;
    }

    size(): number {
        return this.fields.length;
    }

    clear(): void {
        this.fields = [];
    }

    forEach(fn: ((meta: FieldMeta) => void)) {
        for (let meta of this.fields)
            fn.call(this, meta);
    }

    getItems(): FieldMeta[] {
        return this.fields;
    }

    copy(src: FieldDefs) {
        for (let meta of src.getItems()) {
            if (!this.exists(meta.getCode()))
                this.fields.push(meta);
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
