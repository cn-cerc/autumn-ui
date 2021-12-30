export default class Utils {
    static guid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    // 获取当前月份第一天
    static getMonthStartDay() {
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        return `${year}-${month < 10 ? '0' + month : month}-01`
    }

    // 获取当前月份最后一天
    static getMonthEndDay() {
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        return `${year}-${month < 10 ? '0' + month : month}-${new Date(year, month, 0).getDate()}`
    }
}

export class ClientStorage {
    private section:string;
    constructor(section: string) {
        this.section = section;
    }

    set(key: string, value: any): void {
        localStorage.setItem(this.section + '_' + key, value);
    }

    get(key: string, def?: any): any {
        return localStorage.getItem(this.section + '_' + key) || def;
    }

    remove(key: string): void {
        localStorage.removeItem(this.section + '_' + key);
    }
}
