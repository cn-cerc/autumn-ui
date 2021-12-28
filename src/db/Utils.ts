
// @ts-ignore
import XLSX from "xlsx";
import DataRow from "./DataRow";
import DataSet from "./DataSet";
import FieldMeta from "./FieldMeta";

export default class Utils {
    static guid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}


// //引入xlsx
// /**
//  * 导入excel的函数
//  * @param {*} file 
//  */
// const importsExcel = (file) => {
//     //使用promise导入
//     return new Promise((resolve, reject) => {
//         // 获取上传的文件对象
//         const { files } = file.target; //获取里面的所有文件
//         // 通过FileReader对象读取文件
//         const fileReader = new FileReader();

//         fileReader.onload = event => { //异步操作  excel文件加载完成以后触发
//             try {
//                 const { result } = event.target;
//                 // 以二进制流方式读取得到整份excel表格对象
//                 const workbook = XLSX.read(result, { type: 'binary' });
//                 let data = []; // 存储获取到的数据
//                 // 遍历每张工作表进行读取（这里默认只读取第一张表）
//                 for (const sheet in workbook.Sheets) {
//                     if (workbook.Sheets.hasOwnProperty(sheet)) {
//                         data = data.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
//                     }
//                 }
//                 resolve(data);//导出数据
//             } catch (e) {
//                 // 这里可以抛出文件类型错误不正确的相关提示
//                 reject("失败");//导出失败
//             }
//         };
//         // 以二进制方式打开文件
//         fileReader.readAsBinaryString(files[0]);
//     })

// }
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
                key: item.code
            }
        })
        data.records.forEach((row: DataRow, no: number) => {
            let serial = no + 2;
            data.fields.items.forEach((item: FieldMeta, index: number) => {
                output[this.excelKey(index) + serial] = {
                    v: row.getString(item.code)
                }
            })
        })
        console.log(output);
        // 获取所有单元格的位置
        const outputPos = Object.keys(output);
        // 计算出范围 ,["A1",..., "H2"]
        const ref = `${outputPos[0]}:${outputPos[outputPos.length - 1]}`;

        // 构建 workbook 对象
        const wb = {
            SheetNames: ['mySheet'],
            Sheets: {
                mySheet: Object.assign(
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
}