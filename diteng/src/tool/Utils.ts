//@ts-ignore
import { DataSet, FieldMeta, DataRow } from "autumn-ui";
import * as XLSX from "xlsx";

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

    static saveSort(userNo: string, tb: string) {
        let client = new ClientStorage(`diteng_${userNo}`);
        let dataSet = new DataSet();
        let checkboxs = document.querySelectorAll('.dbgrid tr input[type="checkbox"]');
        checkboxs.forEach((checkbox: HTMLInputElement) => {
            dataSet.append();
            dataSet.setValue('field', checkbox.value);
            let bool = checkbox.checked ? 'false' : 'true';
            dataSet.setValue('visible', bool);
        })
        client.set(tb, dataSet.json);
    }

    static removeSort(userNo: string, tb: string) {
        let client = new ClientStorage(`diteng_${userNo}`);
        client.remove(tb);
    }

    static equals(param1: any, param2: any): boolean {
        if (typeof param1 != typeof param2)
            return false;
        if (typeof param1 == 'object' && typeof param2 == 'object') {
            if (Object.keys(param1).length != Object.keys(param2).length)
                return false;
            console.log(param1)
            for (let key in param1) {
                let type1 = typeof param1[key];
                let type2 = typeof param2[key];
                if (type1 == 'object' && type2 == 'object')
                    return Utils.equals(param1[key], param2[key]);
                else if (type1 != type2)
                    return false
                else if (param1[key].toString() != param2[key].toString())
                    return false;
            }
        }
        return true
    }

    static equalsMap(param1: Map<string, any>, param2: Map<string, any>) {
        if (!(param1 instanceof Map) || !(param2 instanceof Map))
            throw new Error('parameter type must be Map');
        if (param1.size != param2.size)
            return false;
        let bool = true;
        param1.forEach((value, key) => {
            if (value != param2.get(key))
                bool = false;
        })
        return bool;
    }
}

export class ClientStorage {
    private section: string;
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


// //引入xlsx
// /**
//  * 导入excel的函数
//  * @param {*} file 
//  */
export const importsExcel = (file: any) => {
    //使用promise导入
    return new Promise((resolve, reject) => {
        // 获取上传的文件对象
        const { files } = file.target; //获取里面的所有文件
        // 通过FileReader对象读取文件
        const fileReader = new FileReader();

        fileReader.onload = event => { //异步操作  excel文件加载完成以后触发
            try {
                const { result } = event.target;
                // 以二进制流方式读取得到整份excel表格对象
                const workbook = XLSX.read(result, { type: 'binary' });
                let data: any[] = []; // 存储获取到的数据
                // 遍历每张工作表进行读取（这里默认只读取第一张表）
                for (const sheet in workbook.Sheets) {
                    if (workbook.Sheets.hasOwnProperty(sheet)) {
                        data = data.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
                    }
                }
                resolve(data);//导出数据
            } catch (e) {
                // 这里可以抛出文件类型错误不正确的相关提示
                reject("失败");//导出失败
            }
        };
        // 以二进制方式打开文件
        fileReader.readAsBinaryString(files[0]);
    })
}

export type excelData = {
    name: string,
    data: DataSet
}

export class Excel {
    excelKey(index: number): string {
        let num = 65;
        let key;
        if (index > 25) {
            key = String.fromCharCode(num + parseInt((index / 26 - 1) + ''))
            key += String.fromCharCode(num + index % 26);
        } else {
            key = String.fromCharCode(num + index);
        }
        return key
    }
    /**
     * 导出excel
     * @param {*} data 
     * @param {*} fileName 
     */
    exportExcel = (data: DataSet, fileName: string = 'demo.xlsx') => {
        // 合并 headers 和 data
        let output: any = {};
        data.fields.items.forEach((item: FieldMeta, index: number) => {
            output[this.excelKey(index) + '1'] = {
                v: item.name,
                key: item.code,
                t: 's',
            }
        })
        data.records.forEach((row: DataRow, no: number) => {
            let serial = no + 2;
            data.fields.items.forEach((item: FieldMeta, index: number) => {
                let bool = row.items.has(item.code);
                let value = item.type == 'n' ? row.getNumber(item.code) : row.getString(item.code);
                output[this.excelKey(index) + serial] = {
                    v: bool ? value : '',
                    t: bool ? item.type : 's',
                }
            })
        })

        // 获取所有单元格的位置
        const outputPos = Object.keys(output);
        // 计算出范围 ,["A1",..., "H2"]
        const ref = `${outputPos[0]}:${outputPos[outputPos.length - 1]}`;

        // 构建 workbook 对象
        const wb = {
            SheetNames: ['Sheet1'],
            Sheets: {
                Sheet1: Object.assign(
                    {},
                    output,
                    {
                        '!ref': ref,
                        // '!cols': [{ wpx: 45 }, { wpx: 100 }, { wpx: 200 }, { wpx: 80 }, { wpx: 150 }, { wpx: 100 }, { wpx: 300 }, { wpx: 300 }],
                    },
                ),
            },
        };
        // 导出 Excel
        XLSX.writeFile(wb, fileName);
    }

    // 根据DataSet中的records来生成excel表格
    exportExcelByRecords = (data: DataSet, fileName: string = 'demo.xlsx') => {
        let output: any = {};
        data.records.forEach((row: DataRow, no: number) => {
            let serial = no + 1;
            data.fields.items.forEach((item: FieldMeta, index: number) => {
                let value = row.getValue(item.code);
                let bool = typeof value == 'object' && value != null;
                output[this.excelKey(index) + serial] = {
                    v: bool ? value.text : row.getString(item.code),
                    t: bool ? 'n' : 's',
                }
            })
        })
        // 获取所有单元格的位置
        const outputPos = Object.keys(output);
        // 计算出范围 ,["A1",..., "H2"]
        const ref = `${outputPos[0]}:${outputPos[outputPos.length - 1]}`;
        // 构建 workbook 对象
        const wb = {
            SheetNames: ['Sheet1'],
            Sheets: {
                Sheet1: Object.assign(
                    {},
                    output,
                    {
                        '!ref': ref,
                        // '!cols': [{ wpx: 45 }, { wpx: 100 }, { wpx: 200 }, { wpx: 80 }, { wpx: 150 }, { wpx: 100 }, { wpx: 300 }, { wpx: 300 }],
                    },
                ),
            },
        };
        // 导出 Excel
        XLSX.writeFile(wb, fileName);
    }

    // 根据Execl流文件生成DataSet集合
    getDataByArrayBuffer(data: ArrayBuffer) {
        const workbook = XLSX.read(data, { type: 'binary' });
        let map = new Map();
        // 遍历每张工作表进行读取（这里默认只读取第一张表）
        for (const sheet in workbook.Sheets) {
            if (workbook.Sheets.hasOwnProperty(sheet)) {
                map.set(sheet, XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
            }
        }
        let sheets: any[] = [];
        let dataList: excelData[] = [];
        map.forEach((value: object[], key: string) => {
            sheets.push(key);
            let data = new DataSet()
            let bool = false;
            let heads: string[] = []
            value.forEach((obj: object) => {
                data.append();
                if (bool == false) {
                    heads = Object.keys(obj);
                    bool = true
                }
                heads.forEach((head: string) => {
                    //@ts-ignore
                    data.setValue(head, obj[head]);
                })
            })
            dataList.push({
                name: key,
                data
            })
        })
        return dataList;
    }
}