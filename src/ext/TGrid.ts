import TGridGroup from './TGridGroup';
import TGridGroupMaster from './TGridGroupMaster';
import TGridGroupChild from './TGridGroupChild';
import TTable from '../ui/TTable';
import TGridColumn from './TGridColumn';
import TComponent from '../ui/TComponent';
import HtmlWriter from '../ui/HtmlWriter';
import DataSet from '../db/DataSet';
import FieldDefs from '../db/FieldDefs';
import DataControl from '../db/DataControl';

export default class TGrid extends TTable implements DataControl {
    private _dataSet: DataSet;
    private _groups: TGridGroup[] = [];

    constructor(owner: TComponent, props: any = null) {
        super(owner, props);
        this.setBorder('1');
        this.setCssStyle('width:100%');
    }

    get dataSet(): DataSet { return this._dataSet }
    setDataSet(dataSet: DataSet): TGrid {
        this._dataSet = dataSet;
        dataSet.registerBind(this);
        return this;
    }

    output(html: HtmlWriter): void {
        if (this._groups.length == 0 || this._groups[0].getComponentCount() == 0) {
            this.style.set('display', 'none');
        } else {
            this.style.delete('display');
        }

        let sumWidth = 0;
        this.beginOutput(html);

        //先输出主行标题
        let master: TGridGroupMaster = null;
        this._groups.forEach((group) => {
            if (group instanceof TGridGroupMaster) {
                master = group as TGridGroupMaster;
                master.outputOfGridTitle(html);
            }
        });
        //再输出子行标题
        this._groups.forEach((group) => {
            if (group instanceof TGridGroupChild) {
                let child = group as TGridGroupChild;
                child.setMaster(master);
                child.outputOfGridTitle(html);
            }
        });

        //再输出表格数据
        if (this._dataSet) {
            let enable = this._dataSet.bindEnabled;
            this._dataSet.setBindEnabled(false);
            let recNo = this._dataSet.recNo;
            this._dataSet.first();
            while (this._dataSet.fetch()) {
                let row = this._dataSet.getCurrent();
                this._groups.forEach((group) => {
                    group.setCurrent(row);
                    group.output(html);
                });
            }
            this._dataSet.recNo = recNo;
            this._dataSet.setBindEnabled(enable);
        }

        this.endOutput(html);
    }

    addColumns(fieldDefs: FieldDefs): void {
        for (let meta of fieldDefs.fields) {
            if (!this.getColumn(meta.code))
                new TGridColumn(this, meta.code, meta.name ? meta.name : meta.code);
        }
    }

    addComponent(child: TComponent): TGrid {
        if (child instanceof TGridGroup) {
            super.addComponent(child);
            this._groups.push(child);
        } else {
            this.getGroup(0).addComponent(child);
        }
        return this;
    }

    getGroup(index: number): TGridGroup {
        if (index > (this._groups.length - 1)) {
            let max = index - this._groups.length + 1;
            for (let i = 0; i < max; i++) {
                new TGridGroupMaster(this);
            }
        }
        return this._groups[index];
    }

    getColumn(columnCode: string): TGridColumn {
        for (let i = 0; i < this._groups.length; i++) {
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
        this._groups = [];
        this._dataSet = null;
    }

    exportFile(fileName: string): void {
        //CSV格式可以自己设定，适用MySQL导入或者excel打开。
        //由于Excel单元格对于数字只支持15位，且首位为0会舍弃 建议用 =“数值” 
        let str = "";

        // 定义头部
        for (let group of this._groups) {
            group.getComponents().forEach((item) => {
                let column = item as TGridColumn;
                if (column.export)
                    str += column.name + ",";
            });
        }
        str += '\r\n';

        // 具体数值遍历
        this._dataSet.first();
        while (this._dataSet.fetch()) {
            for (let group of this._groups) {
                group.getComponents().forEach((item) => {
                    let column = item as TGridColumn;
                    if (column.export) {
                        let value = this._dataSet.getText(column.code);
                        value = value.replace(/\r|\n|\\s/g, "");// 替换掉内容自带的换行符
                        let dataType = this._dataSet.fieldDefs.get(column.code).type;
                        if (dataType && dataType.indexOf('s') > -1) {
                            if (value.length > 0) {
                                value = '\t' + value;
                                value = value.replace(/,/g, "，");
                            }
                        } else {
                            value = value.replace(/,/g, "，");
                        }
                        str += value + ",";
                    }
                });
            }
            str += '\r\n';// 下一条记录的换行符
        }

        let blob = new Blob([str], { type: "data:text/csv;charset=utf-8" });
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

    doChange(content: any = undefined): void {
        const { size } = content;
        if (size)
            this.repaint();
    }

}

// let json = '{"state":1,"body":[["UID_","corpNo_","code_","name_","sex_","age_","createTime_","updateTime_"],[97,null,12345,"毛巾",0,40,"2021-04-12 15:05:51","2021-05-25 18:06:47"],[98,null,111,"kyi",0,19,"2021-04-12 17:01:55","2021-04-12 17:01:55"],[99,null,555,"寇晶",0,28,"2021-04-12 17:02:27","2021-04-12 17:02:27"],[100,null,423,"朱大福",0,19,"2021-04-12 17:03:02","2021-04-12 19:14:24"],[101,null,321,"sk",1,24,"2021-05-13 08:45:37","2021-05-14 10:52:55"]]}';
// let ds = new DataSet().json = json;
// assertEquals(json, ds.json)

// let grid = new TGrid(null);
// new TGridColumn(grid, "code_", "代码").setWidth(35);
// new TGridColumn(grid, "name_", "名称").setWidth(60);
// new TGridColumn(grid.getGroup(1), "sex_", "性别").setCols('2');
// grid.dataSet = ds;

// ds.fieldDefs.get("sex_").onGetText = (row: DataRow, meta: FieldMeta) => {
//     return row.getValue(meta.code) == 1 ? "男" : "女";
// };

// grid.repaint();

