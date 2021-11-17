import DataControl from '../db/DataControl';
import DataRow from '../db/DataRow';
import DataSet from '../db/DataSet';
import FieldDefs from '../db/FieldDefs';
import KeyValue from '../db/KeyValue';
import TComponent, { HtmlWriter } from './TComponent';
import TTable, { TTd, TTh, TTr } from './TTable';
import TText from './TText';

export default class TGrid extends TTable implements DataControl {
    private _dataSet: DataSet;
    private _groups: TGridGroup[] = [];

    constructor(owner: TComponent, props: any = null) {
        super(owner, props);
        this.setBorder('1');
        this.setCssStyle('width:100%');
    }

    get dataSet(): DataSet {
        return this._dataSet
    }

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
                let row = this._dataSet.current;
                this._groups.forEach((group) => {
                    group.setCurrent(row);
                    group.output(html);
                });
            }
            this._dataSet.setRecNo(recNo);
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

    /**
     * 将dataSet与后台交换生成excel文件
     * @param exportUrl 后台excel转换网址
     * @param filename  要导出的文件名称
     */
    exportExcel(exportUrl: string, filename: string): void {
        let dataIn = new DataSet();

        // 复制要导出的栏位数据
        this.dataSet.first();
        while (this.dataSet.fetch()) {
            dataIn.append();
            for (let group of this._groups) {
                group.getComponents().forEach((item) => {
                    let column = item as TGridColumn;
                    if (column.export) {
                        let code = column.code;
                        let value = this.dataSet.getText(code);
                        value = value.replace(/\r|\n|\\s/g, "");// 替换掉内容自带的换行符
                        value = value.replace(/,/g, "，");// 将英文逗号替换为中文逗号
                        dataIn.setValue(code, value);
                    }
                });
            }
        }

        // 构建要导出的数据栏位
        dataIn.setMetaInfo(true);
        let newFields = dataIn.fieldDefs;
        let oldFields = this.dataSet.fieldDefs;
        for (let group of this._groups) {
            group.getComponents().forEach((item) => {
                let column = item as TGridColumn;
                // 为新的数据集栏位赋予名字
                newFields.forEach(meta => {
                    if (meta.code == column.code) {
                        meta.setName(column.name);
                    }
                });
            });
        }

        // 发送dataSet与后台交换生成excel文件
        fetch(exportUrl + "?filename=" + filename, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: dataIn.jsonString,
        }).then(response => response.blob())
            .then(blob => {
                TGrid.download(filename, blob);
            });
    }

    /**
     * 输出纯文本的csv格式
     */
    exportText(fileName: string): void {
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
                                value = '\t' + value;// 标记为文本栏位
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

        // 解决Windows中文乱码问题
        str = "\uFEFF" + str;
        let blob = new Blob([str], { type: "application/vnd.ms-excel" });
        TGrid.download(fileName, blob);
    }

    /**
     *  构建下载链接
     *
     * @param fileName 文件名称（自带后缀名）
     * @param blob 大数据快
     */
    private static download(fileName: string, blob: Blob): void {
        let now = new Date();
        let date = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();
        fileName = date + '_' + fileName;

        const objectURL = URL.createObjectURL(blob);
        let downloadElement = document.createElement("a");
        downloadElement.style.display = 'none';
        downloadElement.href = objectURL;
        downloadElement.download = fileName;
        document.body.appendChild(downloadElement);
        downloadElement.click();
        document.body.removeChild(downloadElement);
    }

    doChange(content: any = undefined): void {
        const { size } = content;
        if (size)
            this.repaint();
    }
}

interface onRenderType {
    (column: TGridColumn, row: DataRow): React.ReactNode;
}

export class TGridColumn extends TComponent {
    private _code: string;
    private _name: string;
    private _width: number = 0;
    private _align: string;
    private _export = true;
    private _onRender: onRenderType;

    constructor(owner: TGrid | TGridGroupMaster | TGridGroupChild | TGridConfig, code: string, name: string = null) {
        super(owner);
        this._code = code;
        this._name = name ? name : code;
    }

    get code(): string {
        return this._code
    }

    get name() {
        return this._name
    }

    get colSpan(): string {
        return this.readProperty("colspan");
    }

    setColSpan(value: string): TGridColumn {
        this.writeProperty("colspan", value);
        return this;
    }

    get width(): number {
        return this._width
    }

    setWidth(value: number): TGridColumn {
        this._width = value;
        return this;
    }

    get align(): string {
        return this._align
    }

    setAlign(value: string) {
        this._align = value;
        return this;
    }

    get export(): boolean {
        return this._export;
    }

    setExport(value: boolean): TGridColumn {
        this._export = value;
        return this;
    }

    get onRender(): onRenderType {
        return this._onRender
    }

    setOnRender(value: onRenderType) {
        this._onRender = value;
        return this;
    }

}

const MaxWidth = 600;

interface IGroupOnOutput {
    (child: TGridGroup, display: KeyValue): void
}

export class TGridGroup extends TComponent {
    private _titleVisiable: boolean = true;
    private _current: DataRow;
    private _master: TGridGroup;
    private _onOutput: IGroupOnOutput;

    constructor(owner: TComponent) {
        super(owner);
    }

    get current(): DataRow {
        return this._current
    }

    setCurrent(row: DataRow) {
        this._current = row;
    }

    get titleVisiable() {
        return this._titleVisiable
    }

    setTitleVisiable(value: boolean): TGridGroup {
        this._titleVisiable = value;
        return this;
    }

    getTotalWidth() {
        let result = 0;
        this.getComponents().forEach((item) => {
            if (item instanceof TGridColumn)
                result = result + item.width;
        });
        if (result < 0) {
            throw new Error("总列宽不允许小于1");
        }
        if (result > MaxWidth) {
            throw new Error(`总列宽不允许大于 ${MaxWidth}`);
        }
        return result;
    }

    get columns(): TGridColumn[] {
        let items: TGridColumn[] = [];
        for (let item of this.getComponents()) {
            if (item instanceof TGridColumn)
                items.push(item as TGridColumn);
        }
        return items;
    }

    getColumnCount(): number {
        return this.columns.length;
    }

    getColumn(columnCode: string): TGridColumn {
        for (let item of this.getComponents()) {
            let column = item as TGridColumn;
            if (column.code == columnCode)
                return column;
        }
        return null;
    }

    forEach(fn: (column: TGridColumn) => void) {
        for (let item of this.getComponents()) {
            if (item instanceof TGridColumn)
                fn.call(this, item as TGridColumn);
        }
    }

    get master() {
        return this._master
    }

    setMaster(value: TGridGroup): TGridGroup {
        this._master = value;
        return this;
    }

    get onOutput(): IGroupOnOutput {
        return this._onOutput
    }

    setOnOutput(value: IGroupOnOutput): TGridGroup {
        this._onOutput = value;
        return this;
    }

    outputOfGridTitle(html: HtmlWriter) {
        if (!this.titleVisiable)
            return;
        let tr = new TTr();
        for (let item of this.getComponents()) {
            if (item instanceof TGridColumn) {
                let child = item as TGridColumn;
                if (!child.visible)
                    continue;
                let th = new TTh(tr);
                if (child.colSpan)
                    th.writeProperty("colspan", child.colSpan);
                if (this.getTotalWidth() > 0 && child.width > 0) {
                    let rate = child.width / this.getTotalWidth() * 100;
                    th.writeProperty("width", rate.toFixed(1) + "%");
                }
                new TText(th, { text: child.name });
            }
        }
        tr.output(html);
    }

}

export class TGridGroupChild extends TGridGroup {

    constructor(owner: TComponent) {
        super(owner);
        this.setTitleVisiable(false);
        this.setVisible(false);
    }

    output(html: HtmlWriter) {
        let display = new KeyValue(this.visible);
        if (this.onOutput) {
            this.onOutput(this, display);
        }

        let it = 0;
        for (let child of this.owner.getComponents()) {
            if (child == this)
                break;
            it = it + 1;
        }

        let value: string = "";
        this.forEach((child: TGridColumn) => {
            if (child.visible) {
                let text = this.current.getText(child.code);
                if (text)
                    value = value + child.name + ": " + text + " ";
            }
        });

        if (value.length > 0) {
            let tr = new TTr();
            tr.setId('tr' + this.current.dataSet.recNo + "_" + it);
            if (!display.asBoolean())
                tr.setCssStyle('display:none');
            let td = new TTd(tr);
            if (this.master)
                td.writeProperty("colspan", "" + this.master.getColumnCount());
            new TText(td, { text: value });
            tr.output(html);
        }
    }

}

export class TGridGroupMaster extends TGridGroup {

    constructor(owner: TComponent) {
        super(owner);
    }

    output(html: HtmlWriter): void {
        let notNull = false;
        let tr = new TTr();
        tr.setId('tr' + this.current.dataSet.recNo);
        this.forEach((child: TGridColumn) => {
            if (!child.visible)
                return;
            let value = this.current.getText(child.code);
            let td = new TTd(tr);
            if (child.colSpan)
                td.writeProperty("colspan", child.colSpan);

            if (child.align) {
                td.writeProperty("align", child.align);
            }
            new TText(td, { text: value });
            if (value)
                notNull = true;
        });
        if (notNull)
            tr.output(html);
    }

}

interface IOnOutput {
    (child: TGridConfig, display: KeyValue): void
}

export class TGridConfig extends TComponent {
    private _dataSet: DataSet
    private _titleVisiable: boolean = true;
    private _current: DataRow;
    private _children: TGridConfig[] = [];
    private _onOutput: (child: TGridConfig, display: KeyValue) => void;

    constructor(owner: TGridConfig = null) {
        super(owner);
    }

    get current(): DataRow {
        return this._current
    }

    setCurrent(row: DataRow) {
        this._current = row;
    }

    get titleVisiable() {
        return this._titleVisiable
    }

    setTitleVisiable(value: boolean): TGridConfig {
        this._titleVisiable = value;
        return this;
    }

    getTotalWidth() {
        let result = 0;
        this.getComponents().forEach((item) => {
            if (item instanceof TGridColumn)
                result = result + item.width;
        });
        if (result < 0) {
            throw new Error("总列宽不允许小于1");
        }
        if (result > MaxWidth) {
            throw new Error(`总列宽不允许大于 ${MaxWidth}`);
        }
        return result;
    }

    get columns(): TGridColumn[] {
        let items: TGridColumn[] = [];
        for (let item of this.getComponents()) {
            if (item instanceof TGridColumn)
                items.push(item as TGridColumn);
        }
        return items;
    }

    getColumn(columnCode: string): TGridColumn {
        for (let item of this.getComponents()) {
            let column = item as TGridColumn;
            if (column.code == columnCode)
                return column;
        }
        return null;
    }

    get master(): TGridConfig {
        if (this.owner instanceof TGridConfig)
            return this.owner as TGridConfig;
        else
            return null;
    }

    newChild(): TGridConfig {
        let child = new TGridConfig(this);
        this._children.push(child);
        return child;
    }

    get children(): TGridConfig[] {
        return this._children
    }

    get onOutput(): IOnOutput {
        return this._onOutput
    }

    setOnOutput(value: IOnOutput): TGridConfig {
        this._onOutput = value;
        return this;
    }

    get dataSet(): DataSet {
        return this._dataSet
    };

    setDataSet(value: DataSet): TGridConfig {
        this._dataSet = value;
        return this;
    };
}

interface onRenderType {
    (column: GridColumn, row: DataRow): React.ReactNode;
}

export class GridColumn extends TComponent {
    private _code: string;
    private _name: string;
    private _width: number = 0;
    private _align: string;
    private _export = true;
    private _onRender: onRenderType;

    constructor(owner: TGridConfig, code: string, name: string = null) {
        super(owner);
        this._code = code;
        this._name = name ? name : code;
    }

    get code(): string {
        return this._code
    }

    get name() {
        return this._name
    }

    get colSpan(): string {
        return this.readProperty("colspan");
    }

    setColSpan(value: string): GridColumn {
        this.writeProperty("colspan", value);
        return this;
    }

    get width(): number {
        return this._width
    }

    setWidth(value: number): GridColumn {
        this._width = value;
        return this;
    }

    get align(): string {
        return this._align
    }

    setAlign(value: string) {
        this._align = value;
        return this;
    }

    get export(): boolean {
        return this._export;
    }

    setExport(value: boolean): GridColumn {
        this._export = value;
        return this;
    }

    get onRender(): onRenderType {
        return this._onRender
    }

    setOnRender(value: onRenderType) {
        this._onRender = value;
        return this;
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

