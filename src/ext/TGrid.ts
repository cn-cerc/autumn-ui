import TGridGroup from './TGridGroup';
import TGridGroupMaster from './TGridGroupMaster';
import TGridGroupChild from './TGridGroupChild';
import TTable from '../ui/TTable';
import TTr from '../ui/TTr';
import TTh from '../ui/TTh';
import TTd from '../ui/TTd';
import TText from '../ui/TText';
import TGridColumn from './TGridColumn';
import TComponent from '../ui/TComponent';
import HtmlWriter from '../ui/HtmlWriter';
import { assertEquals } from '../JUnit';
import DataSet from '../db/DataSet';
import FieldDefs from '../db/FieldDefs';
import DataControl from '../db/DataControl';

export default class TGrid extends TTable implements DataControl {
    dataSet: DataSet;
    groups: TGridGroup[] = [];

    constructor(owner: TComponent, props: any = null) {
        super(owner, props);
        this.setBorder('1');
        this.setCssStyle('width:100%');
    }

    getDataSet(): DataSet {
        return this.dataSet;
    }
    setDataSet(dataSet: DataSet): TGrid {
        this.dataSet = dataSet;
        dataSet.registerBind(this);
        return this;
    }

    output(html: HtmlWriter): void {
        if (this.groups.length == 0 || this.groups[0].getComponentCount() == 0) {
            this.style.set('display', 'none');
        } else {
            this.style.delete('display');
        }

        let sumWidth = 0;
        this.beginOutput(html);

        //先输出主行标题
        let master: TGridGroupMaster = null;
        this.groups.forEach((group) => {
            if (group instanceof TGridGroupMaster) {
                master = group as TGridGroupMaster;
                master.outputOfGridTitle(html);
            }
        });
        //再输出子行标题
        this.groups.forEach((group) => {
            if (group instanceof TGridGroupChild) {
                let child = group as TGridGroupChild;
                child.setMaster(master);
                child.outputOfGridTitle(html);
            }
        });

        //再输出表格数据
        if (this.dataSet) {
            this.dataSet.first();
            while (this.dataSet.fetch()) {
                let row = this.dataSet.getCurrent();
                this.groups.forEach((group) => {
                    group.setCurrent(row);
                    group.output(html);
                });
            }
        }

        this.endOutput(html);
    }

    addColumns(fieldDefs: FieldDefs): void {
        for (let meta of fieldDefs.getItems()) {
            if (!this.getColumn(meta.getCode()))
                new TGridColumn(this, meta.getCode(), meta.getName() ? meta.getName() : meta.getCode());
        }
    }

    addComponent(child: TComponent): TGrid {
        if (child instanceof TGridGroup) {
            super.addComponent(child);
            this.groups.push(child);
        } else {
            this.getGroup(0).addComponent(child);
        }
        return this;
    }

    getGroup(index: number): TGridGroup {
        if (index > (this.groups.length - 1)) {
            let max = index - this.groups.length + 1;
            for (let i = 0; i < max; i++) {
                new TGridGroupMaster(this);
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

    clear() {
        for (let child of this.getComponents())
            child.setOwner(null);
        this.groups = [];
        this.dataSet = null;
    }

    exportFile(fileName: string): void {
        //CSV格式可以自己设定，适用MySQL导入或者excel打开。
        //由于Excel单元格对于数字只支持15位，且首位为0会舍弃 建议用 =“数值” 
        let str = "";

        // 定义头部
        for (let group of this.groups) {
            group.getComponents().forEach((item) => {
                let column = item as TGridColumn;
                if (column.getExport())
                    str += column.getName() + ",";
            });
        }
        str += '\n';

        // 具体数值遍历
        this.dataSet.first();
        while (this.dataSet.fetch()) {
            for (let group of this.groups) {
                group.getComponents().forEach((item) => {
                    let column = item as TGridColumn;
                    if (column.getExport()) {
                        let value = this.dataSet.getText(column.getCode());
                        str += value.replace(/,/g, "，") + ",";
                    }
                });
            }
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

    doChange(): void {
        this.render();
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

