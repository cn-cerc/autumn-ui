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

    forEach(callback: any): void {
        let arr = this.fields;
        for (let i = 0; i < arr.length; i++)
            callback(arr[i]);
        return;
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
