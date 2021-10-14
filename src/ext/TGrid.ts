import TGridGroup from './TGridGroup';
import TTable from '../ui/TTable';
import TTr from '../ui/TTr';
import TTh from '../ui/TTh';
import TTd from '../ui/TTd';
import TText from '../ui/TText';
import TGridColumn from './TGridColumn';
import { DataRow, DataSet, FieldDefs, FieldMeta } from '../SummerCI';
import TComponent from '../ui/TComponent';
import HtmlWriter from '../ui/HtmlWriter';
import { assertEquals } from '../JUnit';

export default class TGrid extends TTable {
    dataSet: DataSet;
    groups: TGridGroup[] = [];

    constructor(owner: TComponent) {
        super(owner);
        this.setBorder('1');
    }

    setDataSet(dataSet: DataSet): TGrid {
        this.dataSet = dataSet;
        return this;
    }

    output(html: HtmlWriter): void {
        let sumWidth = 0;
        this.beginOutput(html);

        this.groups.forEach((group) => {
            if (!group.getTitleVisiable())
                return;
            let tr = new TTr();
            group.forEach((child: TGridColumn) => {
                if (!child.getVisible())
                    return;
                let th = new TTh(tr);
                if (child.getCols())
                    th.writerProperty("colspan", child.getCols());
                if (group.getTotalWidth() > 0 && child.getWidth() > 0) {
                    let rate = child.getWidth() / group.getTotalWidth() * 100;
                    th.writerProperty("width", rate.toFixed(1) + "%");
                }
                new TText(th).setText(child.getName());
            });
            tr.output(html);
        });

        if (this.dataSet) {
            for (let row of this.dataSet.getRecords()) {
                this.groups.forEach((group) => {
                    let notNull = false;
                    let tr = new TTr();
                    group.forEach((child: TGridColumn) => {
                        if (!child.getVisible())
                            return;
                        let value = row.getText(child.getCode());
                        let td = new TTd(tr);
                        if (child.getCols())
                            td.writerProperty("colspan", child.getCols());

                        if (child.getAlign()) {
                            td.writerProperty("align", child.getAlign());
                        }
                        new TText(td).setText(value);
                        if (value)
                            notNull = true;
                    });
                    if (notNull)
                        tr.output(html);
                });
            }
        }

        this.endOutput(html);
    }

    addColumns(fieldDefs: FieldDefs): void {
        for (let meta of fieldDefs.getItems()) {
            new TGridColumn(this, meta.getCode(), meta.getName() ? meta.getName() : meta.getCode());
        };
    }

    addComponent(child: TComponent): TGrid {
        if (child instanceof TGridGroup) {
            super.addComponent(child);
        } else {
            this.getGroup(0).addComponent(child);
        }
        return this;
    }

    getGroup(index: number): TGridGroup {
        if (index > (this.groups.length - 1)) {
            let max = index - this.groups.length + 1;
            for (let i = 0; i < max; i++) {
                this.groups.push(new TGridGroup(this));
            }
        }
        return this.groups[index];
    }

    getColumn(columnCode: string): TGridColumn {
        for (let i = 0; i < this.groups.length; i++) {
            let group = this.getGroup(i);
            let column = group.getColumn(columnCode);
            if (column)
                return column;
        }
        return null;
    }

    exportFile(fileName: string): void {
        //CSV格式可以自己设定，适用MySQL导入或者excel打开。
        //由于Excel单元格对于数字只支持15位，且首位为0会舍弃 建议用 =“数值” 
        let group = this.getGroup(0);
        let str = "";

        // 定义头部
        group.getComponents().forEach((item) => {
            let column = item as TGridColumn;
            if (column.getExport())
                str += column.getName() + ",";
        });
        str += '\n';

        // 具体数值遍历
        this.dataSet.first();
        while (this.dataSet.fetch()) {
            group.getComponents().forEach((item) => {
                let column = item as TGridColumn;
                if (column.getExport()) {
                    let value = this.dataSet.getText(column.getCode());
                    str += value.replace(/,/g, "，") + "\t,";
                }
            });
            str += '\n';
        }

        let blob = new Blob([str], { type: "text/plain;charset=utf-8" });
        //解决中文乱码问题
        blob = new Blob([String.fromCharCode(0xFEFF), blob], { type: blob.type });
        let object_url = window.URL.createObjectURL(blob);
        let link = document.createElement("a");
        link.href = object_url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

}

// let json = '{"state":1,"body":[["UID_","corpNo_","code_","name_","sex_","age_","createTime_","updateTime_"],[97,null,12345,"毛巾",0,40,"2021-04-12 15:05:51","2021-05-25 18:06:47"],[98,null,111,"kyi",0,19,"2021-04-12 17:01:55","2021-04-12 17:01:55"],[99,null,555,"寇晶",0,28,"2021-04-12 17:02:27","2021-04-12 17:02:27"],[100,null,423,"朱大福",0,19,"2021-04-12 17:03:02","2021-04-12 19:14:24"],[101,null,321,"sk",1,24,"2021-05-13 08:45:37","2021-05-14 10:52:55"]]}';
// let ds = new DataSet().setJson(json);
// assertEquals(json, ds.getJson())

// let grid = new TGrid(null);
// new TGridColumn(grid, "code_", "代码").setWidth(35);
// new TGridColumn(grid, "name_", "名称").setWidth(60);
// new TGridColumn(grid.getGroup(1), "sex_", "性别").setCols('2');
// grid.setDataSet(ds);

// ds.getFieldDefs().get("sex_").onGetText = (row: DataRow, meta: FieldMeta) => {
//     return row.getValue(meta.getCode()) == 1 ? "男" : "女";
// };

// grid.render();

